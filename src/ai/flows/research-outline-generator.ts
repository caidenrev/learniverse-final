'use server';

/**
 * @fileOverview Generates a draft research proposal or thesis structure based on a given topic.
 *
 * - generateResearchOutline - A function that generates the research outline.
 * - ResearchOutlineInput - The input type for the generateResearchOutline function.
 * - ResearchOutlineOutput - The return type for the generateResearchOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResearchOutlineInputSchema = z.object({
  topic: z
    .string()
    .describe('The main topic for which to generate a research outline.'),
});
export type ResearchOutlineInput = z.infer<typeof ResearchOutlineInputSchema>;

const SectionSchema = z.object({
  sectionTitle: z.string().describe('The title of the research section (e.g., "BAB I: Latar Belakang").'),
  contentPoints: z
    .array(z.string())
    .describe('A list of key points or sub-sections to be covered in this section.'),
});

const ResearchOutlineOutputSchema = z.object({
  outline: z
    .array(SectionSchema)
    .describe(
      'A structured research outline, with each element representing a major chapter or section.'
    ),
});
export type ResearchOutlineOutput = z.infer<typeof ResearchOutlineOutputSchema>;

export async function generateResearchOutline(
  input: ResearchOutlineInput
): Promise<ResearchOutlineOutput> {
  return researchOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'researchOutlinePrompt',
  input: {schema: ResearchOutlineInputSchema},
  output: {schema: ResearchOutlineOutputSchema},
  prompt: `Kamu adalah seorang peneliti akademik yang berpengalaman. Tugasmu adalah membuat kerangka penelitian untuk sebuah topik, yang biasa dipakai di kampus-kampus Indonesia.

  Topiknya adalah: {{{topic}}}

  Kerangkanya harus mencakup bagian-bagian umum seperti:
  - BAB I: Pendahuluan (Latar Belakang, Rumusan Masalah, Tujuan, Manfaat)
  - BAB II: Tinjauan Pustaka
  - BAB III: Metodologi Penelitian
  - BAB IV: Hasil dan Pembahasan (opsional, jika perlu)
  - BAB V: Kesimpulan dan Saran

  Buatkan kerangka yang detail dengan sub-poin untuk setiap bagian.
  
  Hasilnya harus dalam format JSON yang sesuai dengan skema output dan dalam bahasa Indonesia.
`,
});

const researchOutlineFlow = ai.defineFlow(
  {
    name: 'researchOutlineFlow',
    inputSchema: ResearchOutlineInputSchema,
    outputSchema: ResearchOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
