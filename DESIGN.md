# Error Logs design

Moved onto the shared **Dashboard shell** on 2026-11-19 (see `DASHBOARD.md`; `app/dashboard-shell.css`,
`components/dashboard-shell.tsx`, `components/dashboard-chart.tsx` and `tests/dashboard-shell.test.tsx` are
byte-identical copies from sustainability-energy-dashboard-web). The palette is the shell's `--ds-*` tokens (light and
dark); the old navy/red signal-room palette is retired.

- One question: "Client error signals", with the window, the unit and a `Sample data` pill under it.
- One period switch (24h / 7d / 30d, `aria-pressed`), four stat tiles (signals, down, warning, contained).
- Signals list: buttons with `aria-pressed`, a status dot beside the name and the status word in the detail line, a
  share bar of occurrences. The selected row keeps the accent bar, not only a tint.
- Open signal panel: a status pill whose tone matches the status (red Down, amber Warning, green Contained).
- Empty state when a window holds no signals. No chart: the sample has no time series to draw.
