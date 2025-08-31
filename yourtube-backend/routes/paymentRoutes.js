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

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

/**
 * POST /api/payments/create-order
 * body: { amountInPaise: number, userUid: string }
 */
router.post("/create-order", async (req, res) => {
  try {
    const { amountInPaise, userUid } = req.body;
    if (!amountInPaise || !userUid) {
      return res.status(400).json({ ok: false, message: "amountInPaise and userUid are required" });
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise, // e.g. 19900 for ₹199.00
      currency: "INR",
      receipt: `yt-prem-${Date.now()}`,
    });

    res.json({ ok: true, order, keyId: key_id });
  } catch (err) {
    console.error("create-order error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * POST /api/payments/verify
 * body: { userUid, razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
router.post("/verify", async (req, res) => {
  try {
    const { userUid, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!userUid || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
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

    await Subscription.findOneAndUpdate(
      { userUid },
      { plan: "PREMIUM", active: true, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("verify error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
