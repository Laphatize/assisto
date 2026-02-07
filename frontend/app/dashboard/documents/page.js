"use client";

import { useState, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const statusStyles = {
  processed: { bg: "#e8f5e9", color: "#2e7d32", label: "Processed" },
  processing: { bg: "#e3f2fd", color: "#1565c0", label: "Processing" },
  error: { bg: "#fce4ec", color: "#b54a4a", label: "Error" },
};

export default function DocumentsPage() {
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const fileRef = useRef(null);

  async function processFile(file) {
    setProcessing(true);
    const entry = {
      id: `DOC-${Date.now()}`,
      name: file.name,
      status: "processing",
      result: null,
    };
    setResults((prev) => [entry, ...prev]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API}/api/documents/process`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResults((prev) =>
        prev.map((r) =>
          r.id === entry.id ? { ...r, status: "processed", result: data } : r
        )
      );
    } catch (err) {
      setResults((prev) =>
        prev.map((r) =>
          r.id === entry.id ? { ...r, status: "error", result: { summary: err.message } } : r
        )
      );
    } finally {
      setProcessing(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) processFile(file);
  }

  const processedCount = results.filter((r) => r.status === "processed").length;
  const totalFields = results.reduce((sum, r) => sum + (r.result?.fields?.length || 0), 0);
  const avgConfidence = totalFields > 0
    ? (results.reduce((sum, r) => sum + (r.result?.fields || []).reduce((s, f) => s + (f.confidence || 0), 0), 0) / totalFields).toFixed(1)
    : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Documents</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          AI document processing — extract, validate, and classify financial documents
        </p>
      </div>

      <div
        className="flex flex-col items-center justify-center rounded border-2 border-dashed p-10 transition-colors cursor-pointer"
        style={{ borderColor: dragOver ? "var(--accent)" : "var(--border)", background: dragOver ? "var(--card)" : "transparent" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} accept=".pdf,.csv,.xlsx,.txt,.json,.xml" />
        <svg className="h-8 w-8 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="var(--muted)">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          {processing ? "Processing..." : "Drop documents here or click to upload"}
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Supports PDF, XLSX, CSV, TXT, JSON, XML</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Processed</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{processedCount}</p>
        </div>
        <div className="rounded border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Fields Extracted</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{totalFields}</p>
        </div>
        <div className="rounded border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Avg. Confidence</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "#3d8c5c" }}>{avgConfidence}{avgConfidence !== "—" && "%"}</p>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((doc) => (
            <div key={doc.id} className="rounded border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{doc.name}</p>
                  <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                    {doc.id} {doc.result?.document_type ? `— ${doc.result.document_type}` : ""}
                  </p>
                </div>
                <span className="rounded-sm px-2 py-0.5 text-[11px] font-medium"
                  style={{ background: statusStyles[doc.status].bg, color: statusStyles[doc.status].color }}>
                  {statusStyles[doc.status].label}
                </span>
              </div>

              {doc.result && doc.status === "processed" && (
                <div className="px-5 py-4 space-y-4">
                  <p className="text-sm" style={{ color: "var(--foreground)" }}>{doc.result.summary}</p>
                  {doc.result.fields?.length > 0 && (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                          <th className="pb-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Field</th>
                          <th className="pb-2 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Value</th>
                          <th className="pb-2 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {doc.result.fields.map((f, i) => (
                          <tr key={i}>
                            <td className="py-2 text-[13px]" style={{ color: "var(--muted)" }}>{f.field_name}</td>
                            <td className="py-2 text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{f.value}</td>
                            <td className="py-2 text-right text-[13px] tabular-nums" style={{ color: f.confidence >= 90 ? "#3d8c5c" : "#c4913b" }}>{f.confidence}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {doc.result.flags?.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Flags</p>
                      {doc.result.flags.map((flag, i) => (
                        <p key={i} className="text-xs" style={{ color: "#b54a4a" }}>{flag}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {doc.status === "processing" && (
                <div className="flex items-center gap-2 px-5 py-4">
                  <div className="h-3 w-3 animate-spin rounded-full border border-[var(--border)] border-t-[var(--accent)]" />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>Extracting fields with AI...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
