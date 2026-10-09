"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MangaPageViewer from "@/components/MangaPageViewer";
import { StoryData } from "@/lib/types/manga";
import { exportMangaPDF } from "@/lib/pdf/exporter";
import { ArrowLeft, Download, Flame, Sparkles } from "lucide-react";

export default function PublicShareReaderPage() {
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "demo-story-01";
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [exportingPDF, setExportingPDF] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/stories/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.story) {
          setStory(data.story);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Manga Not Found</h2>
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-bold text-white">
              <ArrowLeft className="h-4 w-4" /> Go to MangaForge Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400 uppercase">
                {story.style} MANGA
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">{story.title}</h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{story.logline || story.body}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPDF}
                disabled={exportingPDF}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer"
              >
                <Download className="h-4 w-4" />
                {exportingPDF ? "Generating PDF..." : "Download PDF"}
              </button>

              <Link
                href="/new"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-700"
              >
                <Sparkles className="h-4 w-4 text-rose-400" />
                Create Your Own
              </Link>
            </div>
          </div>

          {/* Reader Viewer */}
          <div className="flex justify-center">
            <MangaPageViewer
              pages={story.pages || []}
              title={story.title}
              readingDirection={story.readingDirection}
              colorMode={story.colorMode}
              readOnly={true}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
