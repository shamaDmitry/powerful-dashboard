import Link from "next/link";
import { Zap } from "lucide-react";
import { SidebarNav } from "@/components/custom/SidebarNav";
import { Separator } from "@/components/ui/separator";

export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-sidebar h-full sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Zap className="h-4 w-4" />
          </span>
          <span className="font-bold text-base tracking-tight text-sidebar-foreground">
            DataPulse
          </span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 px-2 py-4 overflow-y-auto">
        <SidebarNav />
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border shrink-0">
        <p className="text-sm text-muted-foreground/50 leading-relaxed">
          Live data from public APIs.
          <br />
          Refreshes automatically.
        </p>
      </div>
    </aside>
  );
}
