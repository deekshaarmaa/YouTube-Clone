"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser, logoutUser } from "../../../utils/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function RegisterLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const router = useRouter();

  // ✅ Track logged in user
  onAuthStateChanged(auth, (user) => {
    setUserEmail(user ? user.email : null);
  });

  const handleRegister = async () => {
    try {
      await registerUser(email, password);
      alert("✅ Registered successfully!");
      router.push("/"); // redirect to Home
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      alert("✅ Logged in successfully!");
      router.push("/"); // redirect to Home
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    alert("✅ Logged out!");
  };

  return (
    <div className="p-6 flex flex-col gap-4 max-w-sm mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-center">Register / Login</h2>

      {userEmail ? (
        <div className="text-center">
          <p className="mb-2">
            Logged in as: <b>{userEmail}</b>
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={handleRegister}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Register
            </button>
            <button
              onClick={handleLogin}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Login
            </button>
          </div>
        </>
      )}
    </div>
  );
}
