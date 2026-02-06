"use client";

const alerts = [
  { id: "CMP-101", rule: "KYC Expiry", entity: "Citadel Securities", severity: "high", detail: "KYC documentation expires in 5 days. Renewal required to continue trading.", date: "2025-02-06" },
  { id: "CMP-102", rule: "AML Screening", entity: "Offshore Fund VII", severity: "high", detail: "Transaction pattern flagged by AI — unusual volume spike detected.", date: "2025-02-06" },
  { id: "CMP-103", rule: "Reg W Limit", entity: "Internal Transfer", severity: "medium", detail: "Affiliate transaction approaching Section 23A limit (87% utilized).", date: "2025-02-05" },
  { id: "CMP-104", rule: "OFAC Match", entity: "Meridian Trading Co.", severity: "low", detail: "Fuzzy name match detected — AI confidence: 12%. Likely false positive.", date: "2025-02-05" },
  { id: "CMP-105", rule: "SOX Control", entity: "GL Reconciliation", severity: "medium", detail: "Segregation of duties violation — same user initiated and approved transfer.", date: "2025-02-04" },
];

const severityStyles = {
  high: { bg: "#fce4ec", color: "#b54a4a", dot: "#b54a4a" },
  medium: { bg: "#fff3e0", color: "#c4913b", dot: "#c4913b" },
  low: { bg: "#e8f5e9", color: "#2e7d32", dot: "#2e7d32" },
};

const regulations = [
  { name: "Anti-Money Laundering (AML)", status: "Compliant", score: 97 },
  { name: "Know Your Customer (KYC)", status: "Action Required", score: 84 },
  { name: "Sarbanes-Oxley (SOX)", status: "Compliant", score: 95 },
  { name: "OFAC Sanctions", status: "Compliant", score: 99 },
  { name: "Regulation W", status: "Monitoring", score: 88 },
  { name: "Basel III Capital", status: "Compliant", score: 96 },
];

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Compliance</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Regulatory monitoring, AI-driven alerts, and audit readiness
          </p>
        </div>
        <button
          className="rounded-sm px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => e.target.style.background = "var(--accent-hover)"}
          onMouseLeave={(e) => e.target.style.background = "var(--accent)"}
        >
          Run Compliance Scan
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="col-span-2 space-y-4">
          <div className="rounded border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Active Alerts</h2>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {alerts.map((alert) => (
                <div key={alert.id} className="px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-sm" style={{ background: severityStyles[alert.severity].dot }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{alert.rule}</span>
                          <span
                            className="rounded-sm px-2 py-0.5 text-[10px] font-medium capitalize"
                            style={{ background: severityStyles[alert.severity].bg, color: severityStyles[alert.severity].color }}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>{alert.entity}</p>
                      </div>
                    </div>
                    <span className="text-[11px]" style={{ color: "var(--muted)" }}>{alert.date}</span>
                  </div>
                  <p className="mt-2 pl-[18px] text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {alert.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regulatory Status */}
        <div className="rounded border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Regulatory Status</h2>
          </div>
          <div className="space-y-1 p-3">
            {regulations.map((reg) => (
              <div key={reg.name} className="rounded-sm px-3 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{reg.name}</p>
                  <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--accent)" }}>{reg.score}%</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-sm" style={{ background: "var(--border)" }}>
                  <div
                    className="h-full rounded-sm transition-all"
                    style={{
                      width: `${reg.score}%`,
                      background: reg.score >= 95 ? "#3d8c5c" : reg.score >= 85 ? "#c4913b" : "#b54a4a",
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>{reg.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
