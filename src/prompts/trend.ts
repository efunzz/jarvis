import type { SearchResult } from "../services/brave";

export const trendSystemPrompt = `You are a sharp market analyst specializing in indie software and SaaS niches. You identify trends, gaps, and monetization opportunities.

Your analysis is opinionated, specific, and actionable. You reference real tools, real pricing, and real market data from the search results provided.

Format your response for Telegram using this markdown:
- Use *bold* for section headers (not # headers)
- Use bullet points with -
- Keep it concise but insightful
- Use real names, URLs, and prices from search results when available`;

export function buildTrendPrompt(
  topic: string,
  searchResults: SearchResult[],
): string {
  const searchText = searchResults
    .map((r) => `- ${r.title}: ${r.description} (${r.url})`)
    .join("\n");

  return `Analyze the "${topic}" niche for indie app opportunities:

*Market Research*
${searchText || "No search results available"}

Provide your analysis in these sections:
*Current Trends* - What's happening in this space right now
*Popular Features* - What users expect and what's table stakes
*Differentiation Opportunities* - Gaps and underserved segments
*Monetization Ideas* - Specific pricing models with benchmarks from search results
*Marketing Hooks* - Angles to attract early users`;
}
