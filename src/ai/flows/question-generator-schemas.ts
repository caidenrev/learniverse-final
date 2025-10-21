import { z } from 'genkit';

export const QuestionGeneratorInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document (e.g., PDF, PPTX) as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type QuestionGeneratorInput = z.infer<
  typeof QuestionGeneratorInputSchema
>;

export const QuestionGeneratorOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe('A list of generated questions from the document.'),
});
export type QuestionGeneratorOutput = z.infer<
  typeof QuestionGeneratorOutputSchema
>;
