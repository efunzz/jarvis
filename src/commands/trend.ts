import type { Context } from "grammy";
import { multiSearch, BraveSearchError } from "../services/brave";
import { analyze } from "../services/claude";
import { trendSystemPrompt, buildTrendPrompt } from "../prompts/trend";
import { sendLongMessage } from "../bot";

export async function handleTrend(ctx: Context): Promise<void> {
  const text = ctx.message?.text || "";
  const topic = text.replace(/^\/trend\s*/, "").trim();

  if (!topic) {
    await ctx.reply(
      "Usage: /trend topic\nExample: /trend ai writing tools",
    );
    return;
  }

  await ctx.reply(`Researching "${topic}"...`);

  try {
    await ctx.api.sendChatAction(ctx.chat!.id, "typing");

    const searchResults = await multiSearch([
      `${topic} market trends 2025 2026`,
      `${topic} popular tools pricing`,
      `${topic} indie app opportunities`,
    ]);

    await ctx.api.sendChatAction(ctx.chat!.id, "typing");

    const prompt = buildTrendPrompt(topic, searchResults);
    const response = await analyze(trendSystemPrompt, prompt);

    await sendLongMessage(ctx, response);
  } catch (error) {
    if (error instanceof BraveSearchError) {
      console.error("Brave Search error:", error);
      await ctx.reply("Search failed. Please try again later.");
    } else {
      console.error("Trend error:", error);
      await ctx.reply("Something went wrong. Please try again.");
    }
  }
}
