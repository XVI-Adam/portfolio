import type { Context } from "hono";
import { readFileSync } from "fs";
import { existsSync } from "fs";

interface Purchase {
  user_id: string;
  amount: number;
  type: "gems" | "tip";
  gems_granted?: number;
  stripe_payment_id: string;
  timestamp: number;
}

const PURCHASES_FILE = "/home/workspace/gem_purchases.json";

function readPurchases(): Purchase[] {
  try {
    if (!existsSync(PURCHASES_FILE)) return [];
    return JSON.parse(readFileSync(PURCHASES_FILE, "utf8"));
  } catch {
    return [];
  }
}

export default (c: Context) => {
  const limitParam = c.req.query("limit") || "50";
  const limit = Math.min(Math.max(1, parseInt(limitParam, 10) || 50), 1000);

  const purchases = readPurchases();
  const tips = purchases
    .filter(p => p.type === "tip")
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
    .map(p => ({
      user_id: p.user_id,
      amount_cents: p.amount,
      amount_usd: (p.amount / 100).toFixed(2),
      timestamp: p.timestamp,
      date: new Date(p.timestamp).toISOString(),
    }));

  const topTippers = purchases
    .filter(p => p.type === "tip")
    .reduce((acc, p) => {
      const existing = acc.find(t => t.user_id === p.user_id);
      if (existing) {
        existing.total_cents += p.amount;
      } else {
        acc.push({ user_id: p.user_id, total_cents: p.amount });
      }
      return acc;
    }, [] as Array<{ user_id: string; total_cents: number }>)
    .sort((a, b) => b.total_cents - a.total_cents)
    .slice(0, 10)
    .map(t => ({
      user_id: t.user_id,
      total_cents: t.total_cents,
      total_usd: (t.total_cents / 100).toFixed(2),
    }));

  return c.json({
    recent_tips: tips,
    top_tippers: topTippers,
    total_tips: purchases.filter(p => p.type === "tip").length,
    total_tipped_usd: (
      purchases
        .filter(p => p.type === "tip")
        .reduce((sum, p) => sum + p.amount, 0) / 100
    ).toFixed(2),
  });
};