'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { BACKEND_URL } from "../../lib/config";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PremiumPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const amountInPaise = 19900; // ₹199.00 test amount

  useEffect(() => {
    // Load Razorpay script
    const id = "razorpay-js";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const startPayment = async () => {
    if (!user) { alert("Please login first."); return; }
    setLoading(true);
    try {
      const orderRes = await fetch(`${BACKEND_URL}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInPaise, userUid: user.uid }),
      });
      const orderData = await orderRes.json();
      if (!orderData.ok) { alert(orderData.message || "Failed to create order"); return; }

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "YourTube Premium",
        description: "Unlimited downloads",
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // verify on backend
          const verifyRes = await fetch(`${BACKEND_URL}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userUid: user.uid,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.ok) {
            alert("✅ Payment successful! You are now Premium.");
          } else {
            alert("Verification failed.");
          }
        },
        prefill: {
          name: user.name || "YourTube User",
          email: user.email || "user@example.com",
        },
        theme: { color: "#0ea5e9" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (e) {
      console.error(e);
      alert("Payment failed to start.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="p-6 text-red-500">Login to upgrade.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">Go Premium</h1>
      <p className="text-gray-600 mb-4">
        Premium unlocks <b>unlimited video downloads</b>. Free users can download 1 video per day.
      </p>
      <button
        onClick={startPayment}
        disabled={loading}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
      >
        {loading ? "Starting…" : "Pay ₹199 (Test Mode)"}
      </button>
    </div>
  );
}
