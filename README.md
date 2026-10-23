# Error Logs

A sample "signal room" for reading client error samples: four hard-coded signals (time, name, service, count, state)
on a board you can narrow to a 24h, 7d or 30d window, with the chosen signal's detail in an incident panel.
Sample data only, kept in the code; nothing is ingested.

Live: https://error-logs.bookchaowalit.com (deployed by Vercel CLI; it lags `main`, see `PRODUCT.md`).

## What it does not do

- No ingestion API, SDK, stack-trace deduplication, alerting or real-time monitoring. No account. Nothing is saved.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: window/selection logic, MCP route, home page render, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Code map

- `lib/error-logs.ts`: the sample `LOGS`, `RANGES`, `logsInRange`, `pickSelected` and `countByStatus` (used by the page
  and the MCP route).
- `app/api/mcp/route.ts`: stateless JSON-RPC endpoint with `get_all`, `get_by_id` and `in_range` over those samples.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when
  `NEXT_PUBLIC_SENTRY_DSN` is unset.
- `app/more-projects/page.tsx`: shared portfolio link page (copied per repository, not a package).
