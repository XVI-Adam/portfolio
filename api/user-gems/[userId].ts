import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readPurchases } from '../_lib/storage'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = req.query.userId as string
  if (!userId) return res.status(400).json({ error: 'userId required' })

  const purchases = await readPurchases()
  const userPurchases = purchases.filter(
    (p) => p.user_id === userId && p.type === 'gems'
  )

  const total_gems = userPurchases.reduce(
    (sum, p) => sum + (p.gems_granted ?? 0),
    0
  )

  return res.json({
    user_id: userId,
    total_gems,
    purchase_count: userPurchases.length,
    purchases: userPurchases,
  })
}
