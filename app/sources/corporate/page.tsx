"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CorporateDashboard() {
  const { data, mutate, isValidating } = useSWR(
    "/api/data/corporate-bs",
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const phrase = data?.data?.phrase;

  return (
    <div className="mx-auto space-y-8 theme-corporate text-slate-300">
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
        <span className="text-slate-300 font-medium">Corporate BS</span>
      </div>

      {/* Hero Header with Corporate Steel Blue Theme */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900 to-zinc-950 p-6 md:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-2xl shadow-inner">
                💼
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
                    Corporate BS Engine
                  </h1>
                  <Badge
                    variant="outline"
                    className="border-slate-700 text-slate-300 text-[10px] bg-slate-800/40"
                  >
                    ENTERPRISE
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">
                  Leveraging synergistic buzzwords for next-gen performance
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
              className="border-slate-700 hover:bg-slate-800 text-slate-300 transition"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${isValidating ? "animate-spin" : ""}`}
              />
              Synergize
            </Button>
          </div>
        </div>
      </div>

      {/* Phrase Display Card */}
      <Card className="border-slate-800 bg-slate-950/40 relative overflow-hidden">
        <CardContent className="pt-8 pb-10 px-6 md:px-12 text-center space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Synergy Statement
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 font-mono">
            {phrase ? `"${phrase}"` : "Generating buzzwords..."}
          </h2>
        </CardContent>
      </Card>

      {/* Strategy Table */}
      <Card className="border-slate-800 bg-slate-950/30 font-mono text-xs">
        <CardHeader>
          <CardTitle className="text-slate-300 text-sm flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            Enterprise Framework Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-slate-400">
          <div className="flex justify-between border-b border-slate-900 pb-2">
            <span>Protocol:</span>
            <span className="text-slate-300">REST API (generator)</span>
          </div>
          <div className="flex justify-between border-b border-slate-900 pb-2">
            <span>Synergy Window:</span>
            <span className="text-slate-300">Continuous Integration</span>
          </div>
          <div className="flex justify-between pb-1">
            <span>API Status:</span>
            <span className="text-emerald-400 font-bold">OPERATIONAL</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
