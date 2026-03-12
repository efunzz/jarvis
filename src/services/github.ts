import { config } from "../config";

export interface RepoContext {
  owner: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  readme: string;
  packageJson: Record<string, unknown> | null;
}

export class GitHubError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

const headers = {
  Authorization: `Bearer ${config.githubToken}`,
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "jarvis-bot",
};

async function fetchJSON(url: string): Promise<any> {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (res.status === 404) throw new GitHubError("Repository not found", 404);
    throw new GitHubError(`GitHub API error: ${res.status}`, res.status);
  }
  return res.json();
}

async function fetchText(url: string): Promise<string | null> {
  const res = await fetch(url, {
    headers: { ...headers, Accept: "application/vnd.github.v3.raw" },
  });
  if (!res.ok) return null;
  return res.text();
}

export async function fetchRepoContext(
  owner: string,
  name: string,
): Promise<RepoContext> {
  const repo = await fetchJSON(`https://api.github.com/repos/${owner}/${name}`);

  const [readme, packageJsonRaw] = await Promise.all([
    fetchText(
      `https://api.github.com/repos/${owner}/${name}/contents/README.md`,
    ),
    fetchText(
      `https://api.github.com/repos/${owner}/${name}/contents/package.json`,
    ),
  ]);

  let packageJson: Record<string, unknown> | null = null;
  if (packageJsonRaw) {
    try {
      packageJson = JSON.parse(packageJsonRaw);
    } catch {}
  }

  return {
    owner,
    name,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics || [],
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    readme: (readme || "No README found").slice(0, 3000),
    packageJson,
  };
}
