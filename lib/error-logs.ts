// The sample error signals and the range/selection rules used by the page and the MCP route.

export type LogStatus = "warn" | "down" | "ok";
export type LogRow = { id: string; time: string; name: string; value: string; status: LogStatus; service: string; detail: string };

export const LOGS: LogRow[] = [
  { id: "type-error", time: "14:03:22", name: "TypeError: x", value: "8", status: "warn", service: "checkout-ui", detail: "Cannot read properties of undefined (reading 'call')" },
  { id: "api-500", time: "13:58:09", name: "API 500", value: "1", status: "down", service: "tip-jar-api", detail: "POST /record returned 500 in the sample trace" },
  { id: "hydration", time: "12:44:16", name: "Hydration mismatch", value: "4", status: "warn", service: "portfolio-shell", detail: "Server and client markup differ in the sample payload" },
  { id: "asset", time: "11:31:47", name: "Missing asset", value: "2", status: "ok", service: "artblog", detail: "Fallback artwork served; no user-facing break" },
];

export const RANGES = ["24h", "7d", "30d"] as const;
export type Range = (typeof RANGES)[number];

export function isRange(value: unknown): value is Range {
  return RANGES.includes(value as Range);
}

/** Rows shown for a sample window: the 24h window holds the three newest sample rows, wider windows hold all. */
export function logsInRange(logs: LogRow[], range: Range): LogRow[] {
  return range === "24h" ? logs.slice(0, 3) : logs;
}

/** The selected row while it is visible, else the first visible row, else the first row overall. */
export function pickSelected(logs: LogRow[], visible: LogRow[], selectedId: string): LogRow {
  return visible.find((log) => log.id === selectedId) ?? visible[0] ?? logs[0];
}

/** Rows per status in the given list. */
export function countByStatus(logs: LogRow[]): Record<LogStatus, number> {
  const counts: Record<LogStatus, number> = { down: 0, warn: 0, ok: 0 };
  for (const log of logs) counts[log.status] += 1;
  return counts;
}
