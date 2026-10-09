"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, BookOpen, Plus, CreditCard, Flame, Moon, Library, Zap } from "lucide-react";
import CreditBadge from "./CreditBadge";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
              <Flame className="h-5 w-5 text-rose-500 group-hover:text-rose-400 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                MANGA<span className="bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">FORGE</span>
              </span>
              <span className="rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 -mt-1 hidden sm:block">
              Story to Manga PDF Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900/80 transition-colors"
          >
            <Library className="h-4 w-4 text-zinc-400" />
            Dashboard
          </Link>
          <Link
            href="/new"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900/80 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-rose-400" />
            Create Manga
          </Link>
          <Link
            href="/stories/demo-story-01"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900/80 transition-colors"
          >
            <BookOpen className="h-4 w-4 text-amber-400" />
            Sample Manga
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900/80 transition-colors"
          >
            <CreditCard className="h-4 w-4 text-emerald-400" />
            Pricing
          </Link>
        </nav>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-3">
          {/* Credit balance pill */}
          <CreditBadge />

          <Link
            href="/new"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 hover:opacity-95 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            New Manga
          </Link>

          {/* User Avatar */}
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700/60 text-xs font-bold text-zinc-200 hover:border-zinc-500 transition-colors"
          >
            BL
          </Link>
        </div>
      </div>
    </header>
  );
}
