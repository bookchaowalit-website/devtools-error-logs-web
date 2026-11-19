"use client";

import { useMemo, useState } from "react";
import { DashFoot, DashTop, Pill, Segmented, Stat } from "@/components/dashboard-shell";
import { LOGS, RANGES, RANGE_LABEL, STATUS_TONE, STATUS_WORD, countByStatus, logsInRange, pickSelected, shareOfCount, totalCount, type LogRow, type Range } from "@/lib/error-logs";

const PERIODS = RANGES.map((id) => ({ id, label: id }));

/** The sample error board: one period switch, status counts, the signal list and the open signal. */
export function ErrorBoard({ logs = LOGS }: { logs?: LogRow[] }) {
  const [range, setRange] = useState<Range>("7d");
  const [selectedId, setSelectedId] = useState(logs[0]?.id ?? "");
  const visible = useMemo(() => logsInRange(logs, range), [logs, range]);
  const selected = visible.length ? pickSelected(logs, visible, selectedId) : undefined;
  const counts = countByStatus(visible);
  const period = RANGE_LABEL[range];

  return (
    <div className="ds">
      <a className="ds-skip" href="#main">Skip to content</a>
      <DashTop name="Error Logs" tagline="A sample triage board" />

      <main id="main" tabIndex={-1} className="ds-main">
        <div className="ds-head">
          <div>
            <h1>Client error signals</h1>
            <p>{period} · occurrences per signal <Pill tone="grey">Sample data</Pill></p>
          </div>
          <Segmented label="Time window" options={PERIODS} value={range} onChange={setRange} />
        </div>

        <ul className="ds-stats" aria-label={`${period} at a glance`}>
          <Stat label="Signals" value={visible.length} note={`${totalCount(visible)} occurrences`} />
          <Stat label="Down" value={counts.down} note="breaks a user flow" />
          <Stat label="Warning" value={counts.warn} note="needs attention" />
          <Stat label="Contained" value={counts.ok} note="fallback served" />
        </ul>

        <div className="ds-grid">
          <section className="ds-panel" aria-labelledby="signals-heading">
            <div className="ds-panel-head">
              <div>
                <h2 id="signals-heading">Signals</h2>
                <p>Newest first · pick one to read its trail</p>
              </div>
            </div>
            {visible.length ? (
              <ul className="ds-rows">
                {visible.map((log) => (
                  <li key={log.id}>
                    <button type="button" className="ds-row" aria-pressed={log.id === selected?.id} onClick={() => setSelectedId(log.id)}>
                      <span className="ds-row-name"><span className="ds-dot" data-tone={STATUS_TONE[log.status]} aria-hidden="true" />{log.name}</span>
                      <span className="ds-row-detail">{STATUS_WORD[log.status]} · {log.service} · {log.time} UTC</span>
                      <span className="ds-row-value">{log.value}<span className="ds-sr"> occurrences</span></span>
                      <span className="ds-meter" aria-hidden="true"><span style={{ width: `${shareOfCount(log, visible)}%` }} /></span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="ds-callout">
                <strong>No signals in this window</strong>
                <span>Nothing was sampled for {period.toLowerCase()}. Pick a wider window.</span>
              </div>
            )}
          </section>

          <section className="ds-panel" aria-labelledby="open-heading">
            <div className="ds-panel-head">
              <div>
                <h2 id="open-heading">Open signal</h2>
                <p>Service, time and detail of the selected row</p>
              </div>
              {selected ? <Pill tone={STATUS_TONE[selected.status]}>{STATUS_WORD[selected.status]}</Pill> : null}
            </div>
            {selected ? (
              <div className="ds-callout" aria-live="polite">
                <strong>{selected.name}</strong>
                <span>{selected.detail}</span>
                <span>{selected.service} · {selected.time} UTC · {selected.value} {selected.value === "1" ? "occurrence" : "occurrences"}</span>
              </div>
            ) : (
              <div className="ds-callout"><strong>Nothing selected</strong><span>There are no signals to open in this window.</span></div>
            )}
          </section>
        </div>

        <p className="ds-note">Sample data written into this page: four signals with fixed counts and times. Nothing is ingested, stored or monitored; the 24h window shows the three newest rows, 7d and 30d show all four.</p>
      </main>

      <DashFoot source="https://github.com/bookchaowalit-website/devtools-error-logs-web" />
    </div>
  );
}
