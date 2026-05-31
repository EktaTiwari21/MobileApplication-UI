import { useVastuStore } from "../useVastuStore";

describe("useVastuStore", () => {
  beforeEach(() => {
    // Reset state before each test
    useVastuStore.getState().resetAudit();
  });

  it("should initialize with standard default values", () => {
    const state = useVastuStore.getState();
    expect(state.selections.entrance).toBe("North");
    expect(state.selections.kitchen).toBe("Southeast");
    expect(state.selections.bedroom).toBe("Southwest");
    expect(state.selections.bathroom).toBe("Northwest");
    expect(state.auditResult).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("should update room direction correctly", () => {
    useVastuStore.getState().updateRoomDirection("entrance", "South");
    const state = useVastuStore.getState();
    expect(state.selections.entrance).toBe("South");
  });

  it("should calculate Vastu score correctly for ideal placement", (done) => {
    // Set all selections to ideal
    useVastuStore.getState().updateRoomDirection("entrance", "North");
    useVastuStore.getState().updateRoomDirection("kitchen", "Southeast");
    useVastuStore.getState().updateRoomDirection("bedroom", "Southwest");
    useVastuStore.getState().updateRoomDirection("bathroom", "Northwest");

    useVastuStore.getState().calculateVastuScore();
    expect(useVastuStore.getState().isLoading).toBe(true);

    // Wait for simulated computation
    setTimeout(() => {
      const state = useVastuStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.auditResult).not.toBeNull();
      expect(state.auditResult?.totalScore).toBe(100);
      expect(state.auditResult?.summary).toContain("outstanding elemental alignment");
      done();
    }, 1200);
  });
});
