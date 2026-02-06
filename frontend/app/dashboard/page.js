"use client";

import { useAuth } from "@/lib/AuthContext";

const stats = [
  { label: "Transactions Processed", value: "12,847", change: "+4.3%", up: true },
  { label: "Compliance Score", value: "98.2%", change: "+0.5%", up: true },
  { label: "Open Exceptions", value: "23", change: "-12%", up: true },
  { label: "Documents Queued", value: "156", change: "+8", up: false },
];

const recentActivity = [
  { action: "Reconciliation completed", detail: "Q4 intercompany settlements — 2,341 transactions matched", time: "2 min ago", status: "success" },
  { action: "Compliance alert", detail: "KYC document expiring for 3 counterparties", time: "15 min ago", status: "warning" },
  { action: "Risk score updated", detail: "Portfolio VaR recalculated — within threshold", time: "1 hr ago", status: "success" },
  { action: "Document processed", detail: "Trade confirmation #TC-88421 extracted and validated", time: "2 hr ago", status: "success" },
  { action: "Reconciliation exception", detail: "USD 45,200 unmatched in nostro account JPMC-4421", time: "3 hr ago", status: "error" },
];

export default function DashboardOverview() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Here&apos;s your back-office operations summary.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded border p-5"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              {stat.label}
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
                {stat.value}
              </span>
              <span
                className="mb-0.5 text-xs font-medium"
                style={{ color: stat.up ? "#3d8c5c" : "#c4713b" }}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div
          className="col-span-2 rounded border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Recent Activity</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                <div
                  className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{
                    background:
                      item.status === "success" ? "#3d8c5c" :
                      item.status === "warning" ? "#c4913b" :
                      "#b54a4a",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>
                    {item.action}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                    {item.detail}
                  </p>
                </div>
                <span className="flex-shrink-0 text-[11px]" style={{ color: "var(--muted)" }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="rounded border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quick Actions</h2>
          </div>
          <div className="space-y-1 p-3">
            {[
              { label: "Run Reconciliation", desc: "Match pending transactions" },
              { label: "Compliance Check", desc: "Scan for regulatory issues" },
              { label: "Generate Report", desc: "Export operations summary" },
              { label: "Upload Documents", desc: "Process new documents" },
            ].map((action) => (
              <button
                key={action.label}
                className="w-full rounded-sm px-3 py-2.5 text-left transition-colors"
                style={{ color: "var(--foreground)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--background)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <p className="text-[13px] font-medium">{action.label}</p>
                <p className="text-[11px]" style={{ color: "var(--muted)" }}>{action.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
