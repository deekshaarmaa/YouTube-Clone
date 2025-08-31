// yourtube/src/lib/config.ts
// yourtube/lib/config.ts
export const BACKEND_URL = "http://localhost:5000"; // or your deployed backend URL


export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

// Make sure to set NEXT_PUBLIC_RAZORPAY_KEY_ID in your .env.local file
