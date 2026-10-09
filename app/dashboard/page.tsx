"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StoryData, Profile, CreditLedgerEntry } from "@/lib/types/manga";
import {
  Plus,
  BookOpen,
  Sparkles,
  Zap,
  Trash2,
  Download,
  Flame,
  ArrowRight,
  Clock,
  Layers,
  History,
} from "lucide-react";

export default function DashboardPage() {
  const [stories, setStories] = useState<StoryData[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch stories & profile
    Promise.all([
      fetch("/api/stories").then((r) => r.json()),
      fetch("/api/credits").then((r) => r.json()),
    ])
      .then(([storyData, creditData]) => {
        if (storyData.success) setStories(storyData.stories || []);
        if (creditData.success) {
          setProfile({
            id: "user-demo",
            displayName: "Blessed Mangaka",
            email: "blessed@mangaforge.app",
            credits: creditData.credits,
            plan: creditData.plan || "mangaka_pro",
            createdAt: new Date().toISOString(),
          });
          setLedger(creditData.ledger || []);
        }
      })
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm("Are you sure you want to delete this manga project?")) return;
    try {
      const res = await fetch(`/api/stories/${storyId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStories(stories.filter((s) => s.id !== storyId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">Creator Dashboard</h1>
                <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-400">
                  {profile?.plan ? profile.plan.toUpperCase().replace("_", " ") : "PRO"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Manage your forged manga one-shots, character sheets, credit ledger, and exports.
              </p>
            </div>

            <Link
              href="/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-rose-600/30 hover:opacity-95 transition-all self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              Forge New Manga
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Available Credits
              </span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-amber-400">
                  {profile?.credits ?? 8}
                </span>
                <Link
                  href="/pricing"
                  className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                >
                  Top Up
                </Link>
              </div>
              <span className="text-[11px] text-zinc-500 block">
                Enough for ~{profile?.credits ?? 8} high-res manga pages
              </span>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Total Manga Projects
              </span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-white">{stories.length}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 text-rose-400">
                  <BookOpen className="h-4 w-4" />
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 block">All private and encrypted</span>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Consistency Engine
              </span>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Active & Locked
                </span>
                <span className="text-xs font-mono text-zinc-400">v1.0</span>
              </div>
              <span className="text-[11px] text-zinc-500 block">
                Claude LLM + Model Sheet conditioning
              </span>
            </div>
          </div>

          {/* Stories List Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-white">Your Manga Stories</h2>

            {stories.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-800 p-12 text-center space-y-3">
                <Flame className="h-8 w-8 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-300">No manga forged yet</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Create your very first manga one-shot from any written story or prompt.
                </p>
                <Link
                  href="/new"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow"
                >
                  <Plus className="h-4 w-4" />
                  Create First Manga
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {stories.map((story) => {
                  const firstPanel = story.pages?.[0]?.panels?.[0];
                  const thumbnail = firstPanel?.imageUrl || story.characters?.[0]?.refImageUrl;

                  return (
                    <div
                      key={story.id}
                      className="rounded-3xl border border-zinc-800 bg-zinc-900/40 overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-lg"
                    >
                      <div>
                        {/* Thumbnail preview */}
                        <div className="relative h-44 w-full bg-zinc-950 overflow-hidden border-b border-zinc-800">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={story.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-600 text-xs font-mono">
                              Generating Art...
                            </div>
                          )}

                          {/* Status badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-zinc-700">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                story.status === "done"
                                  ? "bg-emerald-400"
                                  : story.status === "failed"
                                  ? "bg-red-400"
                                  : "bg-rose-500 animate-pulse"
                              }`}
                            />
                            {story.status.toUpperCase().replace("_", " ")}
                          </div>

                          {/* Style tag */}
                          <div className="absolute top-3 right-3 rounded-md bg-rose-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow">
                            {story.style}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-2">
                          <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                            {story.title}
                          </h3>
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {story.logline || story.body}
                          </p>
                          <div className="flex items-center gap-3 pt-2 text-[11px] font-mono text-zinc-500">
                            <span>{story.targetPages} Pages</span>
                            <span>•</span>
                            <span>{story.colorMode.toUpperCase()} Mode</span>
                            <span>•</span>
                            <span>{story.readingDirection.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-zinc-800/80 mt-2">
                        <Link
                          href={`/stories/${story.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          Open Studio
                        </Link>

                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800"
                          title="Delete story"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Credit Ledger History Section */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <History className="h-4 w-4 text-amber-400" />
              <span>Credit Ledger & Transaction History</span>
            </div>

            <div className="space-y-2">
              {ledger.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/70 border border-zinc-850 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded-lg ${
                        entry.delta > 0
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                    </span>
                    <span className="font-medium text-zinc-300">{entry.reason}</span>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-500">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
