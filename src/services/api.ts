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
  getPanchangDetails: async (dateStr: string) => {
    await delay(800);
    
    // Parse date for dynamic variations
    const dayNum = new Date(dateStr).getDate() || 15;
    
    const festivals = dayNum % 5 === 0 ? ["Pradosh Vrat"] : dayNum % 3 === 0 ? ["Sankashti Chaturthi"] : [];
    if (dayNum === 11 || dayNum === 26) festivals.push("Ekadashi Vrat");
    if (dayNum === 15) festivals.push("Purnima Vrat");
    if (dayNum === 30) festivals.push("Amavasya Pitru Tarpan");
    
    return {
      date: dateStr,
      sunrise: "06:02 AM",
      sunset: "06:48 PM",
      moonrise: "07:12 PM",
      moonset: "05:22 AM",
      tithi: dayNum > 15 ? `Krishna Paksha Dwitiya` : `Shukla Paksha Ekadashi`,
      tithi_end_time: "04:18 PM",
      nakshatra: dayNum % 2 === 0 ? "Rohini" : "Pushya",
      nakshatra_end_time: "09:30 PM",
      yoga: "Harshana",
      karana: "Kaulava",
      rahu_kaal: "01:30 PM - 03:00 PM",
      yamaganda: "06:00 AM - 07:30 AM",
      abhijit_muhurat: "11:56 AM - 12:44 PM",
      gulika_kaal: "09:00 AM - 10:30 AM",
      festivals: festivals.length > 0 ? festivals : ["No major Vrat or fast for today"],
      
      // Choghadiya - 8 Day Slots, 8 Night Slots
      choghadiya: {
        day: [
          { time: "06:02 AM - 07:38 AM", name: "Udveg", quality: "Inauspicious", color: "#ef4444" },
          { time: "07:38 AM - 09:14 AM", name: "Chalat", quality: "Moderate", color: "#f59e0b" },
          { time: "09:14 AM - 10:50 AM", name: "Labh", quality: "Auspicious", color: "#10b981" },
          { time: "10:50 AM - 12:26 PM", name: "Amrit", quality: "Auspicious", color: "#10b981" },
          { time: "12:26 PM - 02:02 PM", name: "Kaal", quality: "Inauspicious", color: "#ef4444" },
          { time: "02:02 PM - 03:38 PM", name: "Shubh", quality: "Auspicious", color: "#10b981" },
          { time: "03:38 PM - 05:14 PM", name: "Rog", quality: "Inauspicious", color: "#ef4444" },
          { time: "05:14 PM - 06:48 PM", name: "Udveg", quality: "Inauspicious", color: "#ef4444" }
        ],
        night: [
          { time: "06:48 PM - 08:14 PM", name: "Shubh", quality: "Auspicious", color: "#10b981" },
          { time: "08:14 PM - 09:40 PM", name: "Amrit", quality: "Auspicious", color: "#10b981" },
          { time: "09:40 PM - 11:06 PM", name: "Chalat", quality: "Moderate", color: "#f59e0b" },
          { time: "11:06 PM - 12:32 AM", name: "Rog", quality: "Inauspicious", color: "#ef4444" },
          { time: "12:32 AM - 01:58 AM", name: "Kaal", quality: "Inauspicious", color: "#ef4444" },
          { time: "01:58 AM - 03:24 AM", name: "Labh", quality: "Auspicious", color: "#10b981" },
          { time: "03:24 AM - 04:50 AM", name: "Udveg", quality: "Inauspicious", color: "#ef4444" },
          { time: "04:50 AM - 06:02 AM", name: "Shubh", quality: "Auspicious", color: "#10b981" }
        ]
      },
      
      // Hora - Hourly Slots
      hora: {
        day: [
          { time: "06:02 AM - 07:02 AM", name: "Surya (Sun)", quality: "Moderate", color: "#f59e0b" },
          { time: "07:02 AM - 08:02 AM", name: "Shukra (Venus)", quality: "Auspicious", color: "#10b981" },
          { time: "08:02 AM - 09:02 AM", name: "Budha (Mercury)", quality: "Auspicious", color: "#10b981" },
          { time: "09:02 AM - 10:02 AM", name: "Chandra (Moon)", quality: "Moderate", color: "#f59e0b" },
          { time: "10:02 AM - 11:02 AM", name: "Shani (Saturn)", quality: "Inauspicious", color: "#ef4444" },
          { time: "11:02 AM - 12:02 PM", name: "Guru (Jupiter)", quality: "Auspicious", color: "#10b981" },
          { time: "12:02 PM - 01:02 PM", name: "Mangal (Mars)", quality: "Inauspicious", color: "#ef4444" },
          { time: "01:02 PM - 02:02 PM", name: "Surya (Sun)", quality: "Moderate", color: "#f59e0b" },
          { time: "02:02 PM - 03:02 PM", name: "Shukra (Venus)", quality: "Auspicious", color: "#10b981" },
          { time: "03:02 PM - 04:02 PM", name: "Budha (Mercury)", quality: "Auspicious", color: "#10b981" },
          { time: "04:02 PM - 05:02 PM", name: "Chandra (Moon)", quality: "Moderate", color: "#f59e0b" },
          { time: "05:02 PM - 06:48 PM", name: "Shani (Saturn)", quality: "Inauspicious", color: "#ef4444" }
        ],
        night: [
          { time: "06:48 PM - 07:48 PM", name: "Guru (Jupiter)", quality: "Auspicious", color: "#10b981" },
          { time: "07:48 PM - 08:48 PM", name: "Mangal (Mars)", quality: "Inauspicious", color: "#ef4444" },
          { time: "08:48 PM - 09:48 PM", name: "Surya (Sun)", quality: "Moderate", color: "#f59e0b" },
          { time: "09:48 PM - 10:48 PM", name: "Shukra (Venus)", quality: "Auspicious", color: "#10b981" },
          { time: "10:48 PM - 11:48 PM", name: "Budha (Mercury)", quality: "Auspicious", color: "#10b981" },
          { time: "11:48 PM - 12:48 AM", name: "Chandra (Moon)", quality: "Moderate", color: "#f59e0b" },
          { time: "12:48 AM - 01:48 AM", name: "Shani (Saturn)", quality: "Inauspicious", color: "#ef4444" },
          { time: "01:48 AM - 02:48 AM", name: "Guru (Jupiter)", quality: "Auspicious", color: "#10b981" }
        ]
      }
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
  askAstroGPT: async (message: string, history: any[], kundaliContext: any) => {
    await delay(1200);

    const msgLower = message.toLowerCase();
    const name = kundaliContext?.native_name || "Aravind";
    const sign = kundaliContext?.ascendant_sign || "Leo";
    const dasha = kundaliContext?.dasha_current || "Jupiter";

    if (msgLower.includes("career") || msgLower.includes("job") || msgLower.includes("2026") || msgLower.includes("future")) {
      return `Pranam ${name}. Analyzing your ${sign} ascendant blueprint.

For career and finance, your current ${dasha} Dasha acts as a powerful guiding force. Because ${dasha} is exceptionally placed in your chart, 2026 will be a year of transition and elevation.

• **First Half of 2026:** You will experience shifts in your workspace or professional responsibilities. Saturn's transit suggests a disciplined focus on long-term goals.
• **Second Half of 2026:** Favorable Jupiter transits open up opportunities for sudden promotions or creative ventures.

**Cosmic Tip:** Wear light yellow or gold on Thursdays and chant the Guru Mantra to maximize these beneficial effects!`;
    }

    if (msgLower.includes("rahu") || msgLower.includes("dasha") || msgLower.includes("dasa")) {
      return `Pranam ${name}. Let's address your question regarding the Rahu influence or Dasha cycles.

In Vedic astrology, Rahu represents desires, illusions, and sudden shifts. For a ${sign} native, a Rahu transit or sub-period can bring sudden, unexpected gains but may also trigger mental anxiety and restlessness.

• **Is it bad?** Not inherently. Rahu drives material ambition. However, it can cloud judgment.
• **Remedy for mental peace:** Chanting the Rahu Beej Mantra ("Om Raam Rahve Namaha") 108 times at sunset or donating black sesame seeds on Saturdays will significantly reduce the malefic shadow effects.`;
    }

    if (msgLower.includes("gemstone") || msgLower.includes("stone") || msgLower.includes("ruby") || msgLower.includes("sapphire")) {
      return `Pranam ${name}. Choosing the right cosmic remedy is vital for planetary alignment.

Based on your ${sign} Ascendant:
1. **Primary Gemstone (Life Stone):** **Yellow Sapphire (Pukhraj)** is highly recommended. It strengthens Jupiter, bringing wisdom, health, and spiritual alignment.
2. **Alternative Gemstone (Luck Stone):** **Ruby (Manik)** is excellent to empower your Sun sign, enhancing leadership qualities and public reputation.

**Cosmic Tip:** Ensure the stone is set in gold and worn on the specified index/ring finger after a purification ritual during a Thursday or Sunday sunrise.`;
    }

    if (msgLower.includes("vastu") || msgLower.includes("home") || msgLower.includes("direction")) {
      return `Pranam ${name}. Vastu Shastra is the physical extension of astrological alignments in your living space.

For a ${sign} native, keeping the East and Northeast zones of your house highly illuminated, clean, and free of clutter is crucial. This channels active solar energy directly into your career and health sectors.

• **Auspicious Tip:** Install a copper Sun symbol or a Sri Yantra in the Northeast zone of your living room to neutralize Vastu Dosh and attract cosmic peace.`;
    }

    // Default highly personalized reply
    return `Namaste ${name}. I have analyzed your Vedic birth chart (Ascendant: **${sign}**, Active Dasha: **${dasha}**).

Your unique planetary alignments suggest a strong capacity for intuition and wisdom, though current transits may induce some transient restlessness in your professional or domestic environment.

Could you elaborate more on whether you are seeking specific guidance for **Career**, **Relationships**, **Dasha Remedies**, or **Gemstone recommendations**?`;
  },
  getHoroscopeForecast: async (sign: string, period: "daily" | "weekly" | "monthly" | "annual") => {
    await delay(700);
    
    // Dynamic simulated metrics depending on sign characters and period
    const charSum = sign.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const loveRating = ((charSum % 5) + 1) as number;
    const careerRating = (((charSum + 2) % 5) + 1) as number;
    const wealthRating = (((charSum + 4) % 5) + 1) as number;
    const healthRating = (((charSum + 1) % 5) + 1) as number;
    const luckyNum = (charSum % 9) + 1;
    const luckyColor = ["Ruby Red", "Deep Violet", "Golden Amber", "Emerald Green", "Saffron Yellow", "Cosmic Blue"][charSum % 6];
    
    const forecasts = {
      daily: `Today, the planetary configurations suggest a highly energetic and focused day for ${sign}. The lunar transit supports swift decision-making in personal and financial matters. Take note of any subtle opportunities presented in the late afternoon. Avoid unnecessary conflicts in the workplace.`,
      weekly: `This week brings a powerful alignment in your career house. As Mars squares your sign, you will find additional momentum to execute pending projects. Emotional transparency with your partner or family members is highly recommended towards midweek. Financial gains are expected through an unexpected channel.`,
      monthly: `The month of May brings a significant planetary shift. Jupiter's entry into your house of partnerships creates highly favorable conditions for joint ventures, contracts, and long-term relationships. Ensure you maintain a balanced diet and stick to a consistent exercise routine to channel this expansive solar energy constructively.`,
      annual: `The annual Vedic chart represents a year of profound learning, consolidation, and spiritual progress. Major Saturn transits challenge you to release outdated habits, constructing solid foundations in both your professional workspace and household. Real estate or long-term investment portfolios look exceptionally favorable.`
    };
    
    return {
      sign,
      period,
      forecast: forecasts[period],
      ratings: {
        love: loveRating,
        career: careerRating,
        wealth: wealthRating,
        health: healthRating
      },
      lucky_number: luckyNum,
      lucky_color: luckyColor,
      compatible_sign: ["Leo", "Aries", "Sagittarius", "Taurus", "Virgo", "Capricorn", "Gemini", "Libra", "Aquarius", "Cancer", "Scorpio", "Pisces"][(charSum + 3) % 12]
    };
  }
};
