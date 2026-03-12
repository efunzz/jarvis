import type { Context } from "grammy";
import { fetchRepoContext, GitHubError } from "../services/github";
import { multiSearch, BraveSearchError } from "../services/brave";
import { analyze } from "../services/claude";
import { reviewSystemPrompt, buildReviewPrompt } from "../prompts/review";
import { sendLongMessage } from "../bot";

function parseRepo(input: string): { owner: string; name: string } | null {
  const cleaned = input.trim().replace(/\.git$/, "");

  // Handle full GitHub URLs
  const urlMatch = cleaned.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s]+)/,
  );
  if (urlMatch) return { owner: urlMatch[1]!, name: urlMatch[2]! };

  // Handle owner/repo format
  const shortMatch = cleaned.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (shortMatch) return { owner: shortMatch[1]!, name: shortMatch[2]! };

  return null;
}

export async function handleReview(ctx: Context): Promise<void> {
  const text = ctx.message?.text || "";
  const args = text.replace(/^\/review\s*/, "").trim();

  if (!args) {
    await ctx.reply(
      "Usage: /review owner/repo\nExample: /review excalidraw/excalidraw",
    );
    return;
  }

  const parsed = parseRepo(args);
  if (!parsed) {
    await ctx.reply(
      "Invalid format. Use: /review owner/repo or a GitHub URL",
    );
    return;
  }

  const statusMsg = await ctx.reply(`Analyzing ${parsed.owner}/${parsed.name}...`);

  try {
    await ctx.api.sendChatAction(ctx.chat!.id, "typing");

    const [repoContext, searchResults] = await Promise.all([
      fetchRepoContext(parsed.owner, parsed.name),
      multiSearch([
        `${parsed.name} app competitors pricing`,
        `${parsed.name} ${parsed.owner} alternatives`,
        `"${parsed.name}" market size indie`,
      ]),
    ]);

    await ctx.api.sendChatAction(ctx.chat!.id, "typing");

    const prompt = buildReviewPrompt(repoContext, searchResults);
    const response = await analyze(reviewSystemPrompt, prompt);

    await sendLongMessage(ctx, response);
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) {
      await ctx.reply(`Repository "${parsed.owner}/${parsed.name}" not found. Make sure it's a public repo.`);
    } else if (error instanceof GitHubError) {
      console.error("GitHub error:", error);
      await ctx.reply("GitHub API error. Please try again later.");
    } else if (error instanceof BraveSearchError) {
      console.error("Brave Search error:", error);
      await ctx.reply("Search failed. Please try again later.");
    } else {
      console.error("Review error:", error);
      await ctx.reply("Something went wrong. Please try again.");
    }
  }
}
