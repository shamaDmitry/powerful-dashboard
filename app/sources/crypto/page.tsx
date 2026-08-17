"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Activity,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CryptoDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "telemetry" | "logs">(
    "overview",
  );

  const { data, isValidating } = useSWR("/api/data/binance-btc", fetcher, {
    refreshInterval: 5000,
  });

  const price = data?.data?.price ? parseFloat(data.data.price) : null;
  const isFromCache = data?.fromCache;
  const isStale = data?.stale;

  return (
    <div className="mx-auto space-y-8 theme-crypto text-emerald-300">
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
        <span className="text-slate-300 font-medium">Binance BTC</span>
      </div>

      {/* Hero Header with Crypto Theme */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 to-slate-950 p-6 md:p-8 shadow-lg shadow-emerald-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/50 text-2xl shadow-inner animate-pulse">
                💎
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-emerald-50 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Binance BTC Tracker
                  </h1>

                  <Badge
                    variant="destructive"
                    className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30 text-[10px] animate-pulse"
                  >
                    LIVE
                  </Badge>
                </div>

                <p className="text-emerald-500/70 text-sm">
                  Real-time market analytics and API payload health
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5">
            <div className="text-xs text-emerald-500/60 uppercase font-mono tracking-wider">
              Current price
            </div>

            <div className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">
              {price
                ? `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                : "Connecting..."}
            </div>

            <div className="flex items-center gap-2 mt-1">
              {isFromCache && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 text-[9px] bg-emerald-950/20"
                >
                  Cached
                </Badge>
              )}

              {isStale && (
                <Badge
                  variant="outline"
                  className="border-yellow-500/30 text-yellow-400 text-[9px] bg-yellow-950/20"
                >
                  Stale
                </Badge>
              )}

              {isValidating && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              )}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-sm font-medium font-mono border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-4 py-2.5 text-sm font-medium font-mono border-b-2 transition-all ${
            activeTab === "telemetry"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          API Telemetry
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2.5 text-sm font-medium font-mono border-b-2 transition-all ${
            activeTab === "logs"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Transaction Logs
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-500/20 bg-slate-950/60 shadow-inner">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-500/80 font-mono">
                Market Cap
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100 font-mono">
                $1.34T
              </div>
              <p className="text-xs text-emerald-500/60 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                +2.4% in 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20 bg-slate-950/60 shadow-inner">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-500/80 font-mono">
                Active Traders
              </CardTitle>
              <Activity className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100 font-mono">
                1.2M+
              </div>
              <p className="text-xs text-emerald-500/60 mt-1 font-mono">
                Binance exchange stream status: OK
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20 bg-slate-950/60 shadow-inner">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-500/80 font-mono">
                24h Vol (BTC)
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100 font-mono">
                382.4K
              </div>
              <p className="text-xs text-emerald-500/60 mt-1 font-mono">
                Last checked:{" "}
                {new Date(
                  data?.data?.timestamp || Date.now(),
                ).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 border-emerald-500/20 bg-slate-950/40">
            <CardHeader>
              <CardTitle className="text-emerald-400 font-mono">
                Bitcoin Telemetry Insights
              </CardTitle>

              <CardDescription className="text-slate-900">
                Live trading overview. Refresh rates are handled on both client
                SWR polling and server in-memory caching.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 font-mono text-sm text-slate-300">
              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <div className="text-emerald-400 font-bold">
                  💡 Dynamic Theme Injection
                </div>

                <p className="text-slate-900 text-sm">
                  This page runs a custom neon-emerald color palette tailored to
                  cryptocurrency data feeds. The layout, metrics widgets, and
                  tables are fully responsive.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "telemetry" && (
        <Card className="border-emerald-500/20 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-emerald-400 font-mono flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-500" />
              Raw API Payload Response
            </CardTitle>

            <CardDescription className="text-slate-900">
              Response from server-side cache at{" "}
              <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300">
                /api/data/binance-btc
              </code>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono overflow-auto max-h-[300px]">
              {JSON.stringify(data || { loading: true }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {activeTab === "logs" && (
        <Card className="border-emerald-500/20 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-emerald-400 font-mono">
              Simulated Order Logs
            </CardTitle>
            <CardDescription className="text-slate-900">
              Live market order events received from stream.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between p-2 rounded bg-emerald-950/10 border-l-2 border-emerald-500">
                <span className="text-emerald-400">[ORDER]</span>
                <span className="text-slate-300">
                  BUY 0.42 BTC @ ${price ? price.toFixed(2) : "63,000.00"}
                </span>
                <span className="text-slate-500">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-emerald-950/10 border-l-2 border-emerald-500">
                <span className="text-emerald-400">[ORDER]</span>
                <span className="text-slate-300">
                  BUY 1.05 BTC @ $
                  {price ? (price - 2.5).toFixed(2) : "62,997.50"}
                </span>
                <span className="text-slate-500">
                  {new Date(Date.now() - 2000).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-red-950/10 border-l-2 border-red-500">
                <span className="text-red-400">[ORDER]</span>
                <span className="text-slate-300">
                  SELL 0.18 BTC @ $
                  {price ? (price + 4.1).toFixed(2) : "63,004.10"}
                </span>
                <span className="text-slate-500">
                  {new Date(Date.now() - 5000).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
