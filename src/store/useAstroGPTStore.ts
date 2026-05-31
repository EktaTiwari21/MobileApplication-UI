import { create } from "zustand";
import { AstrologyService } from "../services/api";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface AstroGPTState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, kundaliContext: any) => Promise<void>;
  clearChat: () => void;
}

export const useAstroGPTStore = create<AstroGPTState>((set, get) => ({
  messages: [
    {
      id: "welcome",
      sender: "bot",
      text: "Pranam! I am AstroGPT, your cosmic guide. Ask me anything about your career, relationships, or planetary remedies based on your birth chart.",
      timestamp: new Date(),
    },
  ],
  isLoading: false,
  error: null,

  sendMessage: async (text: string, kundaliContext: any) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isLoading: true,
      error: null,
    }));

    try {
      // Map message history formatted for the backend
      const history = get().messages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        text: m.text,
      }));

      const botReply = await AstrologyService.askAstroGPT(text, history, kundaliContext);

      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "bot",
        text: botReply,
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, botMsg],
        isLoading: false,
      }));
    } catch (err: any) {
      console.error("AstroGPT error:", err);
      set({
        error: "Cosmic channels are blocked. Please try again.",
        isLoading: false,
      });
    }
  },

  clearChat: () =>
    set({
      messages: [
        {
          id: "welcome",
          sender: "bot",
          text: "Pranam! I am AstroGPT, your cosmic guide. Ask me anything about your career, relationships, or planetary remedies based on your birth chart.",
          timestamp: new Date(),
        },
      ],
      error: null,
    }),
}));
