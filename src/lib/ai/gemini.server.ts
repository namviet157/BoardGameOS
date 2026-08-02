import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = "gemini-3.6-flash";

const MODEL_MIGRATIONS: Record<string, string> = {
  "gemini-2.5-flash": "gemini-3.6-flash",
};

function getGeminiModel() {
  const configuredModel = process.env.GEMINI_MODEL?.trim();

  if (!configuredModel) {
    return DEFAULT_MODEL;
  }

  return MODEL_MIGRATIONS[configuredModel] ?? configuredModel;
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Chưa cấu hình GEMINI_API_KEY");
  }

  return new GoogleGenAI({ apiKey });
}

export async function generateStructuredJson<T>({
  systemInstruction,
  prompt,
  responseJsonSchema,
}: {
  systemInstruction: string;
  prompt: string;
  responseJsonSchema: unknown;
}): Promise<T> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: getGeminiModel(),
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseJsonSchema,
    },
  });

  if (!response.text) {
    throw new Error("Gemini không trả về nội dung");
  }

  try {
    return JSON.parse(response.text) as T;
  } catch {
    throw new Error("Không thể đọc kết quả từ Gemini");
  }
}
