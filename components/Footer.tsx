import React from "react";
import Link from "next/link";
import { Flame, ShieldCheck, Zap, Heart, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-black">
              <Flame className="h-4 w-4 text-zinc-950" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white font-sans">
              MANGA<span className="text-rose-500">FORGE</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Turn plain-text stories into multi-page manga PDFs automatically with character consistency, dynamic layouts, and vector lettering.
          </p>
        </div>

        {/* Product Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Product</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/new" className="hover:text-rose-400 transition-colors">
                New Manga Creator
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-rose-400 transition-colors">
                Creator Dashboard
              </Link>
            </li>
            <li>
              <Link href="/stories/demo-story-01" className="hover:text-rose-400 transition-colors">
                Sample Showcase
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-rose-400 transition-colors">
                Credit Packs & Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* Technical Architecture */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Architecture</h4>
          <ul className="space-y-1.5 text-xs text-zinc-400">
            <li>Next.js App Router & Tailwind CSS</li>
            <li>Neon Postgres & Drizzle ORM</li>
            <li>Claude LLM Scripting Contract</li>
            <li>Reference Model Character Locking</li>
            <li>Vector SVG Speech Bubble Engine</li>
          </ul>
        </div>

        {/* Compliance & Security */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Security & Legal</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Creators own 100% of their stories and outputs. NDPR & GDPR compliant data retention.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
            <ShieldCheck className="h-4 w-4" />
            Zero-garble vector lettering guarantee
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <p>© 2026 MangaForge Engine. Built for Blessed. Version 1.0.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for storytellers worldwide.
        </p>
      </div>
    </footer>
  );
}
