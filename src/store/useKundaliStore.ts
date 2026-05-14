import { create } from "zustand";

interface PlanetPosition {
  name: string;
  longitude: number;
  latitude: number;
  speed: number;
  sign: string;
  sign_degrees: number;
  house: number;
  nakshatra: string;
  nakshatra_pada: number;
  is_retrograde: boolean;
}

interface HousePosition {
  house_number: number;
  sign: string;
  degree: number;
  planets: string[];
}

interface KundaliData {
  native_name: string;
  dob: string;
  tob: string;
  location: string;
  ascendant_sign: string;
  ascendant_degree: number;
  planets: PlanetPosition[];
  houses: HousePosition[];
  yogas: { name: string; description: string; effects: string; is_present: boolean }[];
  doshas: { name: string; is_present: boolean; percentage: number; description: string; remedies: string[] }[];
  dasha_current?: string;
}

interface KundaliState {
  currentProfile: { native_name: string; dob: string; tob: string; location: string } | null;
  activeKundali: KundaliData | null;
  isLoading: boolean;
  error: string | null;
  setProfileAndFetch: (profile: { native_name: string; dob: string; tob: string; location: string }) => Promise<void>;
  clearKundali: () => void;
}

// Demo data — used when backend API is unreachable (e.g. Expo Go preview)
const DEMO_KUNDALI: KundaliData = {
  native_name: "Aarav Sharma",
  dob: "15/08/1995",
  tob: "14:30",
  location: "New Delhi, India",
  ascendant_sign: "Scorpio",
  ascendant_degree: 14.7,
  planets: [
    { name: "Sun", longitude: 118.4, latitude: 0, speed: 0.96, sign: "Cancer", sign_degrees: 28.4, house: 9, nakshatra: "Ashlesha", nakshatra_pada: 3, is_retrograde: false },
    { name: "Moon", longitude: 42.1, latitude: 0, speed: 13.2, sign: "Taurus", sign_degrees: 12.1, house: 7, nakshatra: "Rohini", nakshatra_pada: 1, is_retrograde: false },
    { name: "Mars", longitude: 157.8, latitude: 0, speed: 0.52, sign: "Virgo", sign_degrees: 7.8, house: 11, nakshatra: "Uttara Phalguni", nakshatra_pada: 3, is_retrograde: false },
    { name: "Mercury", longitude: 110.3, latitude: 0, speed: 1.2, sign: "Cancer", sign_degrees: 20.3, house: 9, nakshatra: "Ashlesha", nakshatra_pada: 1, is_retrograde: true },
    { name: "Jupiter", longitude: 232.6, latitude: 0, speed: 0.08, sign: "Scorpio", sign_degrees: 22.6, house: 1, nakshatra: "Jyeshtha", nakshatra_pada: 2, is_retrograde: false },
    { name: "Venus", longitude: 95.2, latitude: 0, speed: 1.1, sign: "Cancer", sign_degrees: 5.2, house: 9, nakshatra: "Pushya", nakshatra_pada: 2, is_retrograde: false },
    { name: "Saturn", longitude: 337.9, latitude: 0, speed: 0.03, sign: "Pisces", sign_degrees: 7.9, house: 5, nakshatra: "Uttara Bhadrapada", nakshatra_pada: 3, is_retrograde: true },
    { name: "Rahu", longitude: 189.5, latitude: 0, speed: -0.05, sign: "Libra", sign_degrees: 9.5, house: 12, nakshatra: "Swati", nakshatra_pada: 1, is_retrograde: true },
    { name: "Ketu", longitude: 9.5, latitude: 0, speed: -0.05, sign: "Aries", sign_degrees: 9.5, house: 6, nakshatra: "Ashwini", nakshatra_pada: 3, is_retrograde: true },
  ],
  houses: [
    { house_number: 1, sign: "Scorpio", degree: 210, planets: ["Jupiter"] },
    { house_number: 2, sign: "Sagittarius", degree: 240, planets: [] },
    { house_number: 3, sign: "Capricorn", degree: 270, planets: [] },
    { house_number: 4, sign: "Aquarius", degree: 300, planets: [] },
    { house_number: 5, sign: "Pisces", degree: 330, planets: ["Saturn"] },
    { house_number: 6, sign: "Aries", degree: 0, planets: ["Ketu"] },
    { house_number: 7, sign: "Taurus", degree: 30, planets: ["Moon"] },
    { house_number: 8, sign: "Gemini", degree: 60, planets: [] },
    { house_number: 9, sign: "Cancer", degree: 90, planets: ["Sun", "Mercury", "Venus"] },
    { house_number: 10, sign: "Leo", degree: 120, planets: [] },
    { house_number: 11, sign: "Virgo", degree: 150, planets: ["Mars"] },
    { house_number: 12, sign: "Libra", degree: 180, planets: ["Rahu"] },
  ],
  yogas: [
    { name: "Gajakesari Yoga", description: "Jupiter and Moon in mutual Kendra positions", effects: "Wealth, fame, high intellect, spiritual growth", is_present: true },
    { name: "Budhaditya Yoga", description: "Sun and Mercury in conjunction in 9th house", effects: "Sharp communicative skill, status in society", is_present: true },
    { name: "Ruchaka Yoga", description: "Mars in Kendra from Ascendant in own sign", effects: "Courageous leader, strong physique, authority", is_present: true },
  ],
  doshas: [
    { name: "Manglik Dosha", is_present: false, percentage: 15.0, description: "Mars positioned in 11th house — no significant domestic impact.", remedies: [] },
    { name: "Kaal Sarp Dosha", is_present: false, percentage: 10.0, description: "Planets distributed outside Rahu-Ketu axis peacefully.", remedies: [] },
    { name: "Pitra Dosha", is_present: true, percentage: 72.0, description: "Sun and Saturn in trikona from Moon indicates ancestral karmic debt.", remedies: ["Perform Pitra Tarpan on Amavasya", "Donate food to Brahmins on Saturdays"] },
  ],
  dasha_current: "Jupiter Mahadasha (2022–2038)",
};

export const useKundaliStore = create<KundaliState>((set) => ({
  currentProfile: null,
  activeKundali: null,
  isLoading: false,
  error: null,

  setProfileAndFetch: async (profile) => {
    set({ isLoading: true, error: null, currentProfile: profile });

    // Try calling backend API first
    try {
      const API_BASE = "http://localhost:8000/api";
      const params = new URLSearchParams({
        native_name: profile.native_name,
        dob: profile.dob,
        tob: profile.tob,
        location: profile.location,
      });
      const resp = await fetch(`${API_BASE}/kundali/generate?${params}`, { signal: AbortSignal.timeout(5000) });
      if (resp.ok) {
        const data = await resp.json();
        set({ activeKundali: data, isLoading: false });
        return;
      }
    } catch (_) {
      // Backend unreachable — use embedded demo data
    }

    // Fallback: use demo data for Expo Go preview
    await new Promise((r) => setTimeout(r, 1500)); // Simulate loading
    set({ activeKundali: { ...DEMO_KUNDALI, native_name: profile.native_name }, isLoading: false });
  },

  clearKundali: () => set({ currentProfile: null, activeKundali: null, error: null }),
}));
