
import { z } from 'genkit';

export const AiTutorInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The course material (e.g., PDF, lecture notes) as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe("The student's question about the material."),
});
export type AiTutorInput = z.infer<typeof AiTutorInputSchema>;

export const AiTutorOutputSchema = z.object({
  answer: z
    .string()
    .describe('The AI-generated answer based on the provided document.'),
});
export type AiTutorOutput = z.infer<typeof AiTutorOutputSchema>;
