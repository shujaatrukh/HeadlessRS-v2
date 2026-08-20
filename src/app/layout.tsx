import type { Metadata } from "next";
import "./globals.css";
import { getClient } from "@/lib/apollo";
import { GET_PRIMARY_MENU } from "@/lib/queries";
import MegaMenu, { RawMenuItem } from "@/components/MegaMenu";
import CartIcon from "@/components/CartIcon";
import { CartProvider } from "@/lib/cartContext";

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
        <CartProvider>
          <header className="sticky top-0 z-50 h-16 border-b border-black/5 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
              <a href="/" className="text-lg font-semibold tracking-tight">
                rukhsolutions
              </a>

              <MegaMenu items={menu} />

              <CartIcon />
            </div>
          </header>
          <main>{children}</main>
          <footer className="mt-24 border-t border-black/5 py-10 text-center text-sm text-black/50">
            © {new Date().getFullYear()} rukhsolutions.com
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
