'use server';

/**
 * @fileOverview Helps students formulate more effective search keywords for finding references on Google Scholar.
 *
 * - smartReferenceFinder - A function that generates search keywords.
 * - SmartReferenceFinderInput - The input type for the smartReferenceFinder function.
 * - SmartReferenceFinderOutput - The return type for the smartReferenceFinder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartReferenceFinderInputSchema = z.object({
  searchTerm: z.string().describe('The initial search term or concept.'),
});
export type SmartReferenceFinderInput = z.infer<typeof SmartReferenceFinderInputSchema>;

const SmartReferenceFinderOutputSchema = z.object({
  keywords: z.string().describe('A comma-separated list of alternative or related search terms.'),
});
export type SmartReferenceFinderOutput = z.infer<typeof SmartReferenceFinderOutputSchema>;

export async function smartReferenceFinder(searchTerm: string): Promise<SmartReferenceFinderOutput> {
  return smartReferenceFinderFlow({ searchTerm });
}

const smartReferenceFinderPrompt = ai.definePrompt({
  name: 'smartReferenceFinderPrompt',
  input: {schema: SmartReferenceFinderInputSchema},
  output: {schema: SmartReferenceFinderOutputSchema},
  prompt: `Kamu adalah seorang ahli riset akademik dan istilah-istilahnya. Aku akan kasih kamu satu kata kunci awal, dan kamu kasih daftar kata kunci alternatif atau yang berhubungan yang bisa berguna buat cari referensi penelitian di Google Scholar. Tolong kembalikan dalam bentuk daftar yang dipisahkan koma.

Istilah awal: {{{searchTerm}}}

Hasilnya harus dalam bahasa Indonesia yang santai dan jangan pakai format markdown seperti bold atau heading.`,
});

const smartReferenceFinderFlow = ai.defineFlow(
  {
    name: 'smartReferenceFinderFlow',
    inputSchema: SmartReferenceFinderInputSchema,
    outputSchema: SmartReferenceFinderOutputSchema,
  },
  async input => {
    const {output} = await smartReferenceFinderPrompt(input);
    return output!;
  }
);
