import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/mcp/route";

function rpc(body: unknown) {
  return POST(new Request("http://localhost/api/mcp", { method: "POST", body: JSON.stringify(body) }));
}

describe("MCP route", () => {
  it("echoes the JSON-RPC request id", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 7, method: "tools/list" });
    expect((await res.json()).id).toBe(7);
  });

  it("lists tools that act on the sample signals", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" });
    const names = (await res.json()).result.tools.map((t: { name: string }) => t.name);
    expect(names).toEqual(["get_all", "get_by_id", "in_range"]);
  });

  it("get_all returns the same sample rows the page shows", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "get_all" } });
    const { result } = await res.json();
    expect(result.logs.map((l: { id: string }) => l.id)).toEqual(["type-error", "api-500", "hydration", "asset"]);
    expect(result.counts).toEqual({ down: 1, warn: 2, ok: 1 });
  });

  it("in_range applies the page's window rule and rejects an unknown window", async () => {
    const ok = await (await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "in_range", arguments: { range: "24h" } } })).json();
    expect(ok.result.logs).toHaveLength(3);
    const bad = await (await rpc({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "in_range", arguments: { range: "1y" } } })).json();
    expect(bad.error.code).toBe(-32602);
    expect(bad.id).toBe(4);
  });

  it("get_by_id returns one row, or an error for an unknown id", async () => {
    const hit = await (await rpc({ jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "get_by_id", arguments: { id: "api-500" } } })).json();
    expect(hit.result.log.service).toBe("tip-jar-api");
    const miss = await (await rpc({ jsonrpc: "2.0", id: 6, method: "tools/call", params: { name: "get_by_id", arguments: { id: "nope" } } })).json();
    expect(miss.error.code).toBe(-32602);
  });

  it("rejects an unknown tool or method instead of pretending to call it", async () => {
    expect((await (await rpc({ jsonrpc: "2.0", id: 8, method: "tools/call", params: { name: "delete_all" } })).json()).error.code).toBe(-32602);
    expect((await (await rpc({ jsonrpc: "2.0", id: 9, method: "nope" })).json()).error.code).toBe(-32601);
  });

  it("answers malformed JSON with a parse error", async () => {
    const res = await POST(new Request("http://localhost/api/mcp", { method: "POST", body: "{" }));
    expect((await res.json()).error.code).toBe(-32700);
  });
});
