"use client";

import React, { useState } from "react";
import { ColorMode, MangaArtStyle, ReadingDirection } from "@/lib/types/manga";
import StylePicker from "./StylePicker";
import { PRESET_STORY_TEMPLATES } from "../lib/sample-data";
import { calculateStoryCreditCost } from "../lib/credits";

interface StoryFormProps {
  onSubmitStory: (params: {
    title: string;
    body: string;
    style: MangaArtStyle;
    colorMode: ColorMode;
    readingDirection: ReadingDirection;
    targetPages: number;
  }) => void;
  isSubmitting?: boolean;
  userCredits?: number;
}

export default function StoryForm({
  onSubmitStory,
  isSubmitting = false,
  userCredits = 8,
}: StoryFormProps) {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [style, setStyle] = useState<MangaArtStyle>("shonen");
  const [colorMode, setColorMode] = useState<ColorMode>("bw");
  const [readingDirection, setReadingDirection] = useState<ReadingDirection>("rtl");
  const [targetPages, setTargetPages] = useState<number>(2);

  const wordCount = body.trim().length > 0 ? body.trim().split(/\s+/).length : 0;
  const creditCost = calculateStoryCreditCost(targetPages);
  const hasSufficientCredits = userCredits >= creditCost;

  const handleApplyPreset = (preset: (typeof PRESET_STORY_TEMPLATES)[0]) => {
    setTitle(preset.title);
    setBody(preset.body);
    setStyle(preset.style);
    setColorMode(preset.colorMode);
    setReadingDirection(preset.readingDirection);
    setTargetPages(preset.targetPages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || isSubmitting) return;

    onSubmitStory({
      title: title.trim() || "Untitled Manga",
      body: body.trim(),
      style,
      colorMode,
      readingDirection,
      targetPages,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preset Story Inspiration Chips */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-medium text-zinc-400">
          QUICK INSPIRATIONS
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_STORY_TEMPLATES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-all cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Title & Story Body Input */}
      <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-lg">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono mb-1.5">
            Manga Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Midnight Cyber Samurai"
            className="w-full rounded-lg bg-zinc-950 px-3.5 py-2.5 text-sm font-medium text-white border border-zinc-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-zinc-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
              Story Narrative
            </label>
            <span className="text-[11px] font-mono text-zinc-500">
              {wordCount} words
            </span>
          </div>
          <textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe your scene, character actions, and environmental atmosphere (e.g. In the night the city was bright with neon signs. Ren stood on the wet asphalt alleyway with katana drawn as sirens echoed in the distance...)"
            className="w-full rounded-lg bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-zinc-100 border border-zinc-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-zinc-600 font-sans resize-y"
            required
          />
        </div>
      </div>

      {/* Art Style Picker */}
      <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-lg">
        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
          Visual Style
        </label>
        <StylePicker selectedStyle={style} onSelectStyle={setStyle} />
      </div>

      {/* Format Options (Color Mode, Reading Direction, Page Count) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-lg">
        {/* Color Mode */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono mb-2">
            Inking / Color
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setColorMode("bw")}
              className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
                colorMode === "bw"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Classic B&W
            </button>
            <button
              type="button"
              onClick={() => setColorMode("color")}
              className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
                colorMode === "color"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Full Color
            </button>
          </div>
        </div>

        {/* Reading Direction */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono mb-2">
            Reading Flow
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setReadingDirection("rtl")}
              className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
                readingDirection === "rtl"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              RTL (Japanese)
            </button>
            <button
              type="button"
              onClick={() => setReadingDirection("ltr")}
              className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
                readingDirection === "ltr"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              LTR (Western)
            </button>
          </div>
        </div>

        {/* Target Pages */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono mb-2">
            Target Pages
          </label>
          <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {[1, 2, 4].map((pages) => (
              <button
                key={pages}
                type="button"
                onClick={() => setTargetPages(pages)}
                className={`rounded-md py-1.5 text-xs font-mono font-medium transition-colors ${
                  targetPages === pages
                    ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {pages}P
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-zinc-400">
          Cost: <span className="text-white font-semibold">{creditCost} Credits</span> ({userCredits} available)
        </div>

        <button
          type="submit"
          disabled={!body.trim() || isSubmitting || !hasSufficientCredits}
          className="w-full sm:w-auto rounded-lg bg-rose-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-40 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Forging Manga..." : "Forge Manga Chapter"}
        </button>
      </div>
    </form>
  );
}
