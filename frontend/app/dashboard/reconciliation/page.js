"use client";

import { useState } from "react";

const mockTransactions = [
  { id: "TXN-001", source: "Internal Ledger", counterparty: "Goldman Sachs", amount: "$1,250,000.00", date: "2025-02-06", status: "matched" },
  { id: "TXN-002", source: "SWIFT MT940", counterparty: "JP Morgan", amount: "$892,450.00", date: "2025-02-06", status: "matched" },
  { id: "TXN-003", source: "Internal Ledger", counterparty: "Citadel Securities", amount: "$45,200.00", date: "2025-02-05", status: "exception" },
  { id: "TXN-004", source: "DTC Settlement", counterparty: "Morgan Stanley", amount: "$3,100,000.00", date: "2025-02-05", status: "matched" },
  { id: "TXN-005", source: "SWIFT MT940", counterparty: "BlackRock", amount: "$567,800.00", date: "2025-02-05", status: "pending" },
  { id: "TXN-006", source: "Internal Ledger", counterparty: "Vanguard", amount: "$2,340,000.00", date: "2025-02-04", status: "matched" },
  { id: "TXN-007", source: "FedWire", counterparty: "State Street", amount: "$128,900.00", date: "2025-02-04", status: "exception" },
  { id: "TXN-008", source: "Internal Ledger", counterparty: "Fidelity", amount: "$4,500,000.00", date: "2025-02-04", status: "matched" },
];

const statusColors = {
  matched: { bg: "#e8f5e9", color: "#2e7d32", label: "Matched" },
  exception: { bg: "#fce4ec", color: "#b54a4a", label: "Exception" },
  pending: { bg: "#fff3e0", color: "#c4913b", label: "Pending" },
};

export default function ReconciliationPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all"
    ? mockTransactions
    : mockTransactions.filter((t) => t.status === activeTab);

  const matchedCount = mockTransactions.filter((t) => t.status === "matched").length;
  const exceptionCount = mockTransactions.filter((t) => t.status === "exception").length;
  const pendingCount = mockTransactions.filter((t) => t.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Reconciliation</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            AI-powered transaction matching and exception resolution
          </p>
        </div>
        <button
          className="rounded-sm px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => e.target.style.background = "var(--accent-hover)"}
          onMouseLeave={(e) => e.target.style.background = "var(--accent)"}
        >
          Run Reconciliation
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Matched</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "#2e7d32" }}>{matchedCount}</p>
        </div>
        <div className="rounded border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Exceptions</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "#b54a4a" }}>{exceptionCount}</p>
        </div>
        <div className="rounded border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Pending</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "#c4913b" }}>{pendingCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-1 border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
          {["all", "matched", "exception", "pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="rounded-sm px-3 py-1.5 text-xs font-medium capitalize transition-colors"
              style={{
                background: activeTab === tab ? "var(--background)" : "transparent",
                color: activeTab === tab ? "var(--accent)" : "var(--muted)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              {["Transaction ID", "Source", "Counterparty", "Amount", "Date", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {filtered.map((txn) => (
              <tr key={txn.id} className="transition-colors" style={{ cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--background)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td className="px-5 py-3 text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{txn.id}</td>
                <td className="px-5 py-3 text-[13px]" style={{ color: "var(--muted)" }}>{txn.source}</td>
                <td className="px-5 py-3 text-[13px]" style={{ color: "var(--foreground)" }}>{txn.counterparty}</td>
                <td className="px-5 py-3 text-[13px] font-medium tabular-nums" style={{ color: "var(--foreground)" }}>{txn.amount}</td>
                <td className="px-5 py-3 text-[13px] tabular-nums" style={{ color: "var(--muted)" }}>{txn.date}</td>
                <td className="px-5 py-3">
                  <span
                    className="rounded-sm px-2 py-0.5 text-[11px] font-medium"
                    style={{ background: statusColors[txn.status].bg, color: statusColors[txn.status].color }}
                  >
                    {statusColors[txn.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
