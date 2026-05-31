import { create } from "zustand";
import { AstrologyService } from "../services/api";

export interface PartnerInput {
  name: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  location: string;
  lat?: number;
  lon?: number;
}

export interface GunaScores {
  varna: number;
  vashya: number;
  tara: number;
  yoni: number;
  grahamaitri: number;
  gana: number;
  bhakoot: number;
  nadi: number;
}

export interface MatchResult {
  boy_name: string;
  girl_name: string;
  total_score: number;
  max_score: number;
  is_compatible: boolean;
  detailed_scores: GunaScores;
  conclusion: string;
}

interface MatchState {
  currentProfiles: { boy: PartnerInput; girl: PartnerInput } | null;
  matchResult: MatchResult | null;
  isLoading: boolean;
  error: string | null;
  fetchMatchCompatibility: (boy: PartnerInput, girl: PartnerInput) => Promise<void>;
  clearMatchResult: () => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  currentProfiles: null,
  matchResult: null,
  isLoading: false,
  error: null,

  fetchMatchCompatibility: async (boy, girl) => {
    set({ isLoading: true, error: null, currentProfiles: { boy, girl } });
    try {
      // Format parameters matching AstrologyService signature
      const result = await AstrologyService.getMatchmakingScore({
        boy_name: boy.name,
        boy_dob: `${boy.day}/${boy.month}/${boy.year}`,
        boy_tob: `${boy.hour}:${boy.minute}`,
        girl_name: girl.name,
        girl_dob: `${girl.day}/${girl.month}/${girl.year}`,
        girl_tob: `${girl.hour}:${girl.minute}`,
      });
      
      set({ matchResult: result, isLoading: false });
    } catch (err: any) {
      console.error("Matchmaking calculation failed:", err);
      set({ error: "Failed to calculate cosmic compatibility", isLoading: false });
    }
  },

  clearMatchResult: () => set({ currentProfiles: null, matchResult: null, error: null }),
}));
