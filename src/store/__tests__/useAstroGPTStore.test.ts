import { useAstroGPTStore } from "../useAstroGPTStore";
import { AstrologyService } from "../../services/api";

// Mock the API service
jest.mock("../../services/api", () => ({
  AstrologyService: {
    askAstroGPT: jest.fn(),
  },
}));

describe("useAstroGPTStore", () => {
  beforeEach(() => {
    // Reset state before each test
    useAstroGPTStore.getState().clearChat();
    jest.clearAllMocks();
  });

  it("should initialize with a default welcoming bot message", () => {
    const state = useAstroGPTStore.getState();
    expect(state.messages.length).toBe(1);
    expect(state.messages[0].sender).toBe("bot");
    expect(state.messages[0].text).toContain("Pranam! I am AstroGPT");
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should process user inputs and handle bot answers successfully", async () => {
    const mockReply = "Based on your chart, your 2026 career is shining bright.";
    (AstrologyService.askAstroGPT as jest.Mock).mockResolvedValueOnce(mockReply);

    const activeKundaliContext = {
      native_name: "Aravind",
      ascendant_sign: "Leo",
      dasha_current: "Jupiter",
    };

    const storePromise = useAstroGPTStore
      .getState()
      .sendMessage("How will my career be in 2026?", activeKundaliContext);

    // Assert user message gets immediately appended
    let messages = useAstroGPTStore.getState().messages;
    expect(messages.length).toBe(2);
    expect(messages[1].sender).toBe("user");
    expect(messages[1].text).toBe("How will my career be in 2026?");
    expect(useAstroGPTStore.getState().isLoading).toBe(true);

    await storePromise;

    // Assert bot reply resolves and gets appended
    messages = useAstroGPTStore.getState().messages;
    expect(messages.length).toBe(3);
    expect(messages[2].sender).toBe("bot");
    expect(messages[2].text).toBe(mockReply);
    expect(useAstroGPTStore.getState().isLoading).toBe(false);
    expect(useAstroGPTStore.getState().error).toBeNull();
    expect(AstrologyService.askAstroGPT).toHaveBeenCalledTimes(1);
  });

  it("should handle error when AstroGPT API fails", async () => {
    (AstrologyService.askAstroGPT as jest.Mock).mockRejectedValueOnce(
      new Error("Generative API crash")
    );

    const activeKundaliContext = {
      native_name: "Aravind",
    };

    await useAstroGPTStore
      .getState()
      .sendMessage("How will my career be?", activeKundaliContext);

    const state = useAstroGPTStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Cosmic channels are blocked. Please try again.");
    // History has only user message, welcomed bot remains, no model response
    expect(state.messages.length).toBe(2);
  });
});
