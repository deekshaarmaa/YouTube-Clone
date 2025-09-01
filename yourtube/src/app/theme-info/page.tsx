// src/app/theme-info/page.tsx
"use client";

import React from "react";

export default function ThemeInfoPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Theme & OTP Rules</h1>
      <p className="mb-2">
        🔹 If you access the website between <b>10 AM to 12 PM</b> and your
        location is <b>South India</b> (Tamil Nadu, Kerala, Karnataka, Andhra,
        Telangana), the theme will be <span className="font-semibold">White</span>.
      </p>
      <p className="mb-2">
        🔹 At other times or from other states, the theme will be{" "}
        <span className="font-semibold">Dark</span>.
      </p>
      <p className="mb-2">
        🔹 If login is from <b>South India</b>, an <b>Email OTP</b> will be
        triggered.
      </p>
      <p className="mb-2">
        🔹 If login is from <b>other states</b>, an <b>SMS OTP</b> will be
        triggered.
      </p>
    </div>
  );
}
