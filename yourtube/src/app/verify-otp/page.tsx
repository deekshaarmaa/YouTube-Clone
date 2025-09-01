'use client';

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function VerifyOtpPage() {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    if (!user) { setMsg("Please log in first."); return; }
    setMsg(null);
    try {
      const res = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userUid: user.uid, code }),
      });
      const data = await res.json();
      if (data.ok) setMsg("✅ Verified!");
      else setMsg(data.message || "❌ Verification failed");
    } catch (e) {
      setMsg("❌ Verification failed");
    }
  };

  if (!user) return <p className="p-6 text-red-500">Login to verify OTP</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Verify OTP</h1>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter 6-digit OTP"
        className="border rounded p-2 w-full mb-3"
      />
      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Verify
      </button>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
