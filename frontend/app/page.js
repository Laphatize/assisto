"use client";

import { useAuth } from "@/lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm dark:bg-zinc-900">
        {user ? (
          <>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Welcome{user.displayName ? `, ${user.displayName}` : ""}
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => signOut(auth)}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Tartan
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Sign in or create an account to get started.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="flex w-full items-center justify-center rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Create account
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
