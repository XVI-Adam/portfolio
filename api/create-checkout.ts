import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

// Matches the packages shown in the frontend (stack.tsx GEM_PACKAGES)
const GEM_PACKAGES = {
  starter:  { price_cents: 499,  gems: 150,  label: '150 Gems' },
  power:    { price_cents: 999,  gems: 400,  label: '400 Gems' },
  legendary: { price_cents: 2499, gems: 1200, label: '1200 Gems' },
} as const

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const stripeKey = process.env.STRIPE_SK_TEST
  if (!stripeKey) return res.status(500).json({ error: 'Stripe not configured' })

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' })

  const { type, package: pkg, amount, user_id } = req.body ?? {}
  if (!user_id) return res.status(400).json({ error: 'user_id required' })

  const site = process.env.SITE_URL ?? 'http://localhost:5173'

  // ── Gem purchase ─────────────────────────────────────────────────────────
  if (type === 'gems') {
    if (!pkg || !(pkg in GEM_PACKAGES)) {
      return res.status(400).json({ error: 'Invalid gem package' })
    }
    const { price_cents, gems, label } = GEM_PACKAGES[pkg as keyof typeof GEM_PACKAGES]

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: `${label} 💎` },
            unit_amount: price_cents,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${site}/stack?success=true&gems=${gems}`,
        cancel_url:  `${site}/stack?cancelled=true`,
        metadata: {
          user_id,
          type: 'gems',
          amount: String(price_cents),
          gems_granted: String(gems),
        },
      })
      return res.json({ sessionId: session.id, url: session.url })
    } catch (err) {
      console.error('Stripe error:', err)
      return res.status(500).json({ error: 'Failed to create checkout session' })
    }
  }

  // ── Tip ──────────────────────────────────────────────────────────────────
  if (type === 'tip') {
    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Tip amount must be at least $1.00' })
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Tip 💝' },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${site}/tips?success=true`,
        cancel_url:  `${site}/tips?cancelled=true`,
        metadata: {
          user_id,
          type: 'tip',
          amount: String(amount),
        },
      })
      return res.json({ sessionId: session.id, url: session.url })
    } catch (err) {
      console.error('Stripe error:', err)
      return res.status(500).json({ error: 'Failed to create checkout session' })
    }
  }

  return res.status(400).json({ error: 'Could not determine transaction type' })
}
