import type { Context } from "hono";
import { readFileSync, existsSync } from "fs";

const PURCHASES_FILE = "/home/workspace/gem_purchases.json";

interface Purchase {
  user_id: string;
  amount: number;
  type: "gems" | "tip";
  gems_granted?: number;
  stripe_payment_id: string;
  timestamp: number;
}

export default async (c: Context) => {
  const userId = c.req.param("userId");

  if (!userId) {
    return c.json({ error: "userId required" }, 400);
  }

  try {
    if (!existsSync(PURCHASES_FILE)) {
      return c.json({
        user_id: userId,
        total_gems: 0,
        purchase_count: 0,
        purchases: [],
      });
    }

    const purchases: Purchase[] = JSON.parse(
      readFileSync(PURCHASES_FILE, "utf8")
    );
    const userPurchases = purchases.filter(
      (p) => p.user_id === userId && p.type === "gems"
    );

    const totalGems = userPurchases.reduce(
      (sum, p) => sum + (p.gems_granted || 0),
      0
    );
    return c.json({
      user_id: userId,
      total_gems: totalGems,
      purchase_count: userPurchases.length,
      purchases: userPurchases,
    });
  } catch (err) {
    console.error("Error reading gem purchases:", err);
    return c.json({ error: "Failed to read gem data" }, 500);
  }
};