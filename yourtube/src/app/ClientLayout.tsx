// yourtube/src/app/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TopBar from "../components/TopBar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const authPages = ["/register-login", "/verifyotp"];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen z-50 border-r border-gray-200 dark:border-gray-800">
        <Sidebar />
      </div>
      {/* Main */}
      <div className="ml-64 flex flex-col w-full min-h-screen">
        <TopBar />
        <Navbar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
