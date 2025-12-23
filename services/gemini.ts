import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
// We use process.env.API_KEY as strictly instructed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_MODEL = 'gemini-2.5-flash-image';

export const analyzePantryImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              count: { type: Type.INTEGER },
              category: { type: Type.STRING },
            },
            required: ['name', 'count', 'category']
          }
        },
        summary: {
          type: Type.STRING,
          description: "A brief, 1-sentence summary of the pantry status."
        }
      },
      required: ['items', 'summary']
    };

    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analyze this pantry shelf image. Identify food items, count them, and categorize them. Return a structured JSON response."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response text from Gemini");
    }
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
