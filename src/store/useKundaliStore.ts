import { create } from "zustand";
import { AstrologyService } from "../services/api";

interface PlanetPosition {
  name: string;
  longitude: number;
  sign: string;
  sign_degrees: number;
  house: number;
  is_retrograde: boolean;
}

interface HousePosition {
  house_number: number;
  sign: string;
  planets: string[];
}

interface KundaliData {
  native_name: string;
  dob: string;
  tob: string;
  location: string;
  ascendant_sign: string;
  planets: PlanetPosition[];
  houses: HousePosition[];
  yogas: { name: string; description: string; effects: string }[];
  doshas: { name: string; is_present: boolean; description: string }[];
  dasha_current?: string;
}

interface KundaliState {
  currentProfile: {
    native_name: string;
    dob: string;
    tob: string;
    location: string;
  } | null;
  activeKundali: KundaliData | null;
  isLoading: boolean;
  error: string | null;
  setProfileAndFetch: (profile: any) => Promise<void>;
  clearKundali: () => void;
}

export const useKundaliStore = create<KundaliState>((set) => ({
  currentProfile: null,
  activeKundali: null,
  isLoading: false,
  error: null,

  setProfileAndFetch: async (profile) => {
    set({ isLoading: true, error: null, currentProfile: profile });
    try {
      const data = await AstrologyService.generateKundali(profile);
      
      // Map backend response to UI state
      const mappedKundali = {
        native_name: data.name || profile.native_name,
        dob: profile.dob,
        tob: profile.tob,
        location: profile.location,
        ascendant_sign: data.ascendant_sign,
        houses: data.houses.map((h: any) => ({
          house_number: h.house_number,
          sign: h.zodiac_sign,
          planets: h.planets
        })),
        // Mock the rest to avoid breaking the UI for now, since we are focusing on exact chart accuracy first
        planets: [],
        yogas: [],
        doshas: [],
        dasha_current: "Jupiter",
      };
      
      set({ activeKundali: mappedKundali as any, isLoading: false });
    } catch (err: any) {
      console.error(err);
      set({ error: "Failed to fetch Kundali", isLoading: false });
    }
  },

  clearKundali: () => set({ currentProfile: null, activeKundali: null, error: null }),
}));
