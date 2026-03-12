import type { RepoContext } from "../services/github";
import type { SearchResult } from "../services/brave";

export const reviewSystemPrompt = `You are a sharp product strategist and indie hacker advisor. You analyze GitHub repos as potential indie businesses.

Your analysis is opinionated, specific, and actionable. You reference real competitors, real pricing, and real market data from the search results provided.

Format your response for Telegram using this markdown:
- Use *bold* for section headers (not # headers)
- Use bullet points with -
- Keep it concise but insightful
- Use real names, URLs, and prices from search results when available`;

export function buildReviewPrompt(
  repo: RepoContext,
  searchResults: SearchResult[],
): string {
  const deps = repo.packageJson
    ? Object.keys(
        (repo.packageJson.dependencies as Record<string, string>) || {},
      ).join(", ")
    : "N/A";

  const searchText = searchResults
    .map((r) => `- ${r.title}: ${r.description} (${r.url})`)
    .join("\n");

  return `Analyze this GitHub repo as a potential indie business:

*Repository*
- Name: ${repo.owner}/${repo.name}
- Description: ${repo.description || "None"}
- Language: ${repo.language || "Unknown"}
- Stars: ${repo.stars} | Forks: ${repo.forks}
- Topics: ${repo.topics.join(", ") || "None"}
- Created: ${repo.createdAt} | Updated: ${repo.updatedAt}
- Key Dependencies: ${deps}

*README (truncated)*
${repo.readme}

*Market Research*
${searchText || "No search results available"}

Provide your analysis in these sections:
*App Summary* - What it does in 2-3 sentences
*Market Opportunity* - Size and growth of this niche
*Competitors* - Top 3-5 with pricing
*Pricing Benchmarks* - What users pay for similar tools
*Profitability Feasibility* - Can this make money as an indie app? How?
*Weaknesses* - What's holding it back
*Improvements* - Top 3 actionable improvements
*3 Experiments* - Quick tests to validate demand or monetization`;
}
