import { create } from "zustand";
import { TickerMessage } from "@/types/ticker";
import { v4 as uuidv4 } from "uuid";

interface TickerState {
  messages: TickerMessage[];
  addMessage: (msg: Omit<TickerMessage, "id" | "timestamp">) => void;
  setMessages: (messages: TickerMessage[]) => void;
}

export const useTickerStore = create<TickerState>((set) => ({
  messages: [],
  addMessage: (msg) => {
    return set((state) => {
      const newMessage: TickerMessage = {
        ...msg,
        id: uuidv4(),
        timestamp: Date.now(),
      };

      const updated = [newMessage, ...state.messages].slice(0, 20);

      return { messages: updated };
    });
  },
  setMessages: (newMessages) => {
    if (!newMessages || newMessages.length === 0) return;
    return set({ messages: newMessages });
  },
}));
