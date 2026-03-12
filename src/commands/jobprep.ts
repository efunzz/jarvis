import type { Context } from "grammy";
import { analyze } from "../services/claude";
import { sendLongMessage } from "../bot";
import { jobprepSystemPrompt, buildJobprepPrompt } from "../prompts/jobprep";
import { loadProfile } from "./updateprofile";

export async function handleJobprep(ctx: Context): Promise<void> {
  const text = ctx.message?.text || "";
  const jobDescription = text.replace(/^\/jobprep\s*/i, "").trim();

  if (!jobDescription) {
    await ctx.reply(
      "Send me a job description to analyze against your profile.\n\n" +
        "Usage: `/jobprep <paste the full job description>`\n\n" +
        "Tip: You can also just paste a JD in chat and I'll detect it.",
      { parse_mode: "Markdown" },
    );
    return;
  }

  const statusMsg = await ctx.reply("🔍 Analyzing job description against your profile...");
  await ctx.api.sendChatAction(ctx.chat!.id, "typing");

  try {
    const profile = await loadProfile();
    const prompt = buildJobprepPrompt(profile, jobDescription);
    const response = await analyze(jobprepSystemPrompt, prompt);

    await ctx.api.deleteMessage(ctx.chat!.id, statusMsg.message_id).catch(() => {});
    await sendLongMessage(ctx, response);
  } catch (error) {
    console.error("Jobprep error:", error);
    await ctx.reply("Something went wrong analyzing the JD. Please try again.");
  }
}
