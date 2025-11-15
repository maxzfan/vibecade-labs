import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // This is a client-side check. The actual key is handled by the environment.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateCode(prompt: string): Promise<string> {
  const fullPrompt = `
You are an expert game developer specializing in creating self-contained, interactive retro arcade games using web technologies.
Your task is to generate a single, complete HTML file based on a user's game description.
This file must include all necessary HTML, CSS, and JavaScript within it.
The CSS should be in a <style> tag and the JavaScript in a <script> tag.
Do not use any external libraries or assets unless it is something simple from a CDN like Google Fonts.
The code should be clean, well-formatted, and directly usable.
The game should have a retro arcade feel. Try to use pixel fonts and a classic color palette unless the user specifies otherwise. Ensure the game is responsive and works well on different screen sizes.
Do not include any markdown formatting (like \`\`\`html) or explanations outside of the HTML code itself.
The final output should be ONLY the raw HTML code for the file.

User's description: "${prompt}"
`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: fullPrompt,
    });
    
    // Sometimes the model might still wrap the code in markdown, so we clean it.
    const rawText = response.text.trim();
    if (rawText.startsWith('```html')) {
        return rawText.replace(/^```html\n|```$/g, '').trim();
    }
    return rawText;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}