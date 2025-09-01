'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { BACKEND_URL } from "../../lib/config";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLANS = [
  { name: "Bronze", key: "BRONZE", price: 10, benefits: "7 mins watch time" },
  { name: "Silver", key: "SILVER", price: 50, benefits: "10 mins watch time" },
  { name: "Gold", key: "GOLD", price: 100, benefits: "Unlimited watch time" },
];

export default function PremiumPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const id = "razorpay-js";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const startPayment = async (planKey: string, price: number) => {
    if (!user) { alert("Please login first."); return; }
    setLoading(planKey);
    try {
      const orderRes = await fetch(`${BACKEND_URL}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, userUid: user.uid }),
      });
      const orderData = await orderRes.json();
      if (!orderData.ok) { alert(orderData.message || "Failed to create order"); return; }

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "YourTube Subscription",
        description: `${planKey} Plan`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${BACKEND_URL}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              plan: planKey,
              userUid: user.uid,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.ok) {
            alert(`✅ Payment successful! You are now on ${planKey} plan.`);
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
      setLoading(null);
    }
  };

  if (!user) return <p className="p-6 text-red-500">Login to upgrade.</p>;

  return (
    <div className="p-6 grid md:grid-cols-3 gap-6">
      {PLANS.map((p) => (
        <div key={p.key} className="border rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-2">{p.name}</h2>
          <p className="mb-2">{p.benefits}</p>
          <p className="text-lg font-semibold mb-4">₹{p.price}</p>
          <button
            onClick={() => startPayment(p.key, p.price)}
            disabled={loading === p.key}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
          >
            {loading === p.key ? "Starting…" : `Buy ${p.name}`}
          </button>
        </div>
      ))}
    </div>
  );
}
