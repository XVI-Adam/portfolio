import type { Context } from "hono";
import { readFileSync, writeFileSync } from "fs";
import { existsSync } from "fs";
import Stripe from "stripe";

const PURCHASES_FILE = "/home/workspace/gem_purchases.json";
const LOCK_FILE = "/home/workspace/gem_purchases.lock";

interface Purchase {
  user_id: string;
  amount: number;
  type: "gems" | "tip";
  gems_granted?: number;
  stripe_payment_id: string;
  timestamp: number;
}

function acquireLock(maxWaitMs: number = 5000) {
  const startTime = Date.now();
  while (existsSync(LOCK_FILE)) {
    if (Date.now() - startTime > maxWaitMs) throw new Error("Lock timeout");
  }
  try {
    writeFileSync(LOCK_FILE, "locked", { flag: "wx" });
  } catch {
    return acquireLock(maxWaitMs);
  }
}

function releaseLock() {
  try {
    if (existsSync(LOCK_FILE)) {
      const fs = require("fs");
      fs.unlinkSync(LOCK_FILE);
    }
  } catch {}
}

function readPurchases(): Purchase[] {
  try {
    if (!existsSync(PURCHASES_FILE)) return [];
    return JSON.parse(readFileSync(PURCHASES_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writePurchases(purchases: Purchase[]) {
  writeFileSync(PURCHASES_FILE, JSON.stringify(purchases, null, 2));
}

function addPurchase(purchase: Purchase): boolean {
  acquireLock();
  try {
    const purchases = readPurchases();
    const exists = purchases.some(
      (p) => p.stripe_payment_id === purchase.stripe_payment_id
    );
    if (!exists) {
      purchases.push(purchase);
      writePurchases(purchases);
      return true;
    }
    return false;
  } finally {
    releaseLock();
  }
}

export default async (c: Context) => {
  const sig = c.req.header("stripe-signature");
  const body = await c.req.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!sig || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return c.json({ error: "Missing signature or secret" }, 400);
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(stripeKey || "", {
      apiVersion: "2024-12-18.acacia",
    });
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return c.json({ error: "Invalid signature" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    const stripePaymentId = session.id;

    const purchase: Purchase = {
      user_id: metadata.user_id || "unknown",
      amount: Number(metadata.amount) || 0,
      type: (metadata.type as "gems" | "tip") || "gems",
      stripe_payment_id: stripePaymentId,
      timestamp: Date.now(),
    };
    if (purchase.type === "gems" && metadata.gems_granted) {
      purchase.gems_granted = Number(metadata.gems_granted);
    }

    const added = addPurchase(purchase);
    if (added) {
      console.log(`Purchase recorded: ${purchase.user_id} - ${purchase.type}`);
    } else {
      console.log(`Purchase already processed: ${purchase.stripe_payment_id}`);
    }
  }

  return c.json({ received: true });
};