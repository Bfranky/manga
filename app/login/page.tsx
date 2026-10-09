"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4">
      {/* Background aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-lg shadow-rose-900/40">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
                <Flame className="h-5 w-5 text-rose-500" />
              </div>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
              MANGA<span className="text-rose-500">FORGE</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white">Welcome back, Mangaka</h2>
          <p className="text-xs text-zinc-400">Sign in to access your manga library and credit ledger.</p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-3.5 text-xs text-rose-300 flex items-center justify-between">
          <span>✨ One-click demo sign-in active</span>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-lg bg-rose-600 px-3 py-1 font-bold text-white shadow hover:bg-rose-500 transition-colors"
          >
            Demo Enter
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="blessed@mangaforge.app"
              className="w-full rounded-xl bg-zinc-950 px-3.5 py-2.5 text-xs text-white border border-zinc-800 focus:border-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-zinc-950 px-3.5 py-2.5 text-xs text-white border border-zinc-800 focus:border-rose-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign In to MangaForge</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-rose-400 hover:underline">
            Sign up for 3 free credits
          </Link>
        </div>
      </div>
    </div>
  );
}
