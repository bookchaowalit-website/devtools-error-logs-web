import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { ErrorBoard } from "@/components/error-board";
import { LOGS } from "@/lib/error-logs";

describe("home page", () => {
  it("renders every sample signal in the default 7d window, the sample label and the hub footer", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("Client error signals");
    for (const log of LOGS) expect(html).toContain(log.service);
    expect(html).toContain("Sample data");
    expect(html).toContain('href="https://bookchaowalit.com/"');
    expect(html).toContain('href="#main"');
  });
  it("opens the first signal with a tone that matches its status", () => {
    const html = renderToString(<Home />).replace(/<!-- -->/g, "");
    expect(html).toContain(LOGS[0].detail.replace(/'/g, "&#x27;"));
    expect(html).toContain(`${LOGS[0].service} · ${LOGS[0].time} UTC`);
    expect(html).toMatch(/data-tone="amber">Warning<\/span>/);
    expect(html).toMatch(/aria-pressed="true"[^>]*>7d</);
  });
  it("shows an empty state when the window holds no signals", () => {
    const html = renderToString(<ErrorBoard logs={[]} />);
    expect(html).toContain("No signals in this window");
    expect(html).toContain("Nothing selected");
  });
});

describe("site files", () => {
  it("point at error-logs.bookchaowalit.com", () => {
    expect(robots().sitemap).toBe("https://error-logs.bookchaowalit.com/sitemap.xml");
    expect(sitemap()[0].url).toBe("https://error-logs.bookchaowalit.com/");
  });
});
