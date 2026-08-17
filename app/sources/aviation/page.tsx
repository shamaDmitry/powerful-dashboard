"use client";

import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Compass, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AviationDashboard() {
  const { data, isValidating } = useSWR("/api/data/opensky-limited", fetcher, {
    refreshInterval: 60000, // OpenSky is heavily rate-limited, poll every 60s
  });

  const totalPlanes = data?.data?.totalPlanes;
  const isFromCache = data?.fromCache;

  return (
    <div className="mx-auto space-y-8 theme-aviation text-slate-300">
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
        <span className="text-slate-300 font-medium">OpenSky Network</span>
      </div>

      {/* Hero Header with Aviation Slate Theme */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900 to-zinc-950 p-6 md:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-2xl shadow-inner">
                ✈️
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
                    OpenSky Flight Telemetry
                  </h1>
                  <Badge
                    variant="secondary"
                    className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]"
                  >
                    AIRSPACE
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">
                  Global live aircraft tracking receiver
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5">
            <div className="text-xs text-slate-500 uppercase font-mono tracking-wider">
              Aircraft in airspace
            </div>
            <div className="text-3xl font-bold font-mono text-slate-100 tracking-tight">
              {totalPlanes !== undefined
                ? totalPlanes.toLocaleString()
                : "Receiving signal..."}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isFromCache && (
                <Badge
                  variant="outline"
                  className="border-slate-800 text-slate-400 text-[9px] bg-slate-900/45"
                >
                  Cache Serving
                </Badge>
              )}
              {isValidating && (
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-ping inline-block" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Aviation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-950/60 shadow-inner">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 font-mono">
              Radar Status
            </CardTitle>
            <Compass className="h-4 w-4 text-slate-400 animate-spin-slow" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-100 font-mono">
              SWEEPING
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Receiver range: Global
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/60 shadow-inner">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 font-mono">
              Signal Latency
            </CardTitle>
            <Navigation className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-100 font-mono">
              ~3.2s
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Station link: Healthy
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/60 shadow-inner">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 font-mono">
              Rate Limiting
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-100 font-mono">
              10 req/hr
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Prevents IP blacklisting
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-slate-800 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-slate-200 font-mono">
              Radar Signal Raw Payload
            </CardTitle>
            <CardDescription className="text-slate-400">
              Raw aircraft counters from OpenSky receiver API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 font-mono text-sm text-slate-300">
            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 overflow-auto max-h-[200px]">
              {JSON.stringify(data || { loading: true }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
