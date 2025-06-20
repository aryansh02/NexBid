import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "NexBid - Freelance Marketplace",
  description: "Connect buyers and sellers for project-based work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <Navigation />
          <main className="px-4">{children}</main>
          <footer className="card-neu mx-4 mt-16 mb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center text-neu-gray text-sm">
                © 2024 NexBid. Built with Next.js, Express, and Prisma.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
