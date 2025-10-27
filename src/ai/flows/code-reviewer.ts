
'use server';

/**
 * @fileOverview An AI agent that reviews user code, explains errors, and suggests fixes.
 *
 * - reviewCodeError - A function that handles the code error review process.
 */

import { ai } from '@/ai/genkit';
import {
  CodeReviewerInputSchema,
  CodeReviewerOutputSchema,
  type CodeReviewerInput,
  type CodeReviewerOutput,
} from '@/ai/flows/code-reviewer-schemas';

export async function reviewCodeError(
  input: CodeReviewerInput
): Promise<CodeReviewerOutput> {
  return codeReviewerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeReviewerPrompt',
  input: { schema: CodeReviewerInputSchema },
  output: { schema: CodeReviewerOutputSchema },
  prompt: `Kamu adalah seorang senior programmer yang ramah dan jago menjelaskan konsep sulit. Seorang junior baru saja menjalankan kode dan mendapatkan error. Tugasmu adalah menjelaskan error tersebut dengan cara yang sangat mudah dimengerti.

Bahasa Pemrograman: {{{language}}}

Kode yang dijalankan:
\`\`\`
{{{code}}}
\`\`\`

Pesan Error yang muncul:
{{{errorMessage}}}

Tolong berikan penjelasan dalam format berikut:
1.  **Masalah (problem):** Jelaskan dalam satu kalimat sederhana apa arti dari error tersebut. Jangan terlalu teknis.
2.  **Saran Perbaikan (solution):** Jelaskan dengan ramah apa yang salah dengan kodenya dan bagaimana cara memperbaikinya. Jika memungkinkan, berikan contoh kode yang sudah diperbaiki.

Gunakan Bahasa Indonesia yang santai dan memotivasi.
`,
});

const codeReviewerFlow = ai.defineFlow(
  {
    name: 'codeReviewerFlow',
    inputSchema: CodeReviewerInputSchema,
    outputSchema: CodeReviewerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
