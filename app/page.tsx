"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LOGS, RANGES, logsInRange, pickSelected, type Range } from "@/lib/error-logs";

export default function Home() {
  const [range, setRange] = useState<Range>("7d");
  const [selectedId, setSelectedId] = useState(LOGS[0].id);
  const visible = useMemo(() => logsInRange(LOGS, range), [range]);
  const selected = pickSelected(LOGS, visible, selectedId);
  return <main className="el-page">
    <header className="el-topbar"><Link className="el-mark" href="/">ERR / ROOM</Link><span>SAMPLE SIGNALS / NO INGESTION</span><span className="el-mode"><i /> READ-ONLY</span></header>
    <section className="el-hero"><div className="el-hero-copy"><p className="el-stamp">INCIDENT ROOM / SAMPLE DATA</p><h1>Errors leave<br /><span>a trail.</span></h1><p className="el-intro">A compact surface for reading client error samples. Follow a row from signal to context without pretending this demo is connected to a production stream.</p><div className="el-legend"><span><i className="el-dot el-dot-red" /> incident</span><span><i className="el-dot el-dot-amber" /> needs attention</span><span><i className="el-dot el-dot-green" /> contained</span></div></div><aside className="el-incident"><div className="el-incident-head"><span>ACTIVE SAMPLE</span><b>{selected.status.toUpperCase()}</b></div><div className="el-incident-body"><strong>{selected.name}</strong><p>{selected.detail}</p><div><span>{selected.service}</span><span>{selected.time} UTC</span></div></div></aside></section>
    <section className="el-board" aria-labelledby="board-title"><div className="el-board-head"><div><span className="el-board-code">01 / SIGNAL BOARD</span><h2 id="board-title">Read the room.</h2></div><div className="el-range" role="group" aria-label="Sample time range">{RANGES.map((item) => <button type="button" key={item} className={range === item ? "is-active" : ""} onClick={() => setRange(item)}>{item}</button>)}</div></div><div className="el-summary-line"><span>{visible.length} named signals in sample window</span><strong>Window / {range}</strong></div><div className="el-log-table"><div className="el-log-table-head"><span>TIME</span><span>SIGNAL</span><span>SERVICE</span><span>COUNT</span><span>STATE</span></div>{visible.map((log) => <button type="button" className={`el-log-row ${selected.id === log.id ? "is-selected" : ""}`} key={log.id} onClick={() => setSelectedId(log.id)}><span>{log.time}</span><strong>{log.name}</strong><span>{log.service}</span><b>{log.value}</b><span className={`el-state el-state-${log.status}`}>{log.status}</span></button>)}</div></section>
    <section className="el-footnote"><span>02 / HONEST LIMIT</span><p>Sample data only. The interface demonstrates triage states, range selection, and a readable incident trail; it does not receive or store real application errors.</p></section>
    <footer className="el-footer"><strong>NO LIVE PIPELINE ATTACHED.</strong><span>Error Logs · Bookchaowalit · sample board</span></footer>
  </main>;
}
