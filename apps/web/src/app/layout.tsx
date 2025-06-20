import type { Metadata } from "next";
import "./globals.css";

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
        <header className="card-neu mx-4 mt-4 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-500">NexBid</h1>
              </div>
              <nav className="flex space-x-2">
                <a href="/" className="btn-secondary text-sm">
                  Projects
                </a>
                <a href="/project/new" className="btn-primary text-sm">
                  Post Project
                </a>
                <a href="/dashboard" className="btn-secondary text-sm">
                  Dashboard
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="px-4">{children}</main>
        <footer className="card-neu mx-4 mt-16 mb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-neu-gray text-sm">
              © 2024 NexBid. Built with Next.js, Express, and Prisma.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
