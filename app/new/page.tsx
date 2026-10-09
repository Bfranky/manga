"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryForm from "@/components/StoryForm";
import { ColorMode, MangaArtStyle, ReadingDirection } from "@/lib/types/manga";
import { Sparkles, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function NewStoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(8);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch credits
    fetch("/api/credits")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.credits !== undefined) {
          setCredits(data.credits);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmitStory = async (params: {
    title: string;
    body: string;
    style: MangaArtStyle;
    colorMode: ColorMode;
    readingDirection: ReadingDirection;
    targetPages: number;
  }) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...params,
          userId: "user-demo",
        }),
      });

      const data = await response.json();

      if (data.success && data.storyId) {
        // Update local storage credit
        const newCredit = Math.max(0, credits - params.targetPages);
        localStorage.setItem("mangaforge_credits", newCredit.toString());
        // Redirect to story studio progress view
        router.push(`/stories/${data.storyId}`);
      } else {
        setErrorMessage(data.error || "Failed to start generation.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Available Credits: {credits}
            </span>
          </div>

          {/* Page Heading */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400">
              <Sparkles className="h-3.5 w-3.5" />
              Manga Story Forge Wizard
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Create a New Manga One-Shot
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Write or paste your story narrative below, select an art style, and let the AI pipeline adapt it into a multi-page A5 manga PDF.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-red-500/40 bg-red-950/40 p-4 text-xs font-semibold text-red-300 animate-in shake">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Story Creation Form */}
          <StoryForm
            onSubmitStory={handleSubmitStory}
            isSubmitting={isSubmitting}
            userCredits={credits}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
