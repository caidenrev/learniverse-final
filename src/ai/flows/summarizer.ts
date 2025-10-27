
'use server';

/**
 * @fileOverview Summarizes English text into Bahasa Indonesia.
 *
 * - summarize - A function that summarizes English text to Bahasa Indonesia.
 * - SummarizeInput - The input type for the summarize function.
 * - SummarizeOutput - The return type for the summarize function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInputSchema = z.object({
  text: z.string().describe('The English text to summarize.'),
  planId: z.enum(['free', 'premium']).default('free').describe('The user\'s subscription plan.'),
});
export type SummarizeInput = z.infer<typeof SummarizeInputSchema>;

const SummarizeOutputSchema = z.object({
  summary: z.string().describe('The summary in Bahasa Indonesia.'),
});
export type SummarizeOutput = z.infer<typeof SummarizeOutputSchema>;

export async function summarize(input: SummarizeInput): Promise<SummarizeOutput> {
  return summarizeFlow(input);
}

const summarizeFlow = ai.defineFlow(
  {
    name: 'summarizeFlow',
    inputSchema: SummarizeInputSchema,
    outputSchema: SummarizeOutputSchema,
  },
  async input => {
    // Definisikan prompt secara dinamis di dalam flow
    const prompt = `Ringkasin teks bahasa Inggris ini jadi poin-poin yang gampang dimengerti dalam Bahasa Indonesia dong:\n\n${input.text}

    Hasilnya harus dalam bahasa Indonesia yang santai dan jangan pakai format markdown seperti bold atau heading.`;

    // The default model from `src/ai/genkit.ts` will be used.
    // We can add logic here in the future to select a different model based on the plan.
    const {output} = await ai.generate({
      prompt: prompt,
      output: {
        schema: SummarizeOutputSchema,
      }
    });

    return output!;
  }
);
