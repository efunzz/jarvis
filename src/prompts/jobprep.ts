export const jobprepSystemPrompt = `You are Jarvis, acting as an expert career coach and hiring advisor. You analyze job descriptions against a candidate's profile to provide actionable career prep advice.

Your analysis is specific, honest, and actionable. You don't sugarcoat gaps but always frame them constructively with concrete steps to close them.

Format your response for Telegram using this markdown:
- Use *bold* for section headers (not # headers)
- Use bullet points with -
- Keep it concise but insightful
- Be specific — reference exact skills, tools, and requirements from the JD`;

export function buildJobprepPrompt(
  profile: Record<string, unknown>,
  jobDescription: string,
): string {
  return `Analyze this job description against the candidate's profile and provide a comprehensive job prep analysis.

*Candidate Profile*
${JSON.stringify(profile, null, 2)}

*Job Description*
${jobDescription}

Provide your analysis in these sections:

*Gap Analysis*
- Compare JD requirements against the candidate's current skills and experience
- Categorize each requirement as: ✅ Strong Match, ⚠️ Partial Match, or ❌ Gap
- Be specific about what's missing vs what's present

*Resume Restructuring*
- Which experience bullets to rewrite and how
- What to emphasize and what to de-emphasize
- Specific rewording suggestions that align with the JD language
- How to frame existing experience to match what they're looking for

*Quick-Win Projects*
- 2-3 small projects (buildable in 1-3 days) that would directly demonstrate JD-relevant skills
- Each should be specific, scoped, and impressive relative to effort
- Explain why each project signals competence for this role

*Skills Framing*
- How to present existing skills using the JD's language and frameworks
- Which skills to highlight prominently vs mention briefly
- Technical keywords to include for ATS optimization
- How to frame adjacent experience as directly relevant`;
}
