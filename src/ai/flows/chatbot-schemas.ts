import { z } from 'zod';

export const ChatbotInputSchema = z.object({
  message: z.string().describe("The user's message to the chatbot."),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .optional()
    .describe('The previous conversation history.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

export const ChatbotOutputSchema = z.object({
  response: z.string().describe("The chatbot's response to the user's message."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;
