// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ErrorBoard } from "@/components/error-board";
import { LOGS } from "@/lib/error-logs";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;
const press = (el: Element) => act(() => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
const period = (label: string) => [...host.querySelectorAll<HTMLButtonElement>(".ds-segmented button")].find((b) => b.textContent === label)!;
const rows = () => [...host.querySelectorAll<HTMLButtonElement>("button.ds-row")];
const callout = () => host.querySelector('[aria-labelledby="open-heading"] .ds-callout')?.textContent;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root.render(<ErrorBoard />));
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("error board", () => {
  it("switches the window with aria-pressed and updates the counts", () => {
    expect(rows()).toHaveLength(4);
    press(period("24h"));
    expect(period("24h").getAttribute("aria-pressed")).toBe("true");
    expect(period("7d").getAttribute("aria-pressed")).toBe("false");
    expect(rows()).toHaveLength(3);
    expect(host.querySelector(".ds-stat .ds-stat-value")?.textContent).toBe("3");
    expect(host.querySelector("h1 + p")?.textContent).toContain("Last 24 hours");
  });

  it("selects a row, marks it pressed and opens it with the matching status pill", () => {
    press(rows()[3]);
    expect(rows()[3].getAttribute("aria-pressed")).toBe("true");
    expect(rows()[0].getAttribute("aria-pressed")).toBe("false");
    expect(callout()).toContain(LOGS[3].detail);
    const pill = host.querySelector('[aria-labelledby="open-heading"] .ds-pill');
    expect(pill?.getAttribute("data-tone")).toBe("green");
    expect(pill?.textContent).toBe("Contained");
  });

  it("falls back to the first visible row when the window hides the open one", () => {
    press(rows()[3]);
    press(period("24h"));
    expect(callout()).toContain(LOGS[0].name);
    expect(rows()[0].getAttribute("aria-pressed")).toBe("true");
  });
});
