"use client";

import Link from "next/link";
import { useCart } from "@/lib/cartContext";

export default function CartIcon() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-colors hover:border-[var(--brand-gold-deep)]"
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
      {count > 0 ? (
        <span
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-[#111111] transition-transform duration-300"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-deep) 100%)",
            boxShadow: "0 2px 6px -1px color-mix(in srgb, var(--brand-gold) 70%, transparent)",
          }}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
