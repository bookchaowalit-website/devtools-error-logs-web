import { NextResponse } from "next/server";
import { LOGS, RANGES, countByStatus, isRange, logsInRange } from "@/lib/error-logs";

// Stateless JSON-RPC MCP endpoint over the same hard-coded sample signals the page shows.
// Nothing is ingested or stored: there is no real error stream behind it.

type RpcRequest = { id?: number | string | null; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };

const TOOLS = [
  { name: "get_all", description: "List every sample error signal with counts per status", inputSchema: { type: "object", properties: {} } },
  { name: "get_by_id", description: "Get one sample signal by id", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "in_range", description: "Sample signals shown for a window (24h, 7d or 30d)", inputSchema: { type: "object", properties: { range: { type: "string", enum: [...RANGES] } }, required: ["range"] } },
];

class RpcError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

function callTool(name: string | undefined, args: Record<string, unknown> = {}) {
  switch (name) {
    case "get_all":
      return { logs: LOGS, counts: countByStatus(LOGS) };
    case "get_by_id": {
      const log = LOGS.find((entry) => entry.id === args.id);
      if (!log) throw new RpcError(-32602, `No sample signal with id ${String(args.id)}`);
      return { log };
    }
    case "in_range": {
      if (!isRange(args.range)) throw new RpcError(-32602, `range must be one of ${RANGES.join(", ")}`);
      const logs = logsInRange(LOGS, args.range);
      return { range: args.range, logs, counts: countByStatus(logs) };
    }
    default:
      throw new RpcError(-32602, `Unknown tool: ${String(name)}`);
  }
}

export async function POST(request: Request) {
  let id: RpcRequest["id"] = null;
  try {
    const body = (await request.json()) as RpcRequest;
    id = body.id ?? null;
    let result: unknown;
    switch (body.method) {
      case "initialize":
        result = { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "Error Logs (sample)", version: "1.0.0" } };
        break;
      case "tools/list":
        result = { tools: TOOLS };
        break;
      case "tools/call":
        result = callTool(body.params?.name, body.params?.arguments);
        break;
      default:
        throw new RpcError(-32601, `Unknown method: ${String(body.method)}`);
    }
    return NextResponse.json({ jsonrpc: "2.0", id, result });
  } catch (error) {
    const code = error instanceof RpcError ? error.code : -32700;
    const message = error instanceof RpcError ? error.message : "Parse error";
    return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } }, { status: 400 });
  }
}
