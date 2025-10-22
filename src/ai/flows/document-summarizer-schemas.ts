import { z } from 'genkit';

export const DocumentSummarizerInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document (e.g., PDF, DOCX) as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DocumentSummarizerInput = z.infer<
  typeof DocumentSummarizerInputSchema
>;

export const DocumentSummarizerOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the document content.'),
  conclusion: z
    .string()
    .describe('The main conclusion drawn from the document.'),
});
export type DocumentSummarizerOutput = z.infer<
  typeof DocumentSummarizerOutputSchema
>;
