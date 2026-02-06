"use client";

const reportTemplates = [
  { name: "Daily Operations Summary", desc: "End-of-day reconciliation status, exceptions, and compliance alerts", frequency: "Daily", lastRun: "Today, 6:00 PM" },
  { name: "Regulatory Compliance Report", desc: "Comprehensive regulatory status across AML, KYC, SOX, and OFAC", frequency: "Weekly", lastRun: "Feb 3, 2025" },
  { name: "Risk Exposure Analysis", desc: "Portfolio VaR, stress test results, and exposure breakdown by asset class", frequency: "Daily", lastRun: "Today, 5:30 PM" },
  { name: "Transaction Audit Trail", desc: "Full audit log of all processed transactions with reconciliation status", frequency: "On Demand", lastRun: "Feb 5, 2025" },
  { name: "Exception Management Report", desc: "Open exceptions, resolution times, and trend analysis", frequency: "Weekly", lastRun: "Feb 3, 2025" },
  { name: "Document Processing Summary", desc: "Documents processed, extraction accuracy, and review pipeline status", frequency: "Daily", lastRun: "Today, 5:00 PM" },
];

const recentReports = [
  { name: "Daily Operations Summary — Feb 6", format: "PDF", size: "2.4 MB", generated: "6:00 PM" },
  { name: "Risk Exposure Analysis — Feb 6", format: "PDF", size: "1.8 MB", generated: "5:30 PM" },
  { name: "Document Processing Summary — Feb 6", format: "XLSX", size: "890 KB", generated: "5:00 PM" },
  { name: "Transaction Audit Trail — Feb 5", format: "CSV", size: "4.2 MB", generated: "Yesterday" },
  { name: "Regulatory Compliance Report — W5", format: "PDF", size: "3.1 MB", generated: "Feb 3" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Reports</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Generate, schedule, and export operational reports
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Report Templates */}
        <div className="col-span-2 rounded border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Report Templates</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {reportTemplates.map((report) => (
              <div key={report.name} className="flex items-center justify-between px-5 py-4">
                <div className="flex-1">
                  <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{report.name}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>{report.desc}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                      Frequency: <span style={{ color: "var(--foreground)" }}>{report.frequency}</span>
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                      Last run: <span style={{ color: "var(--foreground)" }}>{report.lastRun}</span>
                    </span>
                  </div>
                </div>
                <button
                  className="ml-4 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{ background: "var(--background)", color: "var(--accent)", border: "1px solid var(--border)" }}
                >
                  Generate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Downloads */}
        <div className="rounded border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Recent Downloads</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {recentReports.map((r, i) => (
              <div key={i} className="px-4 py-3 cursor-pointer transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--background)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{r.name}</p>
                <div className="mt-1 flex items-center gap-3">
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                    style={{ background: "var(--background)", color: "var(--accent)" }}
                  >
                    {r.format}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--muted)" }}>{r.size}</span>
                  <span className="text-[11px]" style={{ color: "var(--muted)" }}>{r.generated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
