# 🤖 Jarvis – AI-Powered Telegram Assistant

Jarvis is an AI-powered Telegram bot built with **TypeScript** and **Bun** that integrates Claude AI for research and decision-making. Evaluate GitHub repos as businesses, explore market opportunities, and prep for job applications — all from a single chat.

The project demonstrates building a bot with **AI integration, multi-API orchestration, smart intent routing, and persistent user context**.

## 📦 Technologies

- TypeScript
- Bun
- grammY (Telegram Bot Framework)
- Claude API (Anthropic)
- GitHub API
- Brave Search API

## ✨ Features

### Smart Intent Routing

- Natural language message classification powered by Claude AI
- Automatic delegation to specialized command handlers
- No need to memorize commands — just type naturally

### GitHub Repo Analysis

- Fetches repo metadata, README, and dependencies via GitHub API
- Enriches with real-time market data via Brave Search
- Delivers business analysis: competitors, pricing, market opportunity, actionable improvements

### Market Trend Research

- Multi-query parallel search across market trends, tools, and opportunities
- AI-synthesized analysis with real competitor names, pricing, and URLs
- Identifies differentiation gaps and monetization strategies

### Job Preparation Workflow

- Analyzes job descriptions against a stored career profile
- Gap analysis, resume restructuring suggestions, and quick-win project ideas
- Profile updates via natural language (`/updateprofile add Docker to my skills`)

### Commands

| Command | Description |
|---------|-------------|
| `/review owner/repo` | Business analysis of a GitHub repo |
| `/trend topic` | Niche market analysis with trends and opportunities |
| `/jobprep <JD>` | Analyze a job description against your profile |
| `/updateprofile <update>` | Update your career profile via natural language |
| `/ping` | Health check |


## 👩🏽‍🍳 Development Process

- Designed the bot architecture with modular command handlers and dedicated system prompts
- Built an LLM-based intent router that classifies natural language and delegates to the right handler
- Integrated Claude API as the core intelligence layer with tailored system prompts per feature
- Connected GitHub API and Brave Search API for real-time data enrichment
- Implemented persistent user profile storage with AI-powered merge updates
- Added Telegram-compatible message formatting with automatic chunking for long responses
- Tested workflows end-to-end across all command types and natural language routing


## 📚 What I Learned

### 🧠 AI Integration & Prompt Engineering

- Designed specialized system prompts for different analysis domains (business, market, career)
- Built an LLM-powered router that classifies user intent from natural language
- Managed prompt context windows by combining multiple data sources into structured prompts

### 🔗 Multi-API Orchestration

- Coordinated parallel API calls across Claude, GitHub, and Brave Search
- Handled API errors, rate limits, and response parsing across different providers
- Built service abstractions to keep command handlers clean and focused

### 🤖 Bot Architecture

- Designed a two-tier routing system: explicit commands + AI-based intent classification
- Built modular command handlers with dedicated prompts and data pipelines
- Implemented message chunking and markdown fallback for Telegram's formatting constraints

### 📈 Overall Growth

- Gained experience building AI-powered applications with real-world API integrations
- Improved skills in TypeScript, async patterns, and service-oriented architecture
- Learned to design user-friendly conversational interfaces


## 💭 Possible Improvements

- Conversation memory for multi-turn discussions
- Docker containerization with Prometheus metrics and Grafana dashboards
- CI/CD pipeline with GitHub Actions for automated builds
- Support for multiple user profiles
- Integration with more collaboration platforms (Slack, Discord)


## 🚦 Running the Project

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Copy `.env.example` to `.env` and fill in your keys:
   ```
   TELEGRAM_BOT_TOKEN=
   ANTHROPIC_API_KEY=
   BRAVE_API_KEY=
   GITHUB_TOKEN=
   ```
4. Start the bot:
   ```bash
   bun start
   ```
