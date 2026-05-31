import { create } from "zustand";

export interface RoomEvaluation {
  roomName: string;
  selectedDirection: string;
  score: number;
  status: "Excellent" | "Moderate" | "Deficient";
  remedy?: string;
  remedyProduct?: string;
}

export interface VastuAuditResult {
  totalScore: number;
  evaluations: RoomEvaluation[];
  summary: string;
}

interface VastuState {
  selections: {
    entrance: string;
    kitchen: string;
    bedroom: string;
    bathroom: string;
  };
  auditResult: VastuAuditResult | null;
  isLoading: boolean;
  updateRoomDirection: (room: "entrance" | "kitchen" | "bedroom" | "bathroom", direction: string) => void;
  calculateVastuScore: () => void;
  resetAudit: () => void;
}

export const useVastuStore = create<VastuState>((set, get) => ({
  selections: {
    entrance: "North",
    kitchen: "Southeast",
    bedroom: "Southwest",
    bathroom: "Northwest",
  },
  auditResult: null,
  isLoading: false,

  updateRoomDirection: (room, direction) => {
    set((state) => ({
      selections: {
        ...state.selections,
        [room]: direction,
      },
    }));
  },

  calculateVastuScore: () => {
    set({ isLoading: true });
    
    // Simulate short computation
    setTimeout(() => {
      const { entrance, kitchen, bedroom, bathroom } = get().selections;
      const evaluations: RoomEvaluation[] = [];
      let totalScore = 0;

      // 1. Entrance Evaluation
      let entranceScore = 5;
      let entranceStatus: RoomEvaluation["status"] = "Deficient";
      let entranceRemedy;
      let entranceProduct;
      if (["North", "East", "Northeast"].includes(entrance)) {
        entranceScore = 25;
        entranceStatus = "Excellent";
      } else if (["Northwest", "Southeast"].includes(entrance)) {
        entranceScore = 15;
        entranceStatus = "Moderate";
        entranceRemedy = "Place a copper Sun symbol or Pyramids above the entrance to balance energy fields.";
        entranceProduct = "Vastu Dosh Yantra";
      } else {
        entranceScore = 5;
        entranceStatus = "Deficient";
        entranceRemedy = "Highly critical entry direction. Install a Vastu Dosh Nivaran Yantra inside the foyer immediately to block negative energy transits.";
        entranceProduct = "Vastu Dosh Yantra";
      }
      totalScore += entranceScore;
      evaluations.push({
        roomName: "Main Entrance",
        selectedDirection: entrance,
        score: entranceScore,
        status: entranceStatus,
        remedy: entranceRemedy,
        remedyProduct: entranceProduct,
      });

      // 2. Kitchen Evaluation
      let kitchenScore = 5;
      let kitchenStatus: RoomEvaluation["status"] = "Deficient";
      let kitchenRemedy;
      let kitchenProduct;
      if (kitchen === "Southeast") {
        kitchenScore = 25;
        kitchenStatus = "Excellent";
      } else if (kitchen === "Northwest") {
        kitchenScore = 15;
        kitchenStatus = "Moderate";
        kitchenRemedy = "Place a copper bowl filled with Camphor crystals in the Southeast corner of your kitchen.";
        kitchenProduct = "Vastu Dosh Yantra";
      } else {
        kitchenScore = 5;
        kitchenStatus = "Deficient";
        kitchenRemedy = "Critical Agni corner defect. Neutralize this by hanging a Vastu energy plate or placing pure camphor diffusers near the stove zone.";
        kitchenProduct = "Vastu Dosh Yantra";
      }
      totalScore += kitchenScore;
      evaluations.push({
        roomName: "Kitchen",
        selectedDirection: kitchen,
        score: kitchenScore,
        status: kitchenStatus,
        remedy: kitchenRemedy,
        remedyProduct: kitchenProduct,
      });

      // 3. Bedroom Evaluation
      let bedroomScore = 5;
      let bedroomStatus: RoomEvaluation["status"] = "Deficient";
      let bedroomRemedy;
      let bedroomProduct;
      if (bedroom === "Southwest") {
        bedroomScore = 25;
        bedroomStatus = "Excellent";
      } else if (["South", "West"].includes(bedroom)) {
        bedroomScore = 15;
        bedroomStatus = "Moderate";
        bedroomRemedy = "Keep a lead pyramid or heavy brass objects in the Southwest corner of the bedroom to enhance earth element weight.";
        bedroomProduct = "Vastu Dosh Yantra";
      } else {
        bedroomScore = 5;
        bedroomStatus = "Deficient";
        bedroomRemedy = "Sleeping in non-earth sectors induces restlessness. Keep a Lead Vastu Pyramid in the Southwest and wear Yellow Sapphire to boost stability.";
        bedroomProduct = "Yellow Sapphire";
      }
      totalScore += bedroomScore;
      evaluations.push({
        roomName: "Master Bedroom",
        selectedDirection: bedroom,
        score: bedroomScore,
        status: bedroomStatus,
        remedy: bedroomRemedy,
        remedyProduct: bedroomProduct,
      });

      // 4. Bathroom Evaluation
      let bathroomScore = 5;
      let bathroomStatus: RoomEvaluation["status"] = "Deficient";
      let bathroomRemedy;
      let bathroomProduct;
      if (["Northwest", "West"].includes(bathroom)) {
        bathroomScore = 25;
        bathroomStatus = "Excellent";
      } else if (["North", "East"].includes(bathroom)) {
        bathroomScore = 15;
        bathroomStatus = "Moderate";
        bathroomRemedy = "Keep a small bowl of unrefined sea salt in the bathroom to absorb negative vibrational moisture. Replace weekly.";
        bathroomProduct = "Vastu Dosh Yantra";
      } else {
        bathroomScore = 5;
        bathroomStatus = "Deficient";
        bathroomRemedy = "Bathroom in fire/earth zones damages household prosperity. Place a specialized Vastu Salt bowl or a copper yantra to balance elements.";
        bathroomProduct = "Vastu Dosh Yantra";
      }
      totalScore += bathroomScore;
      evaluations.push({
        roomName: "Bathrooms",
        selectedDirection: bathroom,
        score: bathroomScore,
        status: bathroomStatus,
        remedy: bathroomRemedy,
        remedyProduct: bathroomProduct,
      });

      // Summary narrative
      let summary = "";
      if (totalScore >= 80) {
        summary = "Your living space exhibits outstanding elemental alignment! The energy flows seamlessly, supporting health, abundance, and domestic peace.";
      } else if (totalScore >= 50) {
        summary = "Your home possesses moderate elemental harmony. While the core quadrants are functional, minor Vastu adjustments will optimize wealth transits and family wellness.";
      } else {
        summary = "Significant Vastu deviations detected in key zones. These imbalances may trigger career blocks or mental stress. We highly recommend applying the specified remedies promptly.";
      }

      set({
        auditResult: {
          totalScore,
          evaluations,
          summary,
        },
        isLoading: false,
      });
    }, 1000);
  },

  resetAudit: () => set({ auditResult: null, isLoading: false }),
}));
