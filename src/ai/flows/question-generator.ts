'use server';

/**
 * @fileOverview An AI agent to generate questions from a document.
 *
 * - generateQuestions - A function that handles the question generation process.
 * - QuestionGeneratorInput - The input type for the generateQuestions function.
 * - QuestionGeneratorOutput - The return type for the generateQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const QuestionGeneratorInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document (e.g., PDF, PPTX) as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type QuestionGeneratorInput = z.infer<typeof QuestionGeneratorInputSchema>;

export const QuestionGeneratorOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe('A list of generated questions from the document.'),
});
export type QuestionGeneratorOutput = z.infer<typeof QuestionGeneratorOutputSchema>;

export async function generateQuestions(
  input: QuestionGeneratorInput
): Promise<QuestionGeneratorOutput> {
  return questionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'questionGeneratorPrompt',
  input: {schema: QuestionGeneratorInputSchema},
  output: {schema: QuestionGeneratorOutputSchema},
  prompt: `Kamu adalah seorang dosen atau guru yang ahli dalam membuat soal ujian. Tugasmu adalah menganalisis dokumen yang diberikan (bisa berupa materi kuliah, slide presentasi, atau artikel) dan membuat daftar pertanyaan yang relevan dan mendalam dari konten tersebut.

  Analisis dokumen ini dan buat beberapa pertanyaan berdasarkan isinya:
  Dokumen: {{media url=documentDataUri}}

  Pastikan pertanyaan yang kamu buat bervariasi, mencakup pemahaman konsep, analisis, dan mungkin studi kasus jika relevan.
  
  Hasilnya harus dalam format JSON array of strings dan dalam Bahasa Indonesia.
  `,
});

const questionGeneratorFlow = ai.defineFlow(
  {
    name: 'questionGeneratorFlow',
    inputSchema: QuestionGeneratorInputSchema,
    outputSchema: QuestionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
