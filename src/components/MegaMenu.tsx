"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface RawMenuItem {
  id: string;
  databaseId: number;
  parentDatabaseId: number;
  label: string;
  uri?: string | null;
  url: string;
  target?: string | null;
}

export interface MenuNode extends RawMenuItem {
  children: MenuNode[];
}

function buildTree(items: RawMenuItem[]): MenuNode[] {
  const byId = new Map<number, MenuNode>();
  items.forEach((item) => byId.set(item.databaseId, { ...item, children: [] }));
  const roots: MenuNode[] = [];
  byId.forEach((node) => {
    if (node.parentDatabaseId && byId.has(node.parentDatabaseId)) {
      byId.get(node.parentDatabaseId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function toHref(item: RawMenuItem) {
  if (item.uri) return item.uri;
  try {
    const u = new URL(item.url);
    return u.pathname + u.search;
  } catch {
    return item.url;
  }
}

const ICONS: Record<string, string> = {
  "website-audit-recommendations": "🔍",
  "wordpress-development": "🛠️",
  "microsoft-fabric-data-analytics-engagement": "📊",
  "wordpress-care-maintenance-plan": "🛡️",
  "rukh-content-tools-free-wordpress-plugin": "🎁",
};

function iconFor(href: string) {
  const slug = href.split("/").filter(Boolean).pop() || "";
  return ICONS[slug] || "✦";
}

function DesktopItem({ node }: { node: MenuNode }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  const hasChildren = node.children.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={hasChildren ? openNow : undefined}
      onMouseLeave={hasChildren ? closeSoon : undefined}
    >
      <Link
        href={toHref(node)}
        onClick={() => hasChildren && setOpen((o) => !o)}
        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-black/80 transition-colors"
        style={{ color: undefined }}
        onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--brand-purple)")}
        onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "")}
      >
        {node.label}
        {hasChildren ? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        ) : null}
      </Link>

      {hasChildren ? (
        <div
          className={`absolute left-1/2 top-full z-40 w-[min(90vw,44rem)] -translate-x-1/2 pt-3 transition-all duration-300 ${
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div
            className="grid grid-cols-2 gap-3 rounded-2xl border p-6 backdrop-blur-xl sm:grid-cols-4"
            style={{
              background: "rgba(255,255,255,0.98)",
              borderColor: "var(--card-border)",
              boxShadow: "var(--shadow-lift)",
            }}
          >
            {node.children.map((child) => {
              const href = toHref(child);
              return (
                <Link
                  key={child.id}
                  href={href}
                  className="group flex flex-col gap-2 rounded-xl p-3 transition-colors duration-200 hover:bg-black/[0.03]"
                >
                  <span className="text-2xl">{iconFor(href)}</span>
                  <span
                    className="text-sm font-semibold text-black/85 group-hover:text-[var(--brand-purple)]"
                  >
                    {child.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileItem({ node }: { node: MenuNode }) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children.length > 0;

  return (
    <div className="border-b border-black/[0.06] py-2">
      <div className="flex items-center justify-between">
        <Link href={toHref(node)} className="py-2 text-base font-medium">
          {node.label}
        </Link>
        {hasChildren ? (
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle submenu"
            className="p-2"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 10 10"
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            >
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        ) : null}
      </div>
      {hasChildren ? (
        <div
          className={`grid overflow-hidden transition-all duration-300 ${
            open ? "grid-rows-[1fr] pb-2 opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="flex min-h-0 flex-col gap-1 pl-4">
            {node.children.map((child) => (
              <Link
                key={child.id}
                href={toHref(child)}
                className="py-1.5 text-sm text-black/70"
              >
                {iconFor(toHref(child))} {child.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function MegaMenu({ items }: { items: RawMenuItem[] }) {
  const tree = buildTree(items);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className="hidden items-center md:flex">
        {tree.map((node) => (
          <DesktopItem key={node.id} node={node} />
        ))}
      </nav>

      <button
        className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
        aria-label="Toggle menu"
        onClick={() => setMobileOpen((o) => !o)}
      >
        <span className="relative block h-4 w-5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 bg-black transition-all duration-300 ${
              mobileOpen ? "top-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 h-0.5 w-5 bg-black transition-all duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-3 h-0.5 w-5 bg-black transition-all duration-300 ${
              mobileOpen ? "top-1.5 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`fixed inset-x-0 top-[64px] z-40 origin-top overflow-y-auto bg-white/98 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileOpen
            ? "max-h-[calc(100vh-64px)] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4">
          {tree.map((node) => (
            <MobileItem key={node.id} node={node} />
          ))}
        </div>
      </div>
    </>
  );
}
