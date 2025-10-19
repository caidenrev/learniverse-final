'use server';

/**
 * @fileOverview An AI agent that reviews a CV and provides feedback.
 *
 * - reviewCv - A function that handles the CV review process.
 * - CvReviewerInput - The input type for the reviewCv function.
 * - CvReviewerOutput - The return type for the reviewCv function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CvReviewerInputSchema = z.object({
  cvDataUri: z
    .string()
    .describe(
      "The user's CV document as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CvReviewerInput = z.infer<typeof CvReviewerInputSchema>;

const CvReviewerOutputSchema = z.object({
  review: z
    .string()
    .describe('The overall feedback on the CV in a relaxed, friendly tone.'),
  score: z
    .number()
    .describe('A score from 0 to 100 representing the quality of the CV.'),
  suggestions: z
    .array(z.string())
    .describe('A list of specific, actionable suggestions for improvement.'),
});
export type CvReviewerOutput = z.infer<typeof CvReviewerOutputSchema>;

export async function reviewCv(input: CvReviewerInput): Promise<CvReviewerOutput> {
  return cvReviewerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cvReviewerPrompt',
  input: { schema: CvReviewerInputSchema },
  output: { schema: CvReviewerOutputSchema },
  prompt: `Kamu adalah seorang HRD yang berpengalaman, ramah, dan jago kasih masukan. Tugasmu adalah me-review CV yang diunggah.

  Tolong analisis CV ini:
  {{media url=cvDataUri}}

  Berikan ulasan dengan gaya bahasa yang santai dan memotivasi. Fokus pada kelebihan dan area yang bisa ditingkatkan.
  Setelah itu, berikan skor dari 0 sampai 100 untuk CV ini.
  Terakhir, berikan beberapa saran konkret yang bisa langsung diterapkan untuk membuat CV ini lebih baik.
  
  Pastikan hasilnya dalam Bahasa Indonesia dan jangan gunakan format markdown.
  `,
});

const cvReviewerFlow = ai.defineFlow(
  {
    name: 'cvReviewerFlow',
    inputSchema: CvReviewerInputSchema,
    outputSchema: CvReviewerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
