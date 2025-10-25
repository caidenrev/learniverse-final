
'use server';

/**
 * @fileOverview An AI-powered tutor that answers questions based on uploaded course material.
 *
 * - answerQuestion - A function that handles the question-answering process.
 */

import { ai } from '@/ai/genkit';
import { AiTutorInputSchema, AiTutorOutputSchema, type AiTutorInput, type AiTutorOutput } from '@/ai/flows/ai-tutor-schemas';


export async function answerQuestion(
  input: AiTutorInput
): Promise<AiTutorOutput> {
  return aiTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTutorPrompt',
  input: { schema: AiTutorInputSchema },
  output: { schema: AiTutorOutputSchema },
  prompt: `Kamu adalah asisten pengajar yang super membantu dan ramah. Tugasmu adalah menjawab pertanyaan mahasiswa berdasarkan materi kuliah yang diberikan. Kalau jawabannya nggak ada di dokumen, bilang aja terus terang.

  Coba analisis dokumen ini dan jawab pertanyaan di bawah ya.

  Dokumen:
  {{media url=documentDataUri}}

  Pertanyaan:
  {{{question}}}

  Hasilnya harus dalam bahasa Indonesia yang santai dan jangan pakai format markdown seperti bold atau heading.

  Jawaban:`,
});

const aiTutorFlow = ai.defineFlow(
  {
    name: 'aiTutorFlow',
    inputSchema: AiTutorInputSchema,
    outputSchema: AiTutorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
