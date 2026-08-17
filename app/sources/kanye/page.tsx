"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft, Quote, Sparkles, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function KanyeDashboard() {
  const { data, error, mutate, isValidating } = useSWR(
    "/api/data/kanye-quotes",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const quote = data?.data?.quote;

  return (
    <div className="mx-auto space-y-8 theme-kanye text-fuchsia-300">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-300 font-medium">Kanye Quotes</span>
      </div>

      {/* Hero Header with Kanye Purple/Fuchsia Theme */}
      <div className="relative overflow-hidden rounded-2xl border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-950/40 to-slate-950 p-6 md:p-8 shadow-lg shadow-fuchsia-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-fuchsia-500/30 bg-fuchsia-950/50 text-2xl shadow-inner">
                🎤
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-fuchsia-50 bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                    Kanye West Wisdom Generator
                  </h1>
                  <Badge
                    variant="outline"
                    className="border-fuchsia-500/30 text-fuchsia-400 text-[10px] bg-fuchsia-950/20"
                  >
                    CULT
                  </Badge>
                </div>
                <p className="text-fuchsia-500/70 text-sm">
                  Aggregating profound quotes from api.kanye.rest
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => mutate()}
              disabled={isValidating}
              className="border-fuchsia-500/30 hover:bg-fuchsia-500/20 hover:text-fuchsia-300 transition"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${isValidating ? "animate-spin" : ""}`}
              />
              Get More Wisdom
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
      </div>

      {/* Quote Display Card */}
      <Card className="border-fuchsia-500/20 bg-slate-950/40 relative overflow-hidden">
        <CardContent className="pt-8 pb-10 px-6 md:px-12 text-center space-y-6">
          <Quote className="h-10 w-10 text-fuchsia-500/40 mx-auto" />
          <blockquote className="text-xl md:text-2xl font-semibold tracking-tight text-slate-100 italic leading-relaxed">
            {quote ? `"${quote}"` : "Ye is thinking..."}
          </blockquote>
          <cite className="block text-xs font-mono uppercase tracking-wider text-fuchsia-400 font-bold">
            — Kanye West
          </cite>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-fuchsia-500/20 bg-slate-950/30">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-fuchsia-500/80 font-mono flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-fuchsia-400" />
              Philosophy Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400 leading-relaxed font-mono">
            Every quote is fetched asynchronously from the REST endpoint. Server
            TTL caches quotes for 45 seconds to manage load, but manual
            client-side mutation bypasses cached values if stale.
          </CardContent>
        </Card>

        <Card className="border-fuchsia-500/20 bg-slate-950/30">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-fuchsia-500/80 font-mono">
              Raw API Response
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs font-mono text-fuchsia-400 overflow-auto max-h-[120px] p-2 bg-slate-950/80 rounded border border-slate-800">
            {JSON.stringify(data || { loading: true }, null, 2)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
