'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a presentation outline based on a given title.
 *
 * It exports:
 * - `generatePresentationOutline`: An async function that takes a presentation title as input and returns a presentation outline.
 * - `PresentationOutlineInput`: The input type for the `generatePresentation-outliner` function.
 * - `PresentationOutlineOutput`: The output type for the `generatePresentationOutline` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PresentationOutlineInputSchema = z.object({
  title: z.string().describe('The title of the presentation.'),
});
export type PresentationOutlineInput = z.infer<typeof PresentationOutlineInputSchema>;

const SlideSchema = z.object({
  slideTitle: z.string().describe('The title of the individual slide.'),
  contentPoints: z
    .array(z.string())
    .describe('A list of key points or content to be covered on the slide.'),
  speakerNotes: z
    .string()
    .describe(
      'Additional notes or script for the speaker for this slide, in a casual tone.'
    ),
});

const PresentationOutlineOutputSchema = z.object({
  slides: z
    .array(SlideSchema)
    .describe('A slide-by-slide array of the presentation outline.'),
});

export type PresentationOutlineOutput = z.infer<
  typeof PresentationOutlineOutputSchema
>;


export async function generatePresentationOutline(input: PresentationOutlineInput): Promise<PresentationOutlineOutput> {
  return presentationOutlinerFlow(input);
}

const presentationOutlinerPrompt = ai.definePrompt({
  name: 'presentationOutlinerPrompt',
  input: {schema: PresentationOutlineInputSchema},
  output: {schema: PresentationOutlineOutputSchema},
  prompt: `Kamu adalah asisten AI yang jago bikin kerangka presentasi yang terstruktur dan menarik.
Berdasarkan judul presentasi yang dikasih, buat kerangka slide per slide yang detail.
Setiap slide harus punya judul slide, beberapa poin konten utama, dan catatan untuk pembicara dengan gaya yang santai.
Strukturnya harus mencakup pendahuluan, beberapa slide isi, dan kesimpulan yang kuat.

Judul Presentasi: {{{title}}}
  
Hasilnya harus dalam format JSON yang sesuai dengan skema output dan dalam bahasa Indonesia.
  `, 
});

const presentationOutlinerFlow = ai.defineFlow(
  {
    name: 'presentationOutlinerFlow',
    inputSchema: PresentationOutlineInputSchema,
    outputSchema: PresentationOutlineOutputSchema,
  },
  async input => {
    const {output} = await presentationOutlinerPrompt(input);
    return output!;
  }
);
