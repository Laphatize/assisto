"use client";

const riskMetrics = [
  { label: "Value at Risk (95%)", value: "$4.2M", trend: "Stable", color: "#3d8c5c" },
  { label: "Expected Shortfall", value: "$6.8M", trend: "Elevated", color: "#c4913b" },
  { label: "Sharpe Ratio", value: "1.42", trend: "Improving", color: "#3d8c5c" },
  { label: "Max Drawdown", value: "-3.2%", trend: "Within Limit", color: "#3d8c5c" },
];

const exposures = [
  { asset: "US Equities", exposure: "$124.5M", pct: 35, risk: "Low" },
  { asset: "Fixed Income", exposure: "$98.2M", pct: 28, risk: "Low" },
  { asset: "FX Forwards", exposure: "$52.1M", pct: 15, risk: "Medium" },
  { asset: "Commodities", exposure: "$35.7M", pct: 10, risk: "Medium" },
  { asset: "Credit Derivatives", exposure: "$28.4M", pct: 8, risk: "High" },
  { asset: "Emerging Markets", exposure: "$14.1M", pct: 4, risk: "High" },
];

const stressTests = [
  { scenario: "Interest Rate +200bps", impact: "-$8.4M", severity: "high" },
  { scenario: "Equity Market -20%", impact: "-$24.9M", severity: "high" },
  { scenario: "Credit Spread Widening", impact: "-$5.2M", severity: "medium" },
  { scenario: "FX USD Strengthening 10%", impact: "-$3.1M", severity: "medium" },
  { scenario: "Commodity Shock", impact: "-$2.8M", severity: "low" },
  { scenario: "Liquidity Crisis", impact: "-$12.3M", severity: "high" },
];

const riskColor = { Low: "#3d8c5c", Medium: "#c4913b", High: "#b54a4a" };
const sevColor = { high: "#b54a4a", medium: "#c4913b", low: "#3d8c5c" };

export default function RiskPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Risk Assessment</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          AI-driven portfolio risk analysis, stress testing, and exposure monitoring
        </p>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {riskMetrics.map((m) => (
          <div key={m.label} className="rounded border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{m.label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>{m.value}</p>
            <p className="mt-1 text-xs font-medium" style={{ color: m.color }}>{m.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Exposure Breakdown */}
        <div className="rounded border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Exposure Breakdown</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {exposures.map((e) => (
              <div key={e.asset} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{e.asset}</span>
                    <span className="text-[13px] font-medium tabular-nums" style={{ color: "var(--foreground)" }}>{e.exposure}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1 flex-1 overflow-hidden rounded-sm" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-sm" style={{ width: `${e.pct}%`, background: riskColor[e.risk] }} />
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: riskColor[e.risk] }}>{e.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stress Tests */}
        <div className="rounded border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Stress Test Results</h2>
            <button
              className="rounded-sm px-3 py-1 text-xs font-medium text-white"
              style={{ background: "var(--accent)" }}
            >
              Run Tests
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {stressTests.map((t) => (
              <div key={t.scenario} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-sm" style={{ background: sevColor[t.severity] }} />
                  <span className="text-[13px]" style={{ color: "var(--foreground)" }}>{t.scenario}</span>
                </div>
                <span className="text-[13px] font-semibold tabular-nums" style={{ color: sevColor[t.severity] }}>
                  {t.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
