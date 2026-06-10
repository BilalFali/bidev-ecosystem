"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Image as ImageIcon,
  Tag, FolderOpen, Settings, LogOut, ChevronRight, BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { label: "Overview",   href: "/",            icon: LayoutDashboard },
  { label: "Articles",   href: "/articles",    icon: FileText        },
  { label: "Analytics",  href: "/analytics",   icon: BarChart2       },
  { label: "Media",      href: "/media",       icon: ImageIcon       },
  { label: "Categories", href: "/categories",  icon: FolderOpen      },
  { label: "Tags",       href: "/tags",        icon: Tag             },
  { label: "Settings",   href: "/settings",    icon: Settings        },
];

interface SidebarProps { email?: string | null }

export function Sidebar({ email }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-[220px] flex flex-col bg-bg-secondary border-r border-border">
      {/* Logo */}
      <div className="px-5 h-14 flex items-center border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <span className="text-accent font-bold text-sm">b</span>
          </span>
          <span className="text-sm font-bold text-ink">
            bi<span className="text-accent">dev</span> admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
              isActive(item.href)
                ? "bg-accent/10 text-accent"
                : "text-ink-muted hover:text-ink hover:bg-bg-elevated"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {isActive(item.href) && <ChevronRight className="w-3 h-3" />}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <span className="text-accent text-xs font-bold uppercase">
              {email?.charAt(0) ?? "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink truncate">{email ?? "Admin"}</p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="p-1.5 rounded-md hover:bg-bg-elevated text-ink-muted hover:text-ink transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
