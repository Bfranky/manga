"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MangaPageViewer from "@/components/MangaPageViewer";
import { SAMPLE_STORIES } from "@/lib/sample-data";
import { STYLE_PROMPTS } from "@/lib/ai/prompts";

export default function LandingPage() {
  const [selectedDemoStory] = useState(SAMPLE_STORIES[0]);
  const styles = Object.keys(STYLE_PROMPTS);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Minimalist Sub-heading */}
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1 text-xs font-mono text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>STORY TO 2D MANGA SERIALIZATION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Turn your stories into 2D manga chapters. <br />
              <span className="text-zinc-400">Read on-screen or download PDF.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
              MangaForge breaks down written story scenes into multi-page manga with background staging, locked character models, and crisp vector speech balloons.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/new"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-rose-600 px-6 py-3 text-xs font-semibold text-white hover:bg-rose-500 transition-all shadow-sm"
              >
                Create Manga Now
              </Link>

              <Link
                href="/stories/demo-story-01"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all"
              >
                Open Interactive Reader Demo
              </Link>
            </div>

            {/* Feature Value Props Grid */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-1">
                <h4 className="text-xs font-bold text-white">2D Background Staging</h4>
                <p className="text-[11px] text-zinc-400">Night cityscapes, street lights, and shrines</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-1">
                <h4 className="text-xs font-bold text-white">On-Screen Reader</h4>
                <p className="text-[11px] text-zinc-400">Vertical scroll & Japanese tankobon flip</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-1">
                <h4 className="text-xs font-bold text-white">Character Model Locking</h4>
                <p className="text-[11px] text-zinc-400">Locked appearance across all panels</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-1">
                <h4 className="text-xs font-bold text-white">Instant PDF Export</h4>
                <p className="text-[11px] text-zinc-400">Download printable high-res chapters</p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE READER SHOWCASE */}
        <section className="py-12 border-t border-zinc-900 bg-zinc-950/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono text-zinc-500 font-medium">LIVE READER DEMO</span>
              <h2 className="text-2xl font-bold text-white">
                Read Serialized Chapters Directly On-Screen
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl mx-auto">
                Test the multi-mode reader below. Switch between Single Page, Double Spread, or Continuous Vertical Scroll.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-6 shadow-2xl">
              <MangaPageViewer
                pages={selectedDemoStory.pages}
                title={selectedDemoStory.title}
                readingDirection={selectedDemoStory.readingDirection}
                colorMode={selectedDemoStory.colorMode}
                readOnly={true}
              />
            </div>
          </div>
        </section>

        {/* ART STYLES SECTION */}
        <section className="py-16 border-t border-zinc-900">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono text-zinc-500 font-medium">RENDERING STYLES</span>
              <h2 className="text-2xl font-bold text-white">
                8 Distinct Manga Aesthetics
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl mx-auto">
                From high-energy shonen speedlines to dark cyberpunk neon metropolis staging.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {styles.map((styleKey) => {
                const conf = (STYLE_PROMPTS as any)[styleKey];
                return (
                  <div
                    key={styleKey}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{conf.name}</h4>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{styleKey}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{conf.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
