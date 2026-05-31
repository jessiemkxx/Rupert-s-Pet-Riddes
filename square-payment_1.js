// api/square-payment.js
// Vercel serverless function — processes Square payments server-side
// Deploy this alongside your HTML file on Vercel

import { Client, Environment } from 'squareup';
import { randomUUID } from 'crypto';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN, // set in Vercel environment variables
  environment: process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox,
});

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sourceId, amount, currency = 'AUD' } = req.body;

  if (!sourceId || !amount) {
    return res.status(400).json({ error: 'Missing sourceId or amount' });
  }

  try {
    const { result } = await client.paymentsApi.createPayment({
      sourceId,
      idempotencyKey: randomUUID(),   // prevents duplicate charges
      amountMoney: {
        amount: BigInt(amount),        // amount in cents e.g. 10050 = $100.50 AUD
        currency,
      },
      locationId: process.env.SQUARE_LOCATION_ID,
      note: "Rupert's Pet Rides booking",
    });

    return res.status(200).json({ payment: result.payment });

  } catch (error) {
    console.error('Square payment error:', error);
    return res.status(500).json({
      error: error.message || 'Payment processing failed',
    });
  }
}
