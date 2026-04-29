import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Readable } from 'node:stream'
import Stripe from 'stripe'
import { addPurchase } from './_lib/storage'

// Vercel must not parse the body — Stripe needs the raw bytes to verify the signature
export const config = { api: { bodyParser: false } }

async function toBuffer(readable: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = []
  for await (const chunk of readable) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string))
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const stripeKey = process.env.STRIPE_SK_TEST

  if (!sig || !webhookSecret || !stripeKey) {
    return res.status(400).json({ error: 'Missing Stripe configuration' })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' })

  let event: Stripe.Event
  try {
    const rawBody = await toBuffer(req as unknown as Readable)
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata ?? {}

    const added = await addPurchase({
      user_id: meta.user_id ?? 'unknown',
      amount: Number(meta.amount) || 0,
      type: (meta.type as 'gems' | 'tip') ?? 'tip',
      gems_granted: meta.gems_granted ? Number(meta.gems_granted) : undefined,
      stripe_payment_id: session.id,
      timestamp: Date.now(),
    })

    console.log(added ? `Recorded: ${session.id}` : `Duplicate skipped: ${session.id}`)
  }

  return res.json({ received: true })
}
