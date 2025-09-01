// yourtube-backend/routes/otpRoutes.js
import express from "express";
import axios from "axios";
import nodemailer from "nodemailer";
import OtpToken from "../models/OtpToken.js";

const router = express.Router();

// ---------- helpers ----------
const SOUTH_STATES = [
  "tamil nadu", "kerala", "karnataka", "andhra pradesh", "telangana"
];

function isSouthState(stateName = "") {
  const s = (stateName || "").toLowerCase().trim();
  return SOUTH_STATES.includes(s);
}

function getIndiaHour() {
  const istString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(istString).getHours();
}

function decideTheme({ state }) {
  const hour = getIndiaHour();               // 0..23 (IST)
  const inWindow = hour >= 10 && hour < 12;  // 10:00–11:59
  const south = isSouthState(state);
  // White theme ONLY if BOTH conditions true
  const theme = south && inWindow ? "light" : "dark";
  return { theme, hour, south };
}

function getClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (xf) return xf.split(",")[0].trim();
  return req.socket?.remoteAddress?.replace("::ffff:", "") || req.ip;
}

async function lookupLocation(ip) {
  try {
    // ipapi works without key for basic fields
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 4000 });
    return {
      city: data?.city || "Unknown",
      region: data?.region || data?.region_code || data?.state || "Unknown",
      country: data?.country_name || "Unknown"
    };
  } catch {
    return { city: "Unknown", region: "Unknown", country: "Unknown" };
  }
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ---------- routes ----------

/**
 * GET /api/otp/theme
 * Returns theme based on IP location + time
 */
router.get("/theme", async (req, res) => {
  const ip = getClientIp(req);
  const loc = await lookupLocation(ip);
  const { theme, hour, south } = decideTheme({ state: loc.region });
  res.json({ ok: true, theme, location: loc, hour, south });
});

/**
 * POST /api/otp/initiate
 * body: { userUid: string, email: string }
 * Sends OTP via email (for both south & other states — as per your choice)
 * Returns theme as well, so frontend can apply it immediately.
 */
router.post("/initiate", async (req, res) => {
  try {
    const { userUid, email } = req.body;
    if (!userUid || !email) {
      return res.status(400).json({ ok: false, message: "userUid and email are required" });
    }

    const ip = getClientIp(req);
    const loc = await lookupLocation(ip);
    const themeInfo = decideTheme({ state: loc.region });

    // generate + store OTP
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await OtpToken.create({ userUid, email, code, expiresAt });

    // send email
    const from = process.env.FROM_EMAIL || "YourTube <no-reply@yourtube.local>";
    await transporter.sendMail({
      from,
      to: email,
      subject: "YourTube Login OTP",
      html: `
        <p>Hi,</p>
        <p>Your OTP code is: <b style="font-size:16px">${code}</b></p>
        <p>It expires in 10 minutes.</p>
        <hr/>
        <p>Detected location: ${loc.city}, ${loc.region}, ${loc.country}</p>
      `,
    });

    res.json({
      ok: true,
      message: "OTP sent to email",
      theme: themeInfo.theme,
      location: loc
    });
  } catch (err) {
    console.error("initiate OTP error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * POST /api/otp/verify
 * body: { userUid: string, code: string }
 */
router.post("/verify", async (req, res) => {
  try {
    const { userUid, code } = req.body;
    if (!userUid || !code) {
      return res.status(400).json({ ok: false, message: "userUid and code are required" });
    }

    const token = await OtpToken.findOne({ userUid, code, used: false }).sort({ createdAt: -1 });
    if (!token) return res.status(400).json({ ok: false, message: "Invalid OTP" });
    if (new Date() > token.expiresAt) return res.status(400).json({ ok: false, message: "OTP expired" });

    token.used = true;
    await token.save();

    res.json({ ok: true, message: "OTP verified" });
  } catch (err) {
    console.error("verify OTP error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
