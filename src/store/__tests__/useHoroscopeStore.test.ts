import { useHoroscopeStore } from "../useHoroscopeStore";
import { AstrologyService } from "../../services/api";

// Mock the API service
jest.mock("../../services/api", () => ({
  AstrologyService: {
    getHoroscopeForecast: jest.fn(),
  },
}));

describe("useHoroscopeStore", () => {
  beforeEach(() => {
    // Reset state
    jest.clearAllMocks();
  });

  it("should initialize with standard default values", () => {
    const state = useHoroscopeStore.getState();
    expect(state.selectedSign).toBe("Aries");
    expect(state.selectedPeriod).toBe("daily");
    expect(state.forecastData).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("should fetch horoscope forecast successfully", async () => {
    const mockForecast = {
      sign: "Leo",
      period: "daily",
      forecast: "A highly productive day with powerful celestial alignments.",
      ratings: {
        love: 5,
        career: 4,
        wealth: 4,
        health: 5,
      },
      lucky_number: 9,
      lucky_color: "Golden Amber",
      compatible_sign: "Aries",
    };

    (AstrologyService.getHoroscopeForecast as jest.Mock).mockResolvedValueOnce(mockForecast);

    const storePromise = useHoroscopeStore.getState().fetchHoroscope("Leo", "daily");

    expect(useHoroscopeStore.getState().isLoading).toBe(true);

    await storePromise;

    const state = useHoroscopeStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.forecastData).toEqual(mockForecast);
    expect(state.selectedSign).toBe("Leo");
    expect(state.selectedPeriod).toBe("daily");
    expect(AstrologyService.getHoroscopeForecast).toHaveBeenCalledWith("Leo", "daily");
  });
});
