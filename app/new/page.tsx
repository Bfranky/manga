"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryForm from "@/components/StoryForm";
import { ColorMode, MangaArtStyle, ReadingDirection } from "@/lib/types/manga";
import Link from "next/link";

export default function NewStoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(8);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
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
        const newCredit = Math.max(0, credits - params.targetPages);
        localStorage.setItem("mangaforge_credits", newCredit.toString());
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
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Top Breadcrumb & Status */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <Link
              href="/dashboard"
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Library
            </Link>

            <span className="text-xs font-mono text-zinc-400">
              Available Balance: <strong className="text-white">{credits} Credits</strong>
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-medium text-zinc-500 uppercase">
              STUDIO CREATION SUITE
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create New Manga Chapter
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Input your story narrative, setting descriptions, and characters. The studio pipeline adapts it into multi-page 2D manga panels with background staging and vector speech balloons.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs font-medium text-red-300">
              {errorMessage}
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
