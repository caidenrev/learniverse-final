
'use server';

/**
 * @fileOverview An AI agent to generate questions from a document.
 *
 * - generateQuestions - A function that handles the question generation process.
 */

import {ai} from '@/ai/genkit';
import {
  QuestionGeneratorInputSchema,
  QuestionGeneratorOutputSchema,
  type QuestionGeneratorInput,
  type QuestionGeneratorOutput,
} from '@/ai/flows/question-generator-schemas';

export async function generateQuestions(
  input: QuestionGeneratorInput
): Promise<QuestionGeneratorOutput> {
  return questionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'questionGeneratorPrompt',
  input: {schema: QuestionGeneratorInputSchema},
  output: {schema: QuestionGeneratorOutputSchema},
  prompt: `Kamu adalah teman belajar yang asik dan jago membuat pertanyaan untuk diskusi. Tugasmu adalah menganalisis dokumen yang diberikan dan membuat daftar pertanyaan santai yang memancing diskusi dari konten tersebut.

  Analisis dokumen ini dan buat beberapa pertanyaan berdasarkan isinya:
  Dokumen: {{media url=documentDataUri}}

  Pastikan pertanyaan yang kamu buat menggunakan gaya bahasa yang santai dan mudah dipahami, seolah-olah bertanya kepada teman.
  
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
