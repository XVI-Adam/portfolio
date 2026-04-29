import { kv } from '@vercel/kv'

export interface Purchase {
  user_id: string
  amount: number
  type: 'gems' | 'tip'
  gems_granted?: number
  stripe_payment_id: string
  timestamp: number
}

const KEY = 'purchases'

export async function readPurchases(): Promise<Purchase[]> {
  try {
    const data = await kv.get<Purchase[]>(KEY)
    return data ?? []
  } catch {
    return []
  }
}

/** Returns true if the purchase was new, false if it was a duplicate. */
export async function addPurchase(purchase: Purchase): Promise<boolean> {
  const purchases = await readPurchases()
  const exists = purchases.some(
    (p) => p.stripe_payment_id === purchase.stripe_payment_id
  )
  if (exists) return false
  purchases.push(purchase)
  await kv.set(KEY, purchases)
  return true
}
