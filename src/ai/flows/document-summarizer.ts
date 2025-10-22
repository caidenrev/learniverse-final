'use server';

/**
 * @fileOverview An AI agent to summarize documents (PDF/Word).
 *
 * - summarizeDocument - A function that handles the document summarization process.
 * - DocumentSummarizerInput - The input type for the summarizeDocument function.
 * - DocumentSummarizerOutput - The return type for the summarizeDocument function.
 */

import { ai } from '@/ai/genkit';
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

export async function summarizeDocument(
  input: DocumentSummarizerInput
): Promise<DocumentSummarizerOutput> {
  return documentSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentSummarizerPrompt',
  input: { schema: DocumentSummarizerInputSchema },
  output: { schema: DocumentSummarizerOutputSchema },
  prompt: `Kamu adalah seorang ahli peringkas dokumen yang handal dan jago menjelaskan inti sari dengan bahasa yang santai. Tugasmu adalah menganalisis dokumen yang diberikan, lalu membuat ringkasan dan kesimpulan dari isinya.

  Analisis dokumen ini:
  Dokumen: {{media url=documentDataUri}}

  Tolong berikan hasilnya dalam dua bagian:
  1.  **Ringkasan:** Jelaskan poin-poin utama dari dokumen secara singkat dan padat.
  2.  **Kesimpulan:** Tarik satu kesimpulan utama dari keseluruhan isi dokumen.

  Pastikan gaya bahasanya santai, mudah dipahami, dan jangan gunakan format markdown.
  `,
});

const documentSummarizerFlow = ai.defineFlow(
  {
    name: 'documentSummarizerFlow',
    inputSchema: DocumentSummarizerInputSchema,
    outputSchema: DocumentSummarizerOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
