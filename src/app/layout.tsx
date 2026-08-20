import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getClient } from "@/lib/apollo";
import { GET_PRIMARY_MENU } from "@/lib/queries";
import MegaMenu, { RawMenuItem } from "@/components/MegaMenu";

export const metadata: Metadata = {
  title: {
    default: "rukhsolutions.com",
    template: "%s | rukhsolutions.com",
  },
};

export const revalidate = 60;

async function getMenu(): Promise<RawMenuItem[]> {
  try {
    const client = getClient();
    const { data } = await client.query<{ menuItems: { nodes: RawMenuItem[] } }>({
      query: GET_PRIMARY_MENU,
    });
    return data.menuItems?.nodes || [];
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menu = await getMenu();

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-50 h-16 border-b border-black/5 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
            <a href="/" className="text-lg font-semibold tracking-tight">
              rukhsolutions
            </a>

            <MegaMenu items={menu} />

            <Link
              href="/cart"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-colors hover:border-[var(--brand-gold-deep)]"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.6L21 8H6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="21" r="1.4" fill="currentColor" />
                <circle cx="18" cy="21" r="1.4" fill="currentColor" />
              </svg>
            </Link>
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
