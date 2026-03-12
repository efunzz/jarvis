import type { Context } from "grammy";
import { analyze } from "../services/claude";
import { sendLongMessage } from "../bot";

const routerSystemPrompt = `You are Jarvis, a Telegram AI assistant that helps evaluate and grow indie apps toward profitability.

You have two capabilities:
1. REVIEW - Analyze a GitHub repo as a business (needs an owner/repo like "excalidraw/excalidraw" or a GitHub URL)
2. TREND - Analyze a niche/market for indie app opportunities (needs a topic like "ai writing tools")

When the user's message matches one of these, respond with ONLY a JSON object (no other text):
{"intent": "review", "arg": "owner/repo"}
{"intent": "trend", "arg": "the topic"}

If the user's message is general conversation, a question, or doesn't clearly map to review/trend, just respond naturally as Jarvis — a sharp, friendly indie hacker advisor. Keep responses concise. Use Telegram-compatible markdown (*bold*, not # headers).

If the user seems to want a review or trend analysis but is missing info (e.g. "review my app" without a repo), ask them for the missing piece.`;

export async function handleChat(ctx: Context): Promise<void> {
  const text = ctx.message?.text;
  if (!text) return;

  try {
    const response = await analyze(routerSystemPrompt, text);

    // Check if Claude returned a routing JSON
    const trimmed = response.trim();
    if (trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.intent === "review" && parsed.arg) {
          // Rewrite the message text and delegate to /review handler
          ctx.message!.text = `/review ${parsed.arg}`;
          const { handleReview } = await import("./review");
          return handleReview(ctx);
        }
        if (parsed.intent === "trend" && parsed.arg) {
          ctx.message!.text = `/trend ${parsed.arg}`;
          const { handleTrend } = await import("./trend");
          return handleTrend(ctx);
        }
      } catch {
        // Not valid JSON, treat as normal response
      }
    }

    // Regular conversational response
    await sendLongMessage(ctx, response);
  } catch (error) {
    console.error("Chat error:", error);
    await ctx.reply("Something went wrong. Try again or use /review or /trend directly.");
  }
}
