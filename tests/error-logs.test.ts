import { describe, expect, it } from "vitest";
import { LOGS, countByStatus, isRange, logsInRange, pickSelected } from "@/lib/error-logs";

describe("logsInRange", () => {
  it("shows the three newest rows for 24h and all rows for wider windows", () => {
    expect(logsInRange(LOGS, "24h").map((l) => l.id)).toEqual(["type-error", "api-500", "hydration"]);
    expect(logsInRange(LOGS, "7d")).toHaveLength(4);
    expect(logsInRange(LOGS, "30d")).toHaveLength(4);
  });
});

describe("pickSelected", () => {
  it("keeps a visible selection", () => {
    expect(pickSelected(LOGS, LOGS, "hydration").id).toBe("hydration");
  });

  it("does not keep showing a row the range filter hid", () => {
    expect(pickSelected(LOGS, logsInRange(LOGS, "24h"), "asset").id).toBe("type-error");
  });

  it("falls back to the first row when nothing is visible", () => {
    expect(pickSelected(LOGS, [], "asset").id).toBe("type-error");
  });
});

describe("countByStatus and isRange", () => {
  it("counts every status", () => {
    expect(countByStatus(LOGS)).toEqual({ down: 1, warn: 2, ok: 1 });
    expect(countByStatus([])).toEqual({ down: 0, warn: 0, ok: 0 });
  });

  it("accepts only the three windows", () => {
    expect(isRange("7d")).toBe(true);
    expect(isRange("1y")).toBe(false);
    expect(isRange(undefined)).toBe(false);
  });
});
