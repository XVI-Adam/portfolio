import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readPurchases } from './_lib/storage'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const limit = Math.min(
    Math.max(1, parseInt((req.query.limit as string) ?? '50', 10) || 50),
    1000
  )

  const purchases = await readPurchases()
  const tipPurchases = purchases.filter((p) => p.type === 'tip')

  const recent_tips = tipPurchases
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
    .map((p) => ({
      user_id: p.user_id,
      amount_cents: p.amount,
      amount_usd: (p.amount / 100).toFixed(2),
      timestamp: p.timestamp,
      date: new Date(p.timestamp).toISOString(),
    }))

  const top_tippers = Object.values(
    tipPurchases.reduce<Record<string, { user_id: string; total_cents: number }>>(
      (acc, p) => {
        acc[p.user_id] ??= { user_id: p.user_id, total_cents: 0 }
        acc[p.user_id].total_cents += p.amount
        return acc
      },
      {}
    )
  )
    .sort((a, b) => b.total_cents - a.total_cents)
    .slice(0, 10)
    .map((t) => ({
      user_id: t.user_id,
      total_cents: t.total_cents,
      total_usd: (t.total_cents / 100).toFixed(2),
    }))

  return res.json({
    recent_tips,
    top_tippers,
    total_tips: tipPurchases.length,
    total_tipped_usd: (
      tipPurchases.reduce((sum, p) => sum + p.amount, 0) / 100
    ).toFixed(2),
  })
}
