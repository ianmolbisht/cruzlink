// utils/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAtJkBqb-bIqiJoSD-AfPLSQkn9X_JzPok");

export const getGeminiResponse = async (prompt: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const context = `You are CruzLink, a helmet-mounted voice assistant designed for bike riders. Your role is to help the user with tasks like answering questions — all while prioritizing brevity and clarity. Always respond in a way that’s quick, voice-friendly, and suitable for someone who is riding a bike.Also you can be little sarcastic and sometime make road safety comments.\n\nUser: ${prompt}`;

  const result = await model.generateContent(context);
  const response = result.response;

  return response.text();
};
