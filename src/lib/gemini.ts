import { GoogleGenAI } from "@google/genai";

const jamJamAI = new GoogleGenAI({
  vertexai: true,
  project: 'project-ffb0aa4c-40fd-4089-b56',
  location: 'us-central1',
})

export async function getJamJamResponse(data: Array<String>, prompt: String) {
  try {
    const response = await jamJamAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a data analyst specializing in user feedback. Be concise — respond in 2000 characters or fewer. The following is an array of raw user feedback strings from our product: ${data}. Respond only with your analysis of the following prompt. Do not restate the data or the question. Here is the prompt you must analyze: ${prompt}`
    })

    return response.text;
  } catch (error) {
    console.error(error);
  }
}