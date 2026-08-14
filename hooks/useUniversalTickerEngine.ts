import { useEffect } from "react";
import useSWR from "swr";
import { useTickerStore } from "@/store/useTickerStore";
import { TickerMessage } from "@/types/ticker";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUniversalTickerEngine(intervalMs = 15000) {
  const setMessages = useTickerStore((state) => state.setMessages);

  const { data, error, isLoading } = useSWR<{ messages: TickerMessage[] }>(
    "/api/ticker",
    fetcher,
    {
      refreshInterval: intervalMs,
      revalidateOnFocus: true,
    },
  );

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data, setMessages]);

  return { messages: data?.messages, error, isLoading };
}

