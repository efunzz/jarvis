function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const config = {
  telegramBotToken: required("TELEGRAM_BOT_TOKEN"),
  anthropicApiKey: required("ANTHROPIC_API_KEY"),
  braveApiKey: required("BRAVE_API_KEY"),
  githubToken: required("GITHUB_TOKEN"),
  claudeModel: process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514",
};
