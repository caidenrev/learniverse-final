'use server';

/**
 * @fileOverview An AI agent to summarize documents (PDF/Word).
 *
 * - summarizeDocument - A function that handles the document summarization process.
 */

import { ai } from '@/ai/genkit';
import {
  DocumentSummarizerInputSchema,
  DocumentSummarizerOutputSchema,
  type DocumentSummarizerInput,
  type DocumentSummarizerOutput,
} from '@/ai/flows/document-summarizer-schemas';

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
