"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, Activity, Settings, Box } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Traces", href: "/", icon: List }, // Currently same as dashboard for now
  { name: "Settings", href: "#", icon: Settings, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card/50 text-card-foreground">
      {/* Logo Area */}
      <div className="flex h-14 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <Box className="h-5 w-5 text-emerald-500" />
          <span className="text-sm tracking-wide">XRAY</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors mb-0.5",
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  item.disabled && "pointer-events-none opacity-50"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-4 w-4 shrink-0",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer / User */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                <span className="text-xs font-medium text-muted-foreground">U</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">User</span>
                <span className="text-[10px] text-muted-foreground">admin@xray.io</span>
            </div>
        </div>
      </div>
    </div>
  );
}
