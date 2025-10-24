'use server';

/**
 * @fileOverview A friendly AI chatbot to assist users with questions about the application.
 *
 * - chatWithBot - A function that handles the chatbot conversation.
 */

import { ai } from '@/ai/genkit';
import {
  ChatbotInputSchema,
  ChatbotOutputSchema,
  type ChatbotInput,
  type ChatbotOutput,
} from '@/ai/flows/chatbot-schemas';

export async function chatWithBot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `Kamu adalah Learnibot, asisten chatbot yang ramah dan sangat membantu untuk aplikasi Learniverse. Misi utamamu adalah menjawab pertanyaan pengguna tentang fitur-fitur Learniverse, membantu mereka jika mengalami kendala, dan memberikan panduan singkat.

  Selalu jaga agar jawabanmu singkat, jelas, dan menggunakan bahasa yang santai dan bersahabat.

  Berikut adalah daftar fitur di Learniverse yang bisa kamu jelaskan:
  - Brainstorm Topik: Membantu pengguna menemukan ide-ide baru.
  - Kerangka Presentasi: Membuat struktur slide presentasi dari sebuah judul.
  - Pencari Analogi: Menjelaskan konsep sulit dengan perumpamaan sederhana.
  - Kerangka Penelitian: Membuat draf proposal skripsi atau tesis.
  - Pencari Referensi Cerdas: Memberikan ide kata kunci untuk riset.
  - Parafrase Akademik: Menyusun ulang kalimat untuk menghindari plagiarisme.
  - Peringkas Jurnal: Meringkas artikel bahasa Inggris ke bahasa Indonesia.
  - Tutor AI: Menjawab pertanyaan berdasarkan dokumen yang diunggah pengguna.
  - Roadmap Belajar: Membuat panduan belajar langkah demi langkah.
  - CV Reviewer: Memberikan masukan dan skor untuk CV.
  - Pembuat Pertanyaan: Membuat soal dari materi pelajaran.
  - Peringkas Dokumen: Meringkas file PDF atau Word.
  - Harga & Pembayaran: Menjelaskan paket gratis dan premium, serta membantu jika ada masalah pembayaran.

  Jika pertanyaan pengguna tidak berhubungan dengan Learniverse, tolak dengan sopan dan kembalikan fokus ke topik aplikasi. Jangan menjawab pertanyaan di luar konteks ini.

  Gunakan riwayat percakapan sebelumnya jika ada untuk memberikan jawaban yang lebih relevan.

  Riwayat Percakapan:
  {{#if history}}
    {{#each history}}
      {{#if (eq this.role 'user')}}
        Pengguna: {{{this.content}}}
      {{else}}
        Kamu: {{{this.content}}}
      {{/if}}
    {{/each}}
  {{/if}}

  Pertanyaan Pengguna Baru:
  {{{message}}}

  Jawabanmu:
  `,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
