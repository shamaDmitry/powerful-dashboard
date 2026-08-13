import { useEffect } from "react";
import { useTickerStore } from "@/store/useTickerStore";
import { TICKER_SOURCES } from "@/config/tickerSources";

export function useUniversalTickerEngine() {
  const addMessage = useTickerStore((state) => state.addMessage);

  useEffect(() => {
    const cleanupFns: Array<() => void> = [];

    TICKER_SOURCES.forEach((source) => {
      if (source.type === "rest") {
        const fetchData = async () => {
          try {
            const res = await fetch(source.url);

            if (!res.ok) return;

            const data = await res.json();
            const text = source.parseResponse(data);

            if (text) {
              addMessage({
                category: source.category,
                icon: source.icon,
                text,
              });
            }
          } catch (err) {
            console.warn(
              `[Ticker Engine] Error fetching REST source ${source.id}:`,
              err,
            );
          }
        };

        fetchData();

        const intervalId = setInterval(fetchData, source.intervalMs);

        cleanupFns.push(() => clearInterval(intervalId));
      }

      if (source.type === "websocket") {
        let ws: WebSocket | null = null;
        let lastExecution = 0;

        try {
          ws = new WebSocket(source.url);

          ws.onmessage = (event) => {
            const now = Date.now();

            // Trottle
            if (now - lastExecution < source.throttleMs) return;

            try {
              const data = JSON.parse(event.data);
              const text = source.parseMessage(data);

              if (text) {
                addMessage({
                  category: source.category,
                  icon: source.icon,
                  text,
                });
                lastExecution = now;
              }
            } catch {}
          };
        } catch (err) {
          console.warn(
            `[Ticker Engine] Failed to establish WS for ${source.id}:`,
            err,
          );
        }

        cleanupFns.push(() => {
          if (!ws) return;

          ws.onmessage = null;
          ws.onerror = null;

          if (ws.readyState === WebSocket.CONNECTING) {
            ws.onopen = () => {
              ws.close();
            };
          } else if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        });
      }
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [addMessage]);
}
