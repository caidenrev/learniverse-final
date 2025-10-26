'use server';

/**
 * @fileOverview Generates a learning path or roadmap for a given topic.
 *
 * - generateLearningPath - A function that generates the learning path.
 * - LearningPathInput - The input type for the generateLearningPath function.
 * - LearningPathOutput - The return type for the generateLearningPath function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const LearningPathInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic for which to generate a learning path (e.g., "frontend development").'),
});
export type LearningPathInput = z.infer<typeof LearningPathInputSchema>;

const ResourceSchema = z.object({
    title: z.string().describe('Judul sumber belajar.'),
    url: z.string().url().describe('URL sumber belajar yang relevan.'),
});

const StepSchema = z.object({
  stepTitle: z.string().describe('The title of the learning step.'),
  description: z.string().describe('A brief description of what to learn in this step.'),
  subPoints: z.array(z.string()).describe('A list of key concepts or technologies to cover in this step.'),
  resources: z.array(ResourceSchema).describe('Daftar sumber belajar yang direkomendasikan untuk langkah ini.'),
});

const LearningPathOutputSchema = z.object({
  path: z.array(StepSchema).describe('A structured, step-by-step learning path for the given topic.'),
});
export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;


export async function generateLearningPath(
  input: LearningPathInput
): Promise<LearningPathOutput> {
  return learningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningPathPrompt',
  input: { schema: LearningPathInputSchema },
  output: { schema: LearningPathOutputSchema },
  prompt: `Kamu adalah seorang ahli pembuat kurikulum dan career coach yang asik. Tugasmu adalah membuat peta jalan belajar (roadmap) yang lengkap dan langkah demi langkah untuk sebuah topik.

  Topiknya adalah: {{{topic}}}

  Peta jalan belajarnya harus logis, mulai dari dasar sampai ke hal-hal yang lebih expert. Untuk setiap langkah, berikan:
  1. Judul langkah (stepTitle).
  2. Deskripsi singkat (description).
  3. Beberapa sub-poin (subPoints) berisi konsep kunci atau teknologi.
  4. Daftar sumber belajar (resources) yang relevan, seperti artikel, tutorial, atau video. Setiap sumber harus memiliki judul (title) dan URL yang valid (url).

  Tolong hasilnya dalam format JSON yang sesuai dengan skema output dan dalam bahasa Indonesia.
`,
});

const learningPathFlow = ai.defineFlow(
  {
    name: 'learningPathFlow',
    inputSchema: LearningPathInputSchema,
    outputSchema: LearningPathOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
