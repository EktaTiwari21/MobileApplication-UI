import { create } from "zustand";
import { AstrologyService } from "../services/api";

export interface TimeSlot {
  time: string;
  name: string;
  quality: string;
  color: string;
}

export interface PanchangData {
  date: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  tithi: string;
  tithi_end_time: string;
  nakshatra: string;
  nakshatra_end_time: string;
  yoga: string;
  karana: string;
  rahu_kaal: string;
  yamaganda: string;
  abhijit_muhurat: string;
  gulika_kaal: string;
  festivals: string[];
  choghadiya: {
    day: TimeSlot[];
    night: TimeSlot[];
  };
  hora: {
    day: TimeSlot[];
    night: TimeSlot[];
  };
}

interface PanchangState {
  selectedDate: string;
  panchangData: PanchangData | null;
  isLoading: boolean;
  error: string | null;
  setSelectedDateAndFetch: (date: string) => Promise<void>;
}

// Get today's date formatted as YYYY-MM-DD
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const usePanchangStore = create<PanchangState>((set) => ({
  selectedDate: getTodayString(),
  panchangData: null,
  isLoading: false,
  error: null,

  setSelectedDateAndFetch: async (date) => {
    set({ isLoading: true, error: null, selectedDate: date });
    try {
      const data = await AstrologyService.getPanchangDetails(date);
      set({ panchangData: data as any, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch Panchang details:", err);
      set({ error: "Failed to load Panchang details.", isLoading: false });
    }
  },
}));
