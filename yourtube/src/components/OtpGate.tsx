'use client';

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function OtpGate() {
  const { user } = useAuth();

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      const key = `otp_initiated_${user.uid}`;
      if (localStorage.getItem(key)) return; // already sent this session

      try {
        const res = await fetch("http://localhost:5000/api/otp/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userUid: user.uid, email: user.email }),
        });
        const data = await res.json();
        if (data.ok) {
          localStorage.setItem(key, "1");
          // Optional: also immediately apply theme returned by backend
          if (data.theme === "light") {
            document.documentElement.classList.remove("dark");
          } else {
            document.documentElement.classList.add("dark");
          }
        }
      } catch {}
    };

    run();
  }, [user]);

  return null;
}
