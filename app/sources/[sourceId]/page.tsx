import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ALL_NAV_ITEMS } from "@/config/nav";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ sourceId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sourceId } = await params;

  const item = ALL_NAV_ITEMS.find((n) => n.href === `/sources/${sourceId}`);

  if (!item) return {};

  return {
    title: item.label,
    description: item.description,
  };
}

export default async function SourcePage({ params }: Props) {
  const { sourceId } = await params;
  const item = ALL_NAV_ITEMS.find((n) => n.href === `/sources/${sourceId}`);

  if (!item) notFound();

  return (
    <div className="mx-auto space-y-8">
      {/* Back + breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{item.label}</span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-2xl">
            {item.icon}
          </span>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {item.label}
              </h1>
              {item.badge && (
                <Badge
                  variant={item.badgeVariant ?? "secondary"}
                  className="text-[10px]"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      <Separator />

      {/* Content placeholder — replace with real data per source */}
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-10 flex flex-col items-center justify-center gap-3 text-center min-h-[280px]">
        <span className="text-4xl">{item.icon}</span>
        <h2 className="font-semibold text-lg">{item.label}</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          This is the dedicated page for <strong>{item.label}</strong>. Add your
          data components, charts, and detail views here.
        </p>
        <code className="text-xs bg-muted px-2.5 py-1.5 rounded-md font-mono mt-1 text-muted-foreground">
          app/sources/{sourceId}/page.tsx
        </code>
      </div>
    </div>
  );
}
