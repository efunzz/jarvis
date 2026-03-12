import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import type { Context } from "grammy";
import { analyze } from "../services/claude";
import { sendLongMessage } from "../bot";

const PROFILE_PATH = join(import.meta.dir, "../../data/profile.json");

export async function loadProfile(): Promise<Record<string, unknown>> {
  try {
    const data = await readFile(PROFILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      name: "",
      title: "",
      summary: "",
      skills: {},
      experience: [],
      projects: [],
      github: "",
    };
  }
}

async function saveProfile(profile: Record<string, unknown>): Promise<void> {
  await mkdir(join(import.meta.dir, "../../data"), { recursive: true });
  await writeFile(PROFILE_PATH, JSON.stringify(profile, null, 2), "utf-8");
}

const updateSystemPrompt = `You are a profile data manager. The user wants to update their stored career profile JSON.

Given the current profile JSON and the user's update request, return ONLY a valid JSON object representing the complete updated profile. Merge the new information intelligently:
- Add new skills to the appropriate category
- Add new projects or experience entries
- Update existing entries if the user is correcting something
- Never remove existing data unless explicitly asked

Return ONLY the JSON object, no other text or markdown.`;

export async function handleUpdateProfile(ctx: Context): Promise<void> {
  const text = ctx.message?.text || "";
  const updateRequest = text.replace(/^\/updateprofile\s*/i, "").trim();

  if (!updateRequest) {
    await ctx.reply(
      "Tell me what to update in your profile.\n\n" +
        "Examples:\n" +
        '- `/updateprofile add Python to my skills`\n' +
        '- `/updateprofile I just built a Slack bot using Bolt framework`\n' +
        '- `/updateprofile update my title to Platform Engineer`',
      { parse_mode: "Markdown" },
    );
    return;
  }

  await ctx.api.sendChatAction(ctx.chat!.id, "typing");

  try {
    const currentProfile = await loadProfile();
    const prompt = `Current profile:\n${JSON.stringify(currentProfile, null, 2)}\n\nUpdate request: ${updateRequest}`;
    const response = await analyze(updateSystemPrompt, prompt);

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      await ctx.reply("Failed to process the update. Please try again.");
      return;
    }

    const updatedProfile = JSON.parse(jsonMatch[0]);
    await saveProfile(updatedProfile);

    await sendLongMessage(
      ctx,
      "✅ Profile updated successfully!\n\nChanges applied based on: _" + updateRequest + "_",
    );
  } catch (error) {
    console.error("Update profile error:", error);
    await ctx.reply("Something went wrong updating your profile. Please try again.");
  }
}
