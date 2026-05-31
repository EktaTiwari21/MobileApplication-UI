import { useMatchStore } from "../useMatchStore";
import { AstrologyService } from "../../services/api";

// Mock the API service
jest.mock("../../services/api", () => ({
  AstrologyService: {
    getMatchmakingScore: jest.fn(),
  },
}));

describe("useMatchStore", () => {
  beforeEach(() => {
    // Reset state before each test
    useMatchStore.getState().clearMatchResult();
    jest.clearAllMocks();
  });

  it("should have correct initial state", () => {
    const state = useMatchStore.getState();
    expect(state.currentProfiles).toBeNull();
    expect(state.matchResult).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should calculate matchmaking compatibility successfully", async () => {
    const mockResult = {
      boy_name: "Rahul",
      girl_name: "Priya",
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
        nadi: 8,
      },
      conclusion: "Excellent compatibility.",
    };

    (AstrologyService.getMatchmakingScore as jest.Mock).mockResolvedValueOnce(mockResult);

    const boyInput = {
      name: "Rahul",
      day: "18",
      month: "06",
      year: "1992",
      hour: "09",
      minute: "15",
      location: "New Delhi, India",
    };

    const girlInput = {
      name: "Priya",
      day: "24",
      month: "11",
      year: "1994",
      hour: "18",
      minute: "45",
      location: "Mumbai, India",
    };

    const storePromise = useMatchStore.getState().fetchMatchCompatibility(boyInput, girlInput);

    // Assert loading state turns true immediately
    expect(useMatchStore.getState().isLoading).toBe(true);

    await storePromise;

    const state = useMatchStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.matchResult).toEqual(mockResult);
    expect(state.currentProfiles).toEqual({ boy: boyInput, girl: girlInput });
    expect(AstrologyService.getMatchmakingScore).toHaveBeenCalledTimes(1);
  });

  it("should handle error when matchmaking calculation fails", async () => {
    (AstrologyService.getMatchmakingScore as jest.Mock).mockRejectedValueOnce(
      new Error("API network failure")
    );

    const boyInput = {
      name: "Rahul",
      day: "18",
      month: "06",
      year: "1992",
      hour: "09",
      minute: "15",
      location: "New Delhi, India",
    };

    const girlInput = {
      name: "Priya",
      day: "24",
      month: "11",
      year: "1994",
      hour: "18",
      minute: "45",
      location: "Mumbai, India",
    };

    await useMatchStore.getState().fetchMatchCompatibility(boyInput, girlInput);

    const state = useMatchStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.matchResult).toBeNull();
    expect(state.error).toBe("Failed to calculate cosmic compatibility");
  });
});
