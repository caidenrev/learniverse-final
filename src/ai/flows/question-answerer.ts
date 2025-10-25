
'use server';

/**
 * @fileOverview An AI agent that finds and answers all questions within a document.
 *
 * - answerAllQuestions - A function that handles the question answering process.
 * - QuestionAnswererInput - The input type for the answerAllQuestions function.
 * - QuestionAnswererOutput - The return type for the answerAllQuestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const QuestionAnswererInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document (e.g., PDF, JPG) containing questions as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type QuestionAnswererInput = z.infer<typeof QuestionAnswererInputSchema>;

const QuestionAnswerPairSchema = z.object({
    question: z.string().describe("The identified question from the document."),
    answer: z.string().describe("The AI-generated answer for that question."),
});

const QuestionAnswererOutputSchema = z.object({
  qaPairs: z
    .array(QuestionAnswerPairSchema)
    .describe('A list of question and answer pairs found in the document.'),
});
export type QuestionAnswererOutput = z.infer<
  typeof QuestionAnswererOutputSchema
>;

export async function answerAllQuestions(
  input: QuestionAnswererInput
): Promise<QuestionAnswererOutput> {
  return questionAnswererFlow(input);
}

const prompt = ai.definePrompt({
  name: 'questionAnswererPrompt',
  input: { schema: QuestionAnswererInputSchema },
  output: { schema: QuestionAnswererOutputSchema },
  prompt: `Kamu adalah seorang tutor AI yang cerdas dan jagoan dalam menjawab soal. Tugasmu adalah menganalisis dokumen yang diberikan, temukan semua pertanyaan di dalamnya, lalu jawab setiap pertanyaan itu satu per satu.

  Gunakan gaya bahasa yang santai dan mudah dimengerti, seolah-olah kamu sedang membantu teman. Pastikan jawabannya ringkas dan to the point.

  Analisis dokumen ini:
  Dokumen: {{media url=documentDataUri}}

  Temukan semua pertanyaan dan berikan jawabannya. Jika tidak ada pertanyaan yang ditemukan, kembalikan array kosong.
  
  Pastikan hasilnya dalam format JSON yang sesuai dengan skema output dan dalam bahasa Indonesia.
  `,
});

const questionAnswererFlow = ai.defineFlow(
  {
    name: 'questionAnswererFlow',
    inputSchema: QuestionAnswererInputSchema,
    outputSchema: QuestionAnswererOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
