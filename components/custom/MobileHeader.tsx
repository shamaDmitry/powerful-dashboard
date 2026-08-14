"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/custom/SidebarNav";
import { Separator } from "@/components/ui/separator";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-14 py-4 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <button
              aria-label="Open navigation"
              className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            />
          }
        >
          <Menu className="h-4.5 w-4.5" />
        </SheetTrigger>

        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetHeader className="px-4 pt-5 pb-3 border-b border-border">
            <SheetTitle>
              <Link
                href="/"
                className="flex items-center gap-2.5"
                onClick={() => setOpen(false)}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Zap className="h-4 w-4" />
                </span>
                <span className="font-bold text-base tracking-tight">
                  DataPulse
                </span>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Separator orientation="vertical" className="h-5" />

      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Zap className="size-4" />
        </span>

        <span className="font-bold text-base tracking-tight">DataPulse</span>
      </Link>
    </header>
  );
}
