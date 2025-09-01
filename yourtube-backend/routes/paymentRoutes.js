// yourtube-backend/routes/paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Subscription from "../models/Subscription.js";

const router = express.Router();

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.warn("⚠️ RAZORPAY keys missing in .env, payment will fail.");
}

const razorpay = new Razorpay({ key_id, key_secret });

// Map plan to amount in paise (₹ * 100)
const PLAN_PRICING = {
  BRONZE: 1000,  // ₹10
  SILVER: 5000,  // ₹50
  GOLD: 10000,   // ₹100
};

// Map plan to video watch time (expiry not for GOLD)
const PLAN_EXPIRY_MINUTES = {
  BRONZE: 7,
  SILVER: 10,
  GOLD: null, // unlimited
};

/**
 * POST /api/payments/create-order
 * body: { plan: "BRONZE"|"SILVER"|"GOLD", userUid: string }
 */
router.post("/create-order", async (req, res) => {
  try {
    const { plan, userUid } = req.body;
    if (!plan || !userUid) {
      return res.status(400).json({ ok: false, message: "plan and userUid are required" });
    }
    if (!PLAN_PRICING[plan]) {
      return res.status(400).json({ ok: false, message: "Invalid plan" });
    }

    const amountInPaise = PLAN_PRICING[plan];
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `yt-${plan}-${Date.now()}`,
    });

    res.json({ ok: true, order, keyId: key_id });
  } catch (err) {
    console.error("create-order error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * POST /api/payments/verify
 * body: { plan, userUid, razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
router.post("/verify", async (req, res) => {
  try {
    const { plan, userUid, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!plan || !userUid || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ ok: false, message: "Signature mismatch" });
    }

    let expiry = null;
    if (PLAN_EXPIRY_MINUTES[plan]) {
      expiry = new Date(Date.now() + PLAN_EXPIRY_MINUTES[plan] * 60 * 1000);
    }

    await Subscription.findOneAndUpdate(
      { userUid },
      { plan, active: true, expiry, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ ok: true, plan });
  } catch (err) {
    console.error("verify error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
