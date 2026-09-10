"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, FolderOpen, Tag, LogOut, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-auth/browser";

const NAV = [
  { label: "Overview",   href: "/admin",             icon: LayoutDashboard },
  { label: "Articles",   href: "/admin/articles",    icon: FileText        },
  { label: "Categories", href: "/admin/categories",  icon: FolderOpen      },
  { label: "Tags",       href: "/admin/tags",        icon: Tag             },
];

export function Sidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-[220px] flex flex-col bg-paper-sunken border-r border-border">
      <div className="px-5 h-14 flex items-center border-b border-border shrink-0">
        <Link href="/admin" className="font-display text-base font-medium text-ink">
          BiDev <span className="text-accent">Tech</span> Admin
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href) ? "bg-accent-tint text-accent" : "text-ink-muted hover:text-ink hover:bg-paper-raised"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        ))}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink hover:bg-paper-raised transition-colors"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          View site
        </a>
      </nav>

      <div className="border-t border-border p-3 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink truncate">{email ?? "Admin"}</p>
          </div>
          <button onClick={handleSignOut} title="Sign out" className="p-1.5 hover:bg-paper-raised text-ink-muted hover:text-ink transition-colors">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
