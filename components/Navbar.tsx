"use client";

import React, { useState } from "react";
import Link from "next/link";
import CreditBadge from "./CreditBadge";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo - Sleek & Professional */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700/70 text-zinc-100 group-hover:border-rose-500/80 transition-colors">
            <svg
              className="h-5 w-5 text-rose-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white">
              MANGA<span className="text-rose-500">FORGE</span>
            </span>
            <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 border border-zinc-700/50">
              STUDIO
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links - Clean & Uncluttered Typography */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Library
          </Link>
          <Link
            href="/new"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Studio
          </Link>
          <Link
            href="/stories/demo-story-01"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Reader Demo
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-3">
          {/* Clean Credit Status */}
          <CreditBadge />

          <Link
            href="/new"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-all active:scale-95 shadow-sm"
          >
            Create Manga
          </Link>

          {/* User Account Pill */}
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:border-zinc-600 transition-colors"
          >
            BF
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800/80 bg-zinc-950 px-4 py-3 space-y-2">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900"
          >
            Library
          </Link>
          <Link
            href="/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900"
          >
            Studio
          </Link>
          <Link
            href="/stories/demo-story-01"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900"
          >
            Reader Demo
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900"
          >
            Pricing
          </Link>
          <Link
            href="/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white mt-2"
          >
            Create Manga
          </Link>
        </div>
      )}
    </header>
  );
}
