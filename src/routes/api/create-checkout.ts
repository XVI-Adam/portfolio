import type { Context } from "hono";
import Stripe from "stripe";

interface CheckoutRequest {
  type?: "gems" | "tip";
  package?: "starter" | "power" | "legendary";
  amount?: number;
  gems?: number;
  user_id: string;
}

const GEM_PACKAGES = {
  starter: { price_cents: 499, gems: 100, description: "100 gems" },
  power: { price_cents: 999, gems: 250, description: "250 gems" },
  legendary: { price_cents: 2499, gems: 750, description: "750 gems" },
};

export default async (c: Context) => {
  const stripeKey = process.env.STRIPE_SK_TEST;
  if (!stripeKey) {
    return c.json({ error: "Stripe not configured" }, 500);
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });
  
  let body: CheckoutRequest;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const { type, package: pkg, amount, gems, user_id } = body;
  if (!user_id) {
    return c.json({ error: "user_id required" }, 400);
  }

  let transactionType = type;
  if (!transactionType && gems && amount) {
    transactionType = "gems";
  }

  if (transactionType === "gems") {
    let priceCents: number;
    let gemCount: number;
    let description: string;

    if (pkg && pkg in GEM_PACKAGES) {
      const packageData = GEM_PACKAGES[pkg as keyof typeof GEM_PACKAGES];
      priceCents = packageData.price_cents;
      gemCount = packageData.gems;
      description = packageData.description;
    } else if (gems && amount) {
      gemCount = gems;
      priceCents = Math.round(amount * 100);
      description = `${gems} gems`;
    } else {
      return c.json({ error: "Invalid gem package or amount" }, 400);
    }
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${description} 💎`,
              },
              unit_amount: priceCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "https://verticalsushi.zo.space/stack?success=true&gems=" + encodeURIComponent(gemCount),
        cancel_url: "https://verticalsushi.zo.space/stack?cancelled=true",
        metadata: {
          user_id,
          type: "gems",
          amount: String(priceCents),
          gems_granted: String(gemCount),
        },
      });

      return c.json({ sessionId: session.id, url: session.url });
    } catch (err) {
      console.error("Stripe error:", err);
      return c.json({ error: "Failed to create checkout session" }, 500);
    }
  } else if (transactionType === "tip") {
    if (!amount || amount < 100) {
      return c.json({ error: "Tip amount must be at least $1.00" }, 400);
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Tip 💝",
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "https://verticalsushi.zo.space/tips?success=true",
        cancel_url: "https://verticalsushi.zo.space/tips?cancelled=true",
        metadata: {
          user_id,
          type: "tip",
          amount: String(amount),
        },
      });

      return c.json({ sessionId: session.id, url: session.url });
    } catch (err) {
      console.error("Stripe error:", err);
      return c.json({ error: "Failed to create checkout session" }, 500);
    }
  } else {
    return c.json({ error: "Could not determine transaction type" }, 400);
  }
};