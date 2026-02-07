"use client";

const reportTemplates = [];
const recentReports = [];

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
          {reportTemplates.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm" style={{ color: "var(--muted)" }}>No report templates configured.</p>
            </div>
          ) : (
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
                    className="ml-4 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors btn-click"
                    style={{ background: "var(--background)", color: "var(--accent)", border: "1px solid var(--border)" }}
                  >
                    Generate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Downloads */}
        <div className="rounded border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Recent Downloads</h2>
          </div>
          {recentReports.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm" style={{ color: "var(--muted)" }}>No reports generated yet.</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
