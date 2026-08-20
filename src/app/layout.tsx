import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "rukhsolutions.com",
    template: "%s | rukhsolutions.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a href="/" className="text-lg font-semibold tracking-tight">
              rukhsolutions
            </a>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-24 border-t border-black/5 py-10 text-center text-sm text-black/50">
          © {new Date().getFullYear()} rukhsolutions.com
        </footer>
      </body>
    </html>
  );
}
