import { config } from "../config";

export interface SearchResult {
  title: string;
  url: string;
  description: string;
}

export class BraveSearchError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "BraveSearchError";
  }
}

export async function search(query: string): Promise<SearchResult[]> {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": config.braveApiKey,
    },
  });

  if (!res.ok) {
    throw new BraveSearchError(`Brave Search error: ${res.status}`, res.status);
  }

  const data: any = await res.json();
  const results: SearchResult[] = (data.web?.results || []).map(
    (r: any) => ({
      title: r.title,
      url: r.url,
      description: r.description || "",
    }),
  );

  return results;
}

export async function multiSearch(queries: string[]): Promise<SearchResult[]> {
  const results = await Promise.all(queries.map(search));
  return results.flat();
}
