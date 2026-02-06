"use client";

import { useState } from "react";

const documents = [
  { id: "DOC-441", name: "Trade Confirmation #TC-88421", type: "Trade Confirm", status: "processed", extracted: 12, confidence: 98, date: "2025-02-06" },
  { id: "DOC-440", name: "ISDA Master Agreement - Citadel", type: "Legal", status: "processing", extracted: null, confidence: null, date: "2025-02-06" },
  { id: "DOC-439", name: "Q4 Settlement Statement - JPMC", type: "Statement", status: "processed", extracted: 47, confidence: 95, date: "2025-02-05" },
  { id: "DOC-438", name: "KYC Renewal Package - BlackRock", type: "KYC", status: "review", extracted: 8, confidence: 87, date: "2025-02-05" },
  { id: "DOC-437", name: "Margin Call Notice #MC-2241", type: "Margin", status: "processed", extracted: 6, confidence: 99, date: "2025-02-04" },
  { id: "DOC-436", name: "Regulatory Filing - Form PF", type: "Regulatory", status: "processed", extracted: 34, confidence: 94, date: "2025-02-04" },
];

const statusStyles = {
  processed: { bg: "#e8f5e9", color: "#2e7d32", label: "Processed" },
  processing: { bg: "#e3f2fd", color: "#1565c0", label: "Processing" },
  review: { bg: "#fff3e0", color: "#c4913b", label: "Needs Review" },
};

export default function DocumentsPage() {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Documents</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          AI document processing — extract, validate, and classify financial documents
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className="flex flex-col items-center justify-center rounded border-2 border-dashed p-10 transition-colors"
        style={{
          borderColor: dragOver ? "var(--accent)" : "var(--border)",
          background: dragOver ? "var(--card)" : "transparent",
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
      >
        <svg className="h-8 w-8 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="var(--muted)">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          Drop documents here or click to upload
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          Supports PDF, XLSX, CSV, SWIFT MT messages, and images
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Processed Today</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--foreground)" }}>24</p>
        </div>
        <div className="rounded border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Fields Extracted</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--foreground)" }}>312</p>
        </div>
        <div className="rounded border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Avg. Confidence</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "#3d8c5c" }}>96.2%</p>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Recent Documents</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              {["Document", "Type", "Fields Extracted", "Confidence", "Status", "Date"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="transition-colors cursor-pointer"
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--background)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td className="px-5 py-3">
                  <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{doc.name}</p>
                  <p className="text-[11px]" style={{ color: "var(--muted)" }}>{doc.id}</p>
                </td>
                <td className="px-5 py-3 text-[13px]" style={{ color: "var(--muted)" }}>{doc.type}</td>
                <td className="px-5 py-3 text-[13px] tabular-nums" style={{ color: "var(--foreground)" }}>
                  {doc.extracted ?? "—"}
                </td>
                <td className="px-5 py-3 text-[13px] tabular-nums" style={{ color: doc.confidence >= 95 ? "#3d8c5c" : doc.confidence ? "#c4913b" : "var(--muted)" }}>
                  {doc.confidence ? `${doc.confidence}%` : "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className="rounded-sm px-2 py-0.5 text-[11px] font-medium"
                    style={{ background: statusStyles[doc.status].bg, color: statusStyles[doc.status].color }}
                  >
                    {statusStyles[doc.status].label}
                  </span>
                </td>
                <td className="px-5 py-3 text-[13px] tabular-nums" style={{ color: "var(--muted)" }}>{doc.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
