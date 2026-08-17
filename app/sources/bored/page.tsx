"use client";

import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Smile, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BoredDashboard() {
  const { data, mutate, isValidating } = useSWR(
    "/api/data/bored-api",
    fetcher,
    {
      revalidateOnFocus: true,
    },
  );

  const activity = data?.data?.activity;

  return (
    <div className="mx-auto space-y-8 theme-bored text-orange-300">
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
        <span className="text-slate-300 font-medium">Bored API</span>
      </div>

      {/* Hero Header with Playful Orange Theme */}
      <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-950/40 to-slate-950 p-6 md:p-8 shadow-lg shadow-orange-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-950/50 text-2xl shadow-inner">
                🎲
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-orange-50 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Boredom Buster
                  </h1>
                  <Badge
                    variant="outline"
                    className="border-orange-500/30 text-orange-400 text-[10px] bg-orange-950/20"
                  >
                    PLAY
                  </Badge>
                </div>
                <p className="text-orange-500/70 text-sm">
                  Generating random interesting activities
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
              className="border-orange-500/30 hover:bg-orange-500/20 hover:text-orange-300 transition"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${isValidating ? "animate-spin" : ""}`}
              />
              New Idea
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
      </div>

      {/* Activity Display Card */}
      <Card className="border-orange-500/20 bg-slate-950/40 relative overflow-hidden">
        <CardContent className="pt-8 pb-10 px-6 md:px-12 text-center space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Suggested Activity
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 font-mono">
            {activity ? `"${activity}"` : "Finding fun things to do..."}
          </h2>
        </CardContent>
      </Card>

      {/* Activity parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-orange-500/20 bg-slate-950/30 font-mono text-xs">
          <CardHeader>
            <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
              <Compass className="h-4 w-4" />
              Activity Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-400">
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span>Category:</span>
              <span className="text-slate-300">Recreation</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span>Accessibility:</span>
              <span className="text-slate-300">High</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>Type:</span>
              <span className="text-slate-300">
                Single-player / Multi-player
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-slate-950/30 font-mono text-xs">
          <CardHeader>
            <CardTitle className="text-orange-400 text-sm flex items-center gap-2">
              <Smile className="h-4 w-4" />
              Motivation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 leading-relaxed">
            Taking regular breaks and engaging in new activities boosts focus,
            decreases fatigue, and increases mental agility. Have fun trying the
            bust!
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
