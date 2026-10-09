"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressTimeline from "@/components/ProgressTimeline";
import CharacterSheetCard from "@/components/CharacterSheetCard";
import MangaPageViewer from "@/components/MangaPageViewer";
import { StoryData, DialogueItem } from "@/lib/types/manga";
import { exportMangaPDF } from "@/lib/pdf/exporter";
import {
  ArrowLeft,
  Download,
  Share2,
  Sparkles,
  BookOpen,
  UserCheck,
  Layers,
  CheckCircle2,
  RefreshCw,
  FileText,
  Copy,
  Check,
} from "lucide-react";

export default function StoryStudioPage() {
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "demo-story-01";
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"viewer" | "characters" | "script">("viewer");
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
        // Update local state
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
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
            <span className="text-xs font-mono text-zinc-400">Loading Manga Studio...</span>
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
          <div className="space-y-4 max-w-md">
            <h2 className="text-xl font-bold text-white">Story Not Found</h2>
            <p className="text-xs text-zinc-400">This manga project may have been deleted or the link is invalid.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-bold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
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

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Top Bar Navigation & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{story.title}</h1>
                  <span className="rounded-lg bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-300 uppercase border border-zinc-700">
                    {story.style}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                  {story.logline || story.body}
                </p>
              </div>
            </div>

            {/* Actions: Download PDF, Share Link */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedLink ? "Link Copied!" : "Share Link"}
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={!isDone || exportingPDF}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-rose-600/30 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {exportingPDF ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download A5 Manga PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Timeline Tracker (if generating or completed) */}
          <ProgressTimeline
            status={story.status}
            progress={story.progress}
            error={story.error}
            onApproveCheckpoint={handleApproveCheckpoint}
          />

          {/* Tab Navigation: Viewer, Character Sheets, Script Outline */}
          <div className="flex items-center gap-1 border-b border-zinc-800 pt-2">
            <button
              onClick={() => setActiveTab("viewer")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "viewer"
                  ? "border-rose-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Manga Pages & Lettering ({story.pages?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab("characters")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "characters"
                  ? "border-rose-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Character Reference Sheets ({story.characters?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab("script")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "script"
                  ? "border-rose-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Raw Script Outline
            </button>
          </div>

          {/* TAB 1: Manga Page Viewer */}
          {activeTab === "viewer" && (
            <div className="space-y-6 pt-2">
              <MangaPageViewer
                pages={story.pages || []}
                title={story.title}
                readingDirection={story.readingDirection}
                colorMode={story.colorMode}
                onUpdatePanelDialogue={handleUpdateDialogue}
                onRegeneratePanel={handleRegeneratePanel}
                readOnly={false}
              />
            </div>
          )}

          {/* TAB 2: Character Sheets */}
          {activeTab === "characters" && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Character Turnaround Sheets
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Locked visual descriptions ensure characters remain consistent in every panel.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(story.characters || []).map((char) => (
                  <CharacterSheetCard
                    key={char.id}
                    character={char}
                    style={story.style}
                    colorMode={story.colorMode}
                    onApprove={handleApproveCheckpoint}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Raw Story & Script Narrative */}
          {activeTab === "script" && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Raw Story Narrative</h3>
                <p className="text-xs text-zinc-400">
                  Original story provided to the Claude LLM script analyzer.
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-950 p-4 border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                {story.body}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
