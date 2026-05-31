import { create } from "zustand";
import { AstrologyService } from "../services/api";

export interface HoroscopeData {
  sign: string;
  period: "daily" | "weekly" | "monthly" | "annual";
  forecast: string;
  ratings: {
    love: number;
    career: number;
    wealth: number;
    health: number;
  };
  lucky_number: number;
  lucky_color: string;
  compatible_sign: string;
}

interface HoroscopeState {
  selectedSign: string;
  selectedPeriod: "daily" | "weekly" | "monthly" | "annual";
  forecastData: HoroscopeData | null;
  isLoading: boolean;
  error: string | null;
  fetchHoroscope: (sign: string, period: "daily" | "weekly" | "monthly" | "annual") => Promise<void>;
  setSelectedSign: (sign: string) => void;
  setSelectedPeriod: (period: "daily" | "weekly" | "monthly" | "annual") => void;
}

export const useHoroscopeStore = create<HoroscopeState>((set, get) => ({
  selectedSign: "Aries",
  selectedPeriod: "daily",
  forecastData: null,
  isLoading: false,
  error: null,

  fetchHoroscope: async (sign, period) => {
    set({ isLoading: true, error: null, selectedSign: sign, selectedPeriod: period });
    try {
      const data = await AstrologyService.getHoroscopeForecast(sign, period);
      set({ forecastData: data as any, isLoading: false });
    } catch (err: any) {
      console.error("Failed to load horoscope:", err);
      set({ error: "Cosmic alignments could not be read.", isLoading: false });
    }
  },

  setSelectedSign: (sign) => {
    set({ selectedSign: sign });
    get().fetchHoroscope(sign, get().selectedPeriod);
  },

  setSelectedPeriod: (period) => {
    set({ selectedPeriod: period });
    get().fetchHoroscope(get().selectedSign, period);
  },
}));
