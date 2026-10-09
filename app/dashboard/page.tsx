"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StoryData, Profile, CreditLedgerEntry } from "@/lib/types/manga";

export default function DashboardPage() {
  const [stories, setStories] = useState<StoryData[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Manga Library</h1>
                <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-400">
                  {profile?.plan ? profile.plan.toUpperCase().replace("_", " ") : "PRO STUDIO"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Your serialized manga one-shots, character concept sheets, and chapter readers.
              </p>
            </div>

            <Link
              href="/new"
              className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-all self-start sm:self-auto shadow-sm"
            >
              Create New Manga
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-1">
              <span className="text-xs font-medium text-zinc-400">Available Credits</span>
              <div className="text-2xl font-bold text-white">{profile?.credits ?? 8}</div>
              <span className="text-[11px] text-zinc-500 block">
                Ready for ~{profile?.credits ?? 8} serialized manga pages
              </span>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-1">
              <span className="text-xs font-medium text-zinc-400">Total Projects</span>
              <div className="text-2xl font-bold text-white">{stories.length}</div>
              <span className="text-[11px] text-zinc-500 block">Saved in isolated Neon database</span>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-1">
              <span className="text-xs font-medium text-zinc-400">2D Staging Engine</span>
              <div className="text-sm font-semibold text-emerald-400 flex items-center gap-2 pt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active & Ready
              </div>
              <span className="text-[11px] text-zinc-500 block">
                Atmospheric night scenes & character locking
              </span>
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">
                Manga Chapters ({stories.length})
              </h2>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-zinc-500">
                Loading library...
              </div>
            ) : stories.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-3">
                <p className="text-sm text-zinc-400">No manga chapters forged yet.</p>
                <Link
                  href="/new"
                  className="inline-flex rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500"
                >
                  Create Your First Story
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {stories.map((story) => {
                  const firstPanelImage =
                    story.pages?.[0]?.panels?.[0]?.imageUrl ||
                    story.characters?.[0]?.refImageUrl;

                  return (
                    <div
                      key={story.id}
                      className="group flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-zinc-700 transition-all hover:shadow-xl"
                    >
                      {/* Cover Preview Image */}
                      <Link
                        href={`/stories/${story.id}`}
                        className="relative aspect-video bg-zinc-950 block overflow-hidden border-b border-zinc-800/80"
                      >
                        {firstPanelImage ? (
                          <img
                            src={firstPanelImage}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 font-mono">
                            PROCESSING COVER
                          </div>
                        )}

                        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                          <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono font-semibold text-white">
                            {story.pages?.length || story.targetPages} PAGES
                          </span>
                          <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono font-semibold text-rose-400 uppercase">
                            {story.style}
                          </span>
                        </div>
                      </Link>

                      {/* Content Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <Link
                            href={`/stories/${story.id}`}
                            className="text-base font-bold text-white hover:text-rose-400 transition-colors line-clamp-1"
                          >
                            {story.title}
                          </Link>
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {story.logline || story.body}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                          <div className="flex gap-2">
                            <Link
                              href={`/stories/${story.id}`}
                              className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                            >
                              Read Manga
                            </Link>
                            <Link
                              href={`/stories/${story.id}`}
                              className="rounded-lg border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                            >
                              Studio
                            </Link>
                          </div>

                          <button
                            onClick={() => handleDeleteStory(story.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors text-xs"
                            title="Delete Project"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
