"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MangaPageViewer from "@/components/MangaPageViewer";
import { SAMPLE_STORIES } from "@/lib/sample-data";
import { STYLE_PROMPTS } from "@/lib/ai/prompts";
import {
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Zap,
  BookOpen,
  Layers,
  Palette,
  CheckCircle2,
  FileDown,
  MessageSquare,
  Users,
  Compass,
  Star,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const [selectedDemoStory, setSelectedDemoStory] = useState(SAMPLE_STORIES[0]);
  const styles = Object.keys(STYLE_PROMPTS);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
          {/* Subtle manga grid background dots & glowing radial aura */}
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-extrabold text-rose-400 shadow-lg shadow-rose-950/40 backdrop-blur-md">
              <Flame className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              <span>Version 1.0 Live • Story to Manga PDF Generation</span>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] text-rose-300">
                New
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
              Paste your story. <br className="hidden sm:inline" />
              Press generate. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                Get your Manga PDF.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
              MangaForge automatically turns your written stories into multi-page manga comics with
              <span className="text-zinc-200 font-semibold"> locked character consistency</span>,
              <span className="text-zinc-200 font-semibold"> dynamic panel grids</span>, and
              <span className="text-zinc-200 font-semibold"> crisp vector speech bubbles</span>.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="h-5 w-5" />
                <span>Create Your Manga Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/stories/demo-story-01"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-7 py-4 text-base font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all"
              >
                <BookOpen className="h-5 w-5 text-amber-400" />
                <span>Explore Live Manga Demo</span>
              </Link>
            </div>

            {/* Value Props Row */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Consistent Characters</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Reference sheets & prompt locks</p>
              </div>
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                <MessageSquare className="h-5 w-5 text-rose-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Zero Garbled Text</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Crisp SVG vector lettering</p>
              </div>
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                <Layers className="h-5 w-5 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Dynamic Grid Engine</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">L3A, L4A, L4B, L5A & Splash</p>
              </div>
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                <FileDown className="h-5 w-5 text-cyan-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Print-Ready PDF</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">A5 format with custom covers</p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE LIVE READER PREVIEW */}
        <section className="relative py-16 bg-zinc-900/30 border-y border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400">
                Interactive Reader Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Experience MangaForge Output
              </h2>
              <p className="text-sm text-zinc-400">
                Test the interactive page viewer, zoom controls, RTL reading order, and vector speech balloons.
              </p>
            </div>

            {/* Embedded Live Manga Page Viewer */}
            <div className="flex justify-center">
              <MangaPageViewer
                pages={selectedDemoStory.pages || []}
                title={selectedDemoStory.title}
                readingDirection={selectedDemoStory.readingDirection}
                colorMode={selectedDemoStory.colorMode}
                readOnly={true}
              />
            </div>
          </div>
        </section>

        {/* 4-STEP PIPELINE WORKFLOW */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              The Generation Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              From Plain Words to Manga in 4 Steps
            </h2>
            <p className="text-sm text-zinc-400">
              Built on a durable async pipeline ensuring quality at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-black text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-white">LLM Story Scripting</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Claude analyzes your story, extracts character profiles, plans page pacing, and writes punchy dialogue beats into structured JSON.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-black text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Character Model Sheets</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generates front-view turnaround reference images and locks signature hairstyles, facial marks, and outfits across every single panel.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-black text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Parallel Inking & Grids</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Image models draw panels in parallel without text. Predefined CSS grid templates (L3A, L4B, L5A) format panels cleanly into A5 pages.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-black text-lg">
                04
              </div>
              <h3 className="text-lg font-bold text-white">Vector Lettering & PDF</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Overlays SVG speech balloons, thought clouds, and SFX with auto-fit text. Assembles chapters into a downloadable A5 Manga PDF.
              </p>
            </div>
          </div>
        </section>

        {/* 8 ART STYLES SHOWCASE */}
        <section className="py-20 bg-zinc-900/40 border-t border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400">
                Curated Aesthetics
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Choose from 8 Legendary Manga Art Styles
              </h2>
              <p className="text-sm text-zinc-400">
                From high-octane Shonen battle manga to gritty Seinen ink and nostalgic 90s vintage.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {styles.map((styleKey) => {
                const style = STYLE_PROMPTS[styleKey as keyof typeof STYLE_PROMPTS];
                return (
                  <div
                    key={styleKey}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2 hover:border-zinc-700 transition-all"
                  >
                    <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-rose-500 to-amber-500" />
                    <h4 className="text-sm font-bold text-white">{style.name}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                      {style.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-24 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-rose-500/40 bg-gradient-to-b from-rose-950/40 via-zinc-900/80 to-zinc-950 p-10 sm:p-16 shadow-2xl space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Ready to see your story come to life?
            </h2>
            <p className="text-base text-zinc-400 max-w-xl mx-auto">
              Get started with 3 free bonus credits and generate your first complete manga one-shot in minutes.
            </p>
            <div className="pt-4">
              <Link
                href="/new"
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 px-9 py-4 text-base font-extrabold text-white shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles className="h-5 w-5" />
                <span>Start Forging Manga</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
