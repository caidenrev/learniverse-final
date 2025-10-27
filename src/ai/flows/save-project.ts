
'use server';
/**
 * @fileOverview A flow to save a generated project to Firestore.
 *
 * - saveProject - A function that handles saving the project.
 * - SaveProjectInput - The input type for the saveProject function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getSdks } from '@/firebase';

export const SaveProjectInputSchema = z.object({
  userId: z.string().describe('The UID of the user saving the project.'),
  title: z.string().describe('A user-defined title for the project.'),
  feature: z.string().describe('The name of the feature used to generate this project.'),
  featureUrl: z.string().describe('The URL of the feature page.'),
  input: z.any().describe('The original input provided by the user.'),
  output: z.any().describe('The AI-generated output.'),
});
export type SaveProjectInput = z.infer<typeof SaveProjectInputSchema>;

export async function saveProject(input: SaveProjectInput): Promise<{ projectId: string }> {
  return saveProjectFlow(input);
}

const saveProjectFlow = ai.defineFlow(
  {
    name: 'saveProjectFlow',
    inputSchema: SaveProjectInputSchema,
    outputSchema: z.object({ projectId: z.string() }),
  },
  async (input) => {
    const { firestore } = getSdks();
    const projectId = doc(collection(firestore, 'dummy-path')).id; // Generate a new ID
    const projectRef = doc(firestore, 'users', input.userId, 'projects', projectId);

    const projectData = {
      ...input,
      isSaved: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    // We are not using the non-blocking version here because we want to await the result
    // to confirm to the user that the save was successful.
    await setDoc(projectRef, projectData);

    return { projectId };
  }
);
