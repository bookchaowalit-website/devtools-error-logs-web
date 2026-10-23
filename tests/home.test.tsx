import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { LOGS } from "@/lib/error-logs";

describe("home page", () => {
  it("renders every sample signal in the default 7d window and the no-ingestion notices", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("Errors leave");
    for (const log of LOGS) expect(html).toContain(log.service);
    expect(html).toContain("SAMPLE SIGNALS / NO INGESTION");
    expect(html).toContain("NO LIVE PIPELINE ATTACHED.");
  });
  it("opens the first signal in the incident panel", () => {
    const html = renderToString(<Home />);
    expect(html).toContain(LOGS[0].detail.replace(/'/g, "&#x27;"));
    expect(html.replace(/<!-- -->/g, "")).toContain(`${LOGS[0].time} UTC`);
  });
});
