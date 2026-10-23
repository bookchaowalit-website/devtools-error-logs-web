# Error Logs — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `error-logs`, evidence Prototype) on 2026-10-23.

## What it is

A client-only demo board over a hard-coded `LOGS` array of four sample signals, labelled "SAMPLE SIGNALS / NO
INGESTION".

## Who it is for

A portfolio visitor who wants to see a calm triage UI: a time window, a signal table and an incident panel.

## What works today

1. Signal board with four sample rows (time, signal, service, count, state: down / warn / ok).
2. Window buttons 24h, 7d, 30d. 24h shows the three newest sample rows; 7d and 30d show all four (the sample has no
   older rows). If the window hides the open signal, the first visible one opens instead.
3. Incident panel with the chosen signal's state, name, detail, service and time.
4. `/api/mcp` answers JSON-RPC with `get_all`, `get_by_id` and `in_range` over the same samples; unknown tools or
   methods get a JSON-RPC error.
5. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No ingestion API or SDK, no stack-trace deduplication, no real-time monitoring across apps, no alerting and no
  measured detection time (claims removed from the portfolio card in the 2026-10 review).
- Counts and times are fixed sample values. No account, storage or sync; nothing survives a reload.
- Vercel Analytics and Speed Insights are rendered in the layout (page views and web vitals only).

## Live URL and deploy state

- Live: https://error-logs.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-error-logs-frontend` is deployed only by CLI (last production 2026-10-08, commit
  8a8043d, next 16.3.8) and its Git link names the old repository (`bookchaowalit/bookchaowalit-error-logs-frontend`),
  so a push to `main` does not deploy. The live site lags `main` (old template MCP route, no Sentry, no CVE patch)
  until it is deployed by the coordinator or the owner reconnects Vercel Git to this repository (owner action D9).
- `NEXT_PUBLIC_SENTRY_DSN` is set on the Vercel project (Sentry project `devtools-error-logs-web`, org `personal-yu0`).

## Boundaries

- Browser-only apart from the stateless `/api/mcp` route. Outbound calls: Vercel Analytics / Speed Insights, and a
  Sentry error report when the DSN is set.
