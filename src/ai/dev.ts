'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/presentation-outliner.ts';
import '@/ai/flows/analogy-finder.ts';
import '@/ai/flows/summarizer.ts';
import '@/ai/flows/research-outline-generator.ts';
import '@/ai/flows/smart-reference-finder.ts';
import '@/ai/flows/topic-brainstormer.ts';
import '@/ai/flows/academic-paraphraser.ts';
import '@/ai/flows/ai-tutor.ts';
import '@/ai/flows/learning-path-generator.ts';
import '@/ai/flows/cv-reviewer.ts';
import '@/ai/flows/question-generator.ts';
import '@/ai/flows/document-summarizer.ts';
import '@/ai/flows/create-payment.ts';
