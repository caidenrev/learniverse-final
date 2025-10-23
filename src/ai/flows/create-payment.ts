'use server';

/**
 * @fileOverview A flow to create a Midtrans payment transaction.
 *
 * - createPayment - A function that handles the payment creation process.
 * - CreatePaymentInput - The input type for the createPayment function.
 * - CreatePaymentOutput - The return type for the createPayment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Snap } from 'midtrans-client';

const CreatePaymentInputSchema = z.object({
  userId: z.string().describe("The user's unique identifier."),
  planId: z.enum(['premium']).describe('The ID of the plan being purchased.'),
  amount: z.number().describe('The total amount for the transaction.'),
  user: z.object({
    name: z.string().describe("The user's full name."),
    email: z.string().email().describe("The user's email address."),
  }),
});
export type CreatePaymentInput = z.infer<typeof CreatePaymentInputSchema>;

const CreatePaymentOutputSchema = z.object({
  paymentUrl: z.string().url().describe('The Midtrans Snap payment URL.'),
});
export type CreatePaymentOutput = z.infer<typeof CreatePaymentOutputSchema>;

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
  return createPaymentFlow(input);
}

const createPaymentFlow = ai.defineFlow(
  {
    name: 'createPaymentFlow',
    inputSchema: CreatePaymentInputSchema,
    outputSchema: CreatePaymentOutputSchema,
  },
  async (input) => {
    // Validasi kunci API di awal
    if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
      console.error('MIDTRANS_SERVER_KEY or MIDTRANS_CLIENT_KEY is not set in .env file.');
      throw new Error('Konfigurasi kunci Midtrans tidak ditemukan. Harap periksa pengaturan server.');
    }

    // Inisialisasi Midtrans Snap
    const snap = new Snap({
      isProduction: true, // Set ke true jika sudah live. Pastikan kunci yang digunakan sesuai.
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const orderId = `learniverse-${input.planId}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: input.amount,
      },
      customer_details: {
        first_name: input.user.name,
        email: input.user.email,
      },
      item_details: [
        {
          id: input.planId,
          price: input.amount,
          quantity: 1,
          name: 'Learniverse Premium Subscription',
          merchant_name: 'Learniverse',
        },
      ],
    };

    try {
      const transaction = await snap.createTransaction(parameter);
      const paymentUrl = transaction.redirect_url;

      if (!paymentUrl) {
        throw new Error('Failed to create payment URL from Midtrans.');
      }

      return { paymentUrl };
    } catch (e: any) {
      console.error('Midtrans API Error:', e.message);
      // Memberikan pesan error yang lebih spesifik jika tetap 401
      if (e.httpStatusCode === 401) {
          throw new Error('Akses ditolak oleh Midtrans. Pastikan Server Key dan Client Key yang Anda gunakan benar dan sesuai dengan lingkungan (Sandbox/Production).');
      }
      throw new Error(`Gagal membuat transaksi Midtrans: ${e.message}`);
    }
  }
);
