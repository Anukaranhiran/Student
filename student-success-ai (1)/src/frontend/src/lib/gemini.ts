// ============================================================
// GEMINI API CONFIGURATION
// TODO: Replace the empty string below with your Gemini API key
// Get your key at: https://aistudio.google.com/app/apikey
// ============================================================
const GEMINI_API_KEY = "AIzaSyBzFX8JzZgTRJkgjw9mCIGmiutnIfXDNjg"; // <-- PASTE YOUR GEMINI API KEY HERE

const GEMINI_MODEL = "gemini-2.0-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key is not set. Open src/frontend/src/lib/gemini.ts and add your key.",
    );
  }
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function generateRoadmap(
  goal: string,
  field: string,
): Promise<string> {
  return callGemini(
    `You are a career coach. Generate a detailed, structured learning roadmap for someone who wants to become a "${goal}" in the "${field}" field. Include phases, key skills, tools, resources, and estimated timeline. Format with clear sections and bullet points.`,
  );
}

export async function generateStudyPlan(goal: string): Promise<string> {
  return callGemini(
    `Create a practical 12-week study plan for someone aiming to become a "${goal}". Break it into weekly goals with specific tasks, resources, and milestones. Be concrete and actionable.`,
  );
}

export async function generateCareerAdvice(goal: string): Promise<string> {
  return callGemini(
    `Give comprehensive career advice for someone pursuing a career as "${goal}". Include: job market insights, essential skills employers look for, portfolio/project ideas, networking tips, interview preparation, and salary expectations. Be practical and encouraging.`,
  );
}
