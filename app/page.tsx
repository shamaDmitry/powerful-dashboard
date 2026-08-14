import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ALL_NAV_ITEMS } from "@/config/nav";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="mx-auto space-y-12">
      {/* Hero */}
      <section className="pt-6 pb-2 space-y-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow">
            <Zap className="h-5 w-5" />
          </span>
          <h1 className="text-3xl font-bold tracking-tight">DataPulse</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A real-time dashboard aggregating live data from public APIs.
          Aviation, crypto, weather, and more — all in one place, refreshed
          automatically.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Badge variant="secondary" className="gap-1.5 text-sm h-7 px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            {ALL_NAV_ITEMS.length} live sources
          </Badge>

          <Badge variant="outline" className="gap-1.5 text-sm h-7 px-2.5">
            Auto-refreshes
          </Badge>

          <Badge variant="outline" className="gap-1.5 text-sm h-7 px-2.5">
            Server-cached
          </Badge>
        </div>
      </section>

      {/* API Cards Grid */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Available Sources
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-xl transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>

                {item.badge && (
                  <Badge
                    variant={item.badgeVariant ?? "secondary"}
                    className="text-xs px-1.5 py-0 shrink-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-base text-card-foreground group-hover:text-primary transition-colors">
                  {item.label}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                View source
                <ArrowRight className="h-3 w-3" />
              </div>

              {/* Subtle hover glow */}
              <span
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, oklch(0.496 0.265 301.924 / 0.05) 0%, transparent 70%)",
                }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-dashed border-border bg-muted/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-sm">Want more sources?</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add a new API in{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">
              server/config/sources.ts
            </code>
          </p>
        </div>
        <Link
          href="/sources/crypto"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground h-8"
        >
          Try crypto first <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </div>
  );
}
