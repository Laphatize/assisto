"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-sm" style={{ background: "var(--accent)" }}>
            <span className="text-lg font-bold text-white">T</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            Tartan
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            AI-powered back-office operations for financial services
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-sm px-4 py-2.5 text-sm font-medium text-white transition-colors"
            style={{ background: "var(--accent)" }}
            onMouseEnter={(e) => e.target.style.background = "var(--accent-hover)"}
            onMouseLeave={(e) => e.target.style.background = "var(--accent)"}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex w-full items-center justify-center rounded-sm border px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--foreground)", background: "var(--card)" }}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
