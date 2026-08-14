"use client";

import React, { useSyncExternalStore } from "react";
import { useTickerStore } from "@/store/useTickerStore";
import { useUniversalTickerEngine } from "@/hooks/useUniversalTickerEngine";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export const Ticker: React.FC = () => {
  const isClient = useIsClient();
  const { isLoading } = useUniversalTickerEngine();
  const messages = useTickerStore((state) => state.messages);

  const showLoader = !isClient || (isLoading && messages.length === 0);

  // Repeat messages to ensure a seamless infinite loop without gaps
  const displayItems =
    messages.length > 0
      ? messages.length < 5
        ? [...messages, ...messages, ...messages, ...messages]
        : [...messages, ...messages]
      : [];

  // Calculate dynamic animation duration so scroll speed remains constant regardless of item count
  const totalChars = displayItems.reduce(
    (acc, item) => acc + (item.text?.length || 0) + 12,
    0,
  );
  const animationDuration = Math.max(15, Math.round(totalChars / 18));

  return (
    <div className="bg-slate-950 text-slate-200 h-10 select-none font-mono text-sm flex items-center mb-5 border-b border-slate-800/80 shadow-inner">
      <div className="px-4 flex items-center w-full overflow-hidden">
        <div className="z-10 bg-rose-600 text-white font-bold px-3 py-1 flex items-center gap-1.5 shrink-0 shadow-md rounded-sm tracking-wider text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          LIVE PULSE
        </div>

        {/* Stream Container */}
        <div className="relative overflow-hidden w-full flex items-center mx-4 ticker-mask h-8">
          {showLoader ? (
            <div className="flex items-center gap-3 text-slate-400 text-xs animate-pulse pl-4">
              <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin shrink-0" />

              <span className="tracking-wide">Initiation...</span>

              <div className="hidden sm:flex items-center gap-3 ml-2">
                <div className="h-3 w-28 bg-slate-800/80 rounded animate-shimmer" />
                <div className="h-3 w-36 bg-slate-800/80 rounded animate-shimmer" />
              </div>
            </div>
          ) : (
            <div
              className="animate-ticker flex items-center whitespace-nowrap transition-opacity duration-500 ease-out opacity-100"
              style={{ animationDuration: `${animationDuration}s` }}
            >
              {displayItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-flex items-center gap-2.5 px-6 border-r border-slate-800/60 hover:bg-slate-900/60 transition-colors py-1 cursor-default group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>

                  <span className="text-slate-300 group-hover:text-white transition-colors">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

