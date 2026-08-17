"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  AlertTriangle,
  Filter,
  Eye,
  Compass,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Earthquake {
  id: string;
  mag: number;
  place: string;
  time: number;
  url: string;
  tsunami: number;
  lng: number;
  lat: number;
  depth: number;
}

export default function EarthquakesDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [minMagnitude, setMinMagnitude] = useState<number>(0);
  const [tsunamiOnly, setTsunamiOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    "time-desc" | "time-asc" | "mag-desc" | "mag-asc"
  >("time-desc");
  const [selectedEqId, setSelectedEqId] = useState<string | null>(null);

  const { data, mutate, isValidating } = useSWR(
    "/api/data/earthquakes",
    fetcher,
    {
      refreshInterval: 60000, // refresh every minute
    },
  );

  const earthquakes: Earthquake[] = useMemo(() => {
    return data?.data?.earthquakes || [];
  }, [data]);

  // Filter and Sort data
  const filteredEarthquakes = useMemo(() => {
    return earthquakes
      .filter((eq) => {
        const matchesSearch = eq.place
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesMag = eq.mag >= minMagnitude;
        const matchesTsunami = !tsunamiOnly || eq.tsunami === 1;
        return matchesSearch && matchesMag && matchesTsunami;
      })
      .sort((a, b) => {
        if (sortBy === "time-desc") return b.time - a.time;
        if (sortBy === "time-asc") return a.time - b.time;
        if (sortBy === "mag-desc") return b.mag - a.mag;
        if (sortBy === "mag-asc") return a.mag - b.mag;
        return 0;
      });
  }, [earthquakes, searchQuery, minMagnitude, tsunamiOnly, sortBy]);

  const selectedEq = useMemo(() => {
    return earthquakes.find((eq) => eq.id === selectedEqId) || null;
  }, [earthquakes, selectedEqId]);

  // SVG Map Projection Helper coordinates mapping
  // Map dimensions
  const mapWidth = 500;
  const mapHeight = 250;

  const getCoordinates = (lat: number, lng: number) => {
    // Equirectangular projection mapping
    const x = ((lng + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

  const getMagColor = (mag: number) => {
    if (mag >= 6.0) return "fill-purple-500 stroke-purple-400";
    if (mag >= 4.5) return "fill-red-500 stroke-red-400";
    if (mag >= 3.0) return "fill-amber-500 stroke-amber-400";
    return "fill-yellow-500 stroke-yellow-400";
  };

  const getMagBadgeVariant = (mag: number) => {
    if (mag >= 5.0) return "destructive";
    return "secondary";
  };

  return (
    <div className="mx-auto space-y-8 text-rose-300">
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
        <span className="text-slate-300 font-medium">Earthquakes</span>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-950/40 to-slate-950 p-6 md:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/50 text-2xl shadow-inner animate-pulse">
                🌋
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-rose-50 bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
                    Global Seismic Activity
                  </h1>
                  <Badge
                    variant="destructive"
                    className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border-rose-500/30 text-[10px] animate-pulse"
                  >
                    REAL-TIME
                  </Badge>
                </div>
                <p className="text-rose-500/70 text-sm mt-0.5">
                  Live data feed of M2.5+ earthquakes in the last 24 hours
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
              className="border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-300 transition"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${isValidating ? "animate-spin" : ""}`}
              />
              Refresh Feed
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Map & Filter Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* High-tech Interactive SVG Map */}
          <Card className="border-rose-500/20 bg-slate-950/60 overflow-hidden shadow-inner">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-2">
                <Compass className="h-4 w-4 text-rose-500" />
                Seismic Radar Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-4 bg-slate-950/80">
              <div className="relative w-full max-w-[500px]">
                <svg
                  viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                  className="w-full h-auto bg-slate-950 border border-slate-900 rounded-md"
                >
                  {/* Grid Lines */}
                  <g
                    className="stroke-slate-900/60 stroke-[0.5]"
                    strokeDasharray="3 3"
                  >
                    {/* Longitude Lines */}
                    {[-120, -60, 0, 60, 120].map((lng) => {
                      const pos = getCoordinates(0, lng);
                      return (
                        <line
                          key={lng}
                          x1={pos.x}
                          y1={0}
                          x2={pos.x}
                          y2={mapHeight}
                        />
                      );
                    })}
                    {/* Latitude Lines */}
                    {[-60, -30, 0, 30, 60].map((lat) => {
                      const pos = getCoordinates(lat, 0);
                      return (
                        <line
                          key={lat}
                          x1={0}
                          y1={pos.y}
                          x2={mapWidth}
                          y2={pos.y}
                        />
                      );
                    })}
                  </g>

                  {/* Clean Continent Text Indicators */}
                  <g className="fill-slate-800 text-[8px] font-mono select-none">
                    <text x="75" y="100">
                      NORTH AMERICA
                    </text>
                    <text x="140" y="180">
                      SOUTH AMERICA
                    </text>
                    <text x="280" y="80">
                      EURASIA
                    </text>
                    <text x="260" y="150">
                      AFRICA
                    </text>
                    <text x="400" y="195">
                      AUSTRALIA
                    </text>
                  </g>

                  {/* Seismic Dots */}
                  {filteredEarthquakes.map((eq) => {
                    const { x, y } = getCoordinates(eq.lat, eq.lng);
                    const isSelected = selectedEqId === eq.id;
                    const r = Math.max(3, eq.mag * 1.5);
                    return (
                      <g
                        key={eq.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedEqId(eq.id)}
                      >
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? r + 3 : r}
                          className={`${getMagColor(eq.mag)} opacity-70 transition-all hover:opacity-100 ${
                            isSelected
                              ? "stroke-2 stroke-white scale-110"
                              : "stroke-1"
                          }`}
                        />
                        {/* Optional pulsing outer ring for severe earthquakes */}
                        {eq.mag >= 5.0 && (
                          <circle
                            cx={x}
                            cy={y}
                            r={r + 8}
                            className="fill-none stroke-red-500/35 stroke-[0.5] animate-ping"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-mono text-slate-500 bg-slate-950/80 px-2 py-1 rounded border border-slate-900">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />{" "}
                    M&lt;3.0
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{" "}
                    M3.0-4.5
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />{" "}
                    M4.5-6.0
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />{" "}
                    M6.0+
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filtering and Search Controls */}
          <Card className="border-rose-500/20 bg-slate-950/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-300 text-sm font-mono flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search by location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus-visible:ring-rose-500/50"
                  />
                </div>

                {/* Magnitude Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
                    Min Magnitude:
                  </span>
                  <select
                    value={minMagnitude}
                    onChange={(e) =>
                      setMinMagnitude(parseFloat(e.target.value))
                    }
                    className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded p-2 w-full focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="0">All magnitudes</option>
                    <option value="3.0">M3.0+</option>
                    <option value="4.0">M4.0+</option>
                    <option value="5.0">M5.0+</option>
                    <option value="6.0">M6.0+</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                {/* Tsunami Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-mono text-slate-400">
                  <input
                    type="checkbox"
                    checked={tsunamiOnly}
                    onChange={(e) => setTsunamiOnly(e.target.checked)}
                    className="rounded border-slate-800 text-rose-600 bg-slate-950 focus:ring-rose-500 focus:ring-offset-slate-950"
                  />
                  Tsunami Warning Issued Only
                </label>

                {/* Sort Option */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded p-1.5 focus:ring-rose-500"
                  >
                    <option value="time-desc">Newest first</option>
                    <option value="time-asc">Oldest first</option>
                    <option value="mag-desc">Magnitude (High to Low)</option>
                    <option value="mag-asc">Magnitude (Low to High)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: List & Detailed Panel */}
        <div className="space-y-6">
          {/* Selected Item Detail Panel */}
          {selectedEq ? (
            <Card className="border-rose-500/30 bg-rose-950/10 shadow-lg">
              <CardHeader className="pb-2 border-b border-rose-500/20">
                <div className="flex justify-between items-start gap-2">
                  <Badge
                    variant={getMagBadgeVariant(selectedEq.mag)}
                    className="font-mono text-xs"
                  >
                    M {selectedEq.mag.toFixed(1)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-slate-200"
                    onClick={() => setSelectedEqId(null)}
                  >
                    ×
                  </Button>
                </div>
                <CardTitle className="text-slate-100 text-sm mt-2 font-mono leading-snug">
                  {selectedEq.place}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 font-mono text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-500">Time:</span>
                  <span>{new Date(selectedEq.time).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-500">Depth:</span>
                  <span>{selectedEq.depth.toFixed(1)} km</span>
                </div>
                <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-500">Coordinates:</span>
                  <span>
                    {selectedEq.lat.toFixed(3)}°, {selectedEq.lng.toFixed(3)}°
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Tsunami alert:</span>
                  <span>{selectedEq.tsunami ? "🚨 YES" : "NO"}</span>
                </div>
                <div className="pt-2">
                  <a
                    href={selectedEq.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center block text-xs font-semibold py-1.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition"
                  >
                    View USGS Event Page
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-800 bg-slate-950/20 border-dashed">
              <CardContent className="py-8 text-center text-xs text-slate-500 font-mono">
                Click a marker on the radar sweep to isolate seismic details
              </CardContent>
            </Card>
          )}

          {/* List panel */}
          <Card className="border-rose-500/20 bg-slate-950/40">
            <CardHeader className="pb-2 border-b border-slate-900">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-rose-400 font-mono flex items-center justify-between">
                <span>Recent Events</span>
                <Badge
                  variant="outline"
                  className="border-rose-500/20 text-[10px] text-rose-400 bg-rose-950/15"
                >
                  {filteredEarthquakes.length} / {earthquakes.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[300px] divide-y divide-slate-900">
              {filteredEarthquakes.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 font-mono">
                  No records match parameters
                </div>
              ) : (
                filteredEarthquakes.map((eq) => (
                  <div
                    key={eq.id}
                    onClick={() => setSelectedEqId(eq.id)}
                    className={`p-3 text-left transition cursor-pointer flex items-center gap-3 ${
                      selectedEqId === eq.id
                        ? "bg-rose-950/15"
                        : "hover:bg-slate-900/30"
                    }`}
                  >
                    <Badge
                      variant={getMagBadgeVariant(eq.mag)}
                      className="w-10 text-center shrink-0 font-mono text-[10px]"
                    >
                      {eq.mag.toFixed(1)}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-slate-200 truncate font-semibold">
                        {eq.place}
                      </div>
                      <div className="text-[9px] text-slate-500 mt-0.5">
                        {new Date(eq.time).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
