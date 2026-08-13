"use client";

import React from "react";
import { useTickerStore } from "@/store/useTickerStore";
import { useUniversalTickerEngine } from "@/hooks/useUniversalTickerEngine";

export const Ticker: React.FC = () => {
  useUniversalTickerEngine();

  const messages = useTickerStore((state) => state.messages);

  return (
    <div className="bg-slate-950 text-slate-200 h-10 select-none font-mono text-sm flex items-center mb-5">
      <div className="container px-4 flex items-center overflow-hidden">
        <div className="z-10 bg-rose-600 text-white font-bold px-3 py-1 flex items-center gap-1.5 shrink-0 shadow-md">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          LIVE PULSE
        </div>

        <div className="relative overflow-hidden w-full flex items-center">
          <div className="animate-ticker flex items-center whitespace-nowrap">
            {[...messages, ...messages].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex flex-1 items-center gap-2 px-6 border-r border-slate-800/60"
              >
                <span className="text-base">{item.icon}</span>

                <span className="text-slate-300">{item.text}</span>

                <span
                  suppressHydrationWarning
                  className="text-xs text-slate-500 ml-1"
                >
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
