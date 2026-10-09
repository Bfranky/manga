"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Sparkles, ArrowRight, Zap } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
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
          <h2 className="text-xl font-bold text-white">Join MangaForge</h2>
          <p className="text-xs text-zinc-400">Get 3 free generation credits on signup.</p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-bold text-amber-300 flex items-center justify-center gap-2">
          <Zap className="h-4 w-4 fill-amber-400" />
          <span>Includes 3 Free Manga Page Credits</span>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 uppercase">Mangaka Name / Handle</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Blessed"
              className="w-full rounded-xl bg-zinc-950 px-3.5 py-2.5 text-xs text-white border border-zinc-800 focus:border-rose-500 outline-none"
            />
          </div>

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
            className="w-full rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Create Free Account (+3 Credits)</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-rose-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
