"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft, Wind, Sun, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WeatherDashboard() {
  const [unit, setUnit] = useState<"C" | "F">("C");

  const { data, isValidating } = useSWR("/api/data/open-meteo", fetcher, {
    refreshInterval: 15000,
  });

  const tempCelsius = data?.data?.temperature;
  const tempFahrenheit =
    tempCelsius !== undefined ? (tempCelsius * 9) / 5 + 32 : null;
  const displayedTemp = unit === "C" ? tempCelsius : tempFahrenheit;

  return (
    <div className="mx-auto space-y-8 theme-weather text-sky-300">
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
        <span className="text-slate-300 font-medium">Open Meteo Weather</span>
      </div>

      {/* Hero Header with Sky Blue Theme */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-950/40 to-slate-950 p-6 md:p-8 shadow-lg shadow-sky-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-950/50 text-2xl shadow-inner">
                🌡️
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-sky-50 bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                    Open Meteo Weather Station
                  </h1>
                  <Badge
                    variant="outline"
                    className="border-sky-500/30 text-sky-400 text-[10px] bg-sky-950/20"
                  >
                    STABLE
                  </Badge>
                </div>
                <p className="text-sky-500/70 text-sm">
                  Kyiv meteorological live telemetry feed
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5">
            <div className="text-xs text-sky-500/60 uppercase font-mono tracking-wider">
              Current Temperature
            </div>
            <div className="text-3xl font-bold font-mono text-sky-400 tracking-tight flex items-baseline gap-1">
              {displayedTemp !== undefined && displayedTemp !== null
                ? `${displayedTemp.toFixed(1)}°${unit}`
                : "Loading..."}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => setUnit("C")}
                className={`text-[10px] px-2 py-0.5 rounded border font-mono transition ${
                  unit === "C"
                    ? "bg-sky-500/20 border-sky-400 text-sky-300"
                    : "border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                Celsius
              </button>
              <button
                onClick={() => setUnit("F")}
                className={`text-[10px] px-2 py-0.5 rounded border font-mono transition ${
                  unit === "F"
                    ? "bg-sky-500/20 border-sky-400 text-sky-300"
                    : "border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                Fahrenheit
              </button>
              {isValidating && (
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping inline-block" />
              )}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
      </div>

      {/* Weather Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-sky-500/20 bg-slate-950/60 shadow-inner">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sky-500/80 font-mono">
              Location
            </CardTitle>
            <Sun className="h-4 w-4 text-sky-400 animate-spin-slow" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-100 font-mono">
              Kyiv, Ukraine
            </div>
            <p className="text-xs text-sky-500/60 mt-1 font-mono">
              Lat: 50.45° | Lon: 30.52°
            </p>
          </CardContent>
        </Card>

        <Card className="border-sky-500/20 bg-slate-950/60 shadow-inner">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sky-500/80 font-mono">
              Wind Speed
            </CardTitle>
            <Wind className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-100 font-mono">
              12.5 km/h
            </div>
            <p className="text-xs text-sky-500/60 mt-1 font-mono">
              Direction: North-West
            </p>
          </CardContent>
        </Card>

        <Card className="border-sky-500/20 bg-slate-950/60 shadow-inner">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sky-500/80 font-mono">
              Telemetry Source
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-100 font-mono">
              Open-Meteo API
            </div>
            <p className="text-xs text-sky-500/60 mt-1 font-mono">
              TTL Cache:{" "}
              {data?.fromCache ? "Active (Cached)" : "Refreshed live"}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-sky-500/20 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-sky-400 font-mono">
              Meteorology Telemetry Insights
            </CardTitle>
            <CardDescription className="text-slate-400">
              Weather measurements are fetched directly from the Open-Meteo free
              forecast API and cached on our server middleware.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 font-mono text-sm text-slate-300">
            <div className="p-4 rounded-lg bg-sky-950/20 border border-sky-500/20 space-y-2">
              <div className="text-sky-400 font-bold">
                💡 Dynamic Theme Injection
              </div>
              <p className="text-slate-400 text-xs">
                This page implements a sky-blue themed UI template designed for
                weather instrumentation widgets.
              </p>
            </div>
            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-sky-400 overflow-auto max-h-[200px]">
              {JSON.stringify(data || { loading: true }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
