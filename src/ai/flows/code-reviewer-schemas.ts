
import { z } from 'zod';

export const CodeReviewerInputSchema = z.object({
  code: z.string().describe('The source code written by the user.'),
  language: z
    .enum(['javascript', 'python'])
    .describe('The programming language of the code.'),
  errorMessage: z.string().describe('The error message produced when running the code.'),
});
export type CodeReviewerInput = z.infer<typeof CodeReviewerInputSchema>;

export const CodeReviewerOutputSchema = z.object({
  problem: z
    .string()
    .describe('A clear, one-sentence explanation of what the error means in simple terms.'),
  solution: z
    .string()
    .describe('A friendly explanation of how to fix the code, with a corrected code snippet if possible.'),
});
export type CodeReviewerOutput = z.infer<typeof CodeReviewerOutputSchema>;
