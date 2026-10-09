"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressTimeline from "@/components/ProgressTimeline";
import CharacterSheetCard from "@/components/CharacterSheetCard";
import MangaPageViewer from "@/components/MangaPageViewer";
import { StoryData, DialogueItem } from "@/lib/types/manga";
import { exportMangaPDF } from "@/lib/pdf/exporter";

export default function StoryStudioPage() {
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "demo-story-01";
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"reader" | "studio" | "characters">("reader");
  const [exportingPDF, setExportingPDF] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Poll story state while not done or failed
  useEffect(() => {
    let interval: any = null;

    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/stories/${id}`);
        const data = await res.json();
        if (data.success && data.story) {
          setStory(data.story);
          setLoading(false);

          if (data.story.status === "done" || data.story.status === "failed") {
            if (interval) clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Failed to load story:", err);
      }
    };

    fetchStory();
    interval = setInterval(fetchStory, 2000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id]);

  const handleApproveCheckpoint = async () => {
    try {
      const res = await fetch(`/api/stories/${id}/approve`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.story) {
        setStory(data.story);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDialogue = async (
    panelId: string,
    dialogue: DialogueItem[],
    caption?: string,
    sfx?: string
  ) => {
    try {
      await fetch(`/api/panels/${panelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dialogue, caption, sfx }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegeneratePanel = async (panelId: string) => {
    try {
      const res = await fetch(`/api/panels/${panelId}/regenerate`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.panel && story) {
        const nextPages = (story.pages || []).map((page) => ({
          ...page,
          panels: page.panels.map((p) => (p.id === panelId ? data.panel : p)),
        }));
        setStory({ ...story, pages: nextPages });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!story) return;
    setExportingPDF(true);
    try {
      const pdfBlobUrl = await exportMangaPDF(story);
      const a = document.createElement("a");
      a.href = pdfBlobUrl;
      a.download = `${story.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-manga.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF Export Error:", err);
    } finally {
      setExportingPDF(false);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading && !story) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 bg-zinc-900/60 p-8 rounded-2xl border border-zinc-800 max-w-sm w-full text-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
            <span className="text-sm font-semibold text-white">Loading Manga Studio</span>
            <p className="text-xs text-zinc-400">Fetching storyboard frames, character consistency models, and speech bubbles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="space-y-4 max-w-md bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800">
            <h2 className="text-lg font-bold text-white">Story Not Found</h2>
            <p className="text-xs text-zinc-400">This manga project may have been removed or the URL is incorrect.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Return to Library
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isDone = story.status === "done";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div className="flex items-start sm:items-center gap-3">
              <Link
                href="/dashboard"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 text-xs font-medium"
                title="Back to Library"
              >
                ←
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">{story.title}</h1>
                  <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400 uppercase border border-zinc-800">
                    {story.style}
                  </span>
                  <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400 uppercase border border-zinc-800">
                    {story.colorMode === "bw" ? "B&W" : "Color"}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-1 max-w-2xl">
                  {story.logline || story.body}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyShareLink}
                className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              >
                {copiedLink ? "Link Copied ✓" : "Share"}
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={exportingPDF || !isDone}
                className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
              >
                {exportingPDF ? "Exporting PDF..." : "Download PDF"}
              </button>
            </div>
          </div>

          {/* Pipeline Progress Indicator if Still Generating */}
          {!isDone && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Generating Manga Pipeline</span>
                <span className="font-mono text-zinc-400">{story.progress}%</span>
              </div>
              <ProgressTimeline status={story.status} />
              <p className="text-xs text-zinc-400">
                Generating 2D manga scenes with background staging, locking character consistency, and rendering vector speech bubbles...
              </p>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-zinc-800">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("reader")}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "reader"
                    ? "border-rose-500 text-white font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Read On-Screen
              </button>
              <button
                onClick={() => setActiveTab("characters")}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "characters"
                    ? "border-rose-500 text-white font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Characters ({story.characters?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("studio")}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "studio"
                    ? "border-rose-500 text-white font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Script & Panels
              </button>
            </div>

            <div className="text-xs text-zinc-500 font-mono hidden sm:block">
              {story.pages?.length || 0} Pages Generated
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "reader" && (
            <div className="space-y-4">
              <MangaPageViewer
                pages={story.pages || []}
                title={story.title}
                readingDirection={story.readingDirection}
                colorMode={story.colorMode}
                onUpdatePanelDialogue={handleUpdateDialogue}
                onRegeneratePanel={handleRegeneratePanel}
                onDownloadPDF={handleDownloadPDF}
                isExportingPDF={exportingPDF}
              />
            </div>
          )}

          {activeTab === "characters" && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400">
                2D character concept model sheets generated for prompt locking and scene consistency.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {story.characters.map((char) => (
                  <CharacterSheetCard key={char.id} character={char} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "studio" && (
            <div className="space-y-6">
              {/* Original Story Body */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
                <span className="text-xs font-mono text-zinc-400 font-medium">ORIGINAL NARRATIVE BODY</span>
                <p className="text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
                  {story.body}
                </p>
              </div>

              {/* Panel Breakdown List */}
              <div className="space-y-4">
                <span className="text-xs font-mono text-zinc-400 font-medium">PAGE & PANEL BREAKDOWN</span>
                {story.pages.map((page) => (
                  <div key={page.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <span className="text-xs font-bold text-white">PAGE {page.pageNo}</span>
                      <span className="text-[11px] font-mono text-zinc-400">Layout: {page.layout}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {page.panels.map((panel) => (
                        <div key={panel.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                          <div className="aspect-video bg-zinc-900 rounded overflow-hidden">
                            <img
                              src={panel.imageUrl}
                              alt={panel.scene}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                              <span>PANEL #{panel.panelNo}</span>
                              <span>{panel.camera}</span>
                            </div>
                            <p className="text-[11px] text-zinc-300 line-clamp-2">{panel.scene}</p>
                            {panel.dialogue && panel.dialogue.length > 0 && (
                              <div className="text-[10px] text-zinc-400 font-mono bg-zinc-900 p-1.5 rounded">
                                {panel.dialogue.map((d, i) => (
                                  <div key={i}>
                                    <span className="text-rose-400">{d.speaker}:</span> {d.text}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
