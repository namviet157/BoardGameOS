import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateStructuredJson } from "./gemini.server";
import { buildOperationsChatPrompt, OPERATIONS_CHAT_SYSTEM_PROMPT } from "./prompts";
import type { OperationsChatRequest, OperationsChatResponse } from "./types";

const chatResponseSchema = z.object({
  answer: z.string().min(1),
  suggestedQuestions: z.array(z.string()).max(3),
});

const chatJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["answer", "suggestedQuestions"],
  properties: {
    answer: { type: "string" },
    suggestedQuestions: {
      type: "array",
      maxItems: 3,
      items: { type: "string" },
    },
  },
};

export const askOperationsAssistant = createServerFn({ method: "POST" })
  .validator((input: OperationsChatRequest) => ({
    ...input,
    question: input.question.trim(),
    history: input.history.slice(-6),
  }))
  .handler(async ({ data }): Promise<OperationsChatResponse> => {
    if (!data.question) throw new Error("Câu hỏi không được để trống");

    const raw = await generateStructuredJson<unknown>({
      systemInstruction: OPERATIONS_CHAT_SYSTEM_PROMPT,
      prompt: buildOperationsChatPrompt(data),
      responseJsonSchema: chatJsonSchema,
    });

    return chatResponseSchema.parse(raw);
  });
