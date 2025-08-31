// yourtube/src/app/layout.tsx
import './globals.css';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import { AuthProvider } from '../../context/AuthContext';

export const metadata = {
  title: 'YourTube',
  description: 'YouTube Clone by Deeksha',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-zinc-950 text-black dark:text-white">
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}
