// yourtube/src/app/layout.tsx
import "./globals.css";
import { AuthProvider } from "../../context/AuthContext";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "YourTube",
  description: "YouTube Clone by Deeksha",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-zinc-950 text-black dark:text-white">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
