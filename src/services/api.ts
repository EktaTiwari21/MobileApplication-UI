import { useAuthStore } from "../store/useAuthStore";

// Mock delay function to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthService = {
  login: async (email: string, password: string) => {
    await delay(1000);
    // Hardcoded mock successful login
    return {
      access_token: "mock_jwt_token_123456",
      token_type: "bearer"
    };
  },
  register: async (full_name: string, email: string, password: string) => {
    await delay(1000);
    // Hardcoded mock user
    return {
      id: 1,
      email: email,
      full_name: full_name,
      role: "user"
    };
  }
};

export const AstrologyService = {
  generateKundali: async (params: any) => {
    try {
      const response = await fetch("https://sour-seals-strive.loca.lt/api/v1/kundali/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true",
        },
        body: JSON.stringify({
          name: params.native_name,
          year: params.year,
          month: params.month,
          day: params.day,
          hour: params.hour,
          minute: params.minute,
          location: params.location,
          lat: params.lat,
          lon: params.lon
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate Kundali from backend");
      }

      const resData = await response.json();
      return resData.data;
    } catch (e) {
      console.error("Error calling FastAPI backend:", e);
      throw e;
    }
  },

  getTodayPanchang: async (params: { date: string; lat?: number; lon?: number }) => {
    await delay(600);
    return {
      date: params.date,
      sunrise: "06:15 AM",
      sunset: "05:45 PM",
      tithi: "Shukla Pratipada",
      tithi_end_time: "02:30 PM",
      nakshatra: "Ashwini",
      nakshatra_end_time: "11:45 PM",
      yoga: "Vishkumbha",
      karana: "Bava",
      rahu_kaal: "04:30 PM - 06:00 PM",
      yamaganda: "12:00 PM - 01:30 PM",
      abhijit_muhurat: "11:45 AM - 12:30 PM",
      is_auspicious: true,
      festival: null
    };
  },
  getMatchmakingScore: async (params: {
    boy_name: string;
    boy_dob: string;
    boy_tob: string;
    girl_name: string;
    girl_dob: string;
    girl_tob: string;
  }) => {
    await delay(800);
    return {
      boy_name: params.boy_name,
      girl_name: params.girl_name,
      total_score: 28.5,
      max_score: 36,
      is_compatible: true,
      detailed_scores: {
        varna: 1,
        vashya: 2,
        tara: 3,
        yoni: 4,
        grahamaitri: 5,
        gana: 6,
        bhakoot: 7,
        nadi: 8
      },
      conclusion: "Excellent match with strong Nadi and Bhakoot compatibility."
    };
  },
  findMuhurat: async (params: { event_type: string; start_date: string; end_date: string }) => {
    await delay(500);
    return [
      {
        event_type: params.event_type,
        start_time: `${params.start_date} 09:30 AM`,
        end_time: `${params.start_date} 11:45 AM`,
        muhurat_name: "Shubh Karyarambha Muhurat",
        auspiciousness_score: 92.5,
        description: "Favorable alignment with strong Ascendant lord positioning."
      },
      {
        event_type: params.event_type,
        start_time: `${params.end_date} 04:15 PM`,
        end_time: `${params.end_date} 06:30 PM`,
        muhurat_name: "Shubh Karyarambha Muhurat",
        auspiciousness_score: 88.0,
        description: "Optimal Tithi alignment avoiding Rikta intervals."
      }
    ];
  },
};
