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

const StepSchema = z.object({
  stepTitle: z.string().describe('The title of the learning step.'),
  description: z.string().describe('A brief description of what to learn in this step.'),
  subPoints: z.array(z.string()).describe('A list of key concepts or technologies to cover in this step.'),
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

  Peta jalan belajarnya harus logis, mulai dari dasar sampai ke hal-hal yang lebih expert. Untuk setiap langkah, berikan judul, deskripsi singkat, dan beberapa sub-poin (konsep kunci atau teknologi).
  
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
