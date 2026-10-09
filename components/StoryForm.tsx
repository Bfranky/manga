"use client";

import React, { useState } from "react";
import { ColorMode, MangaArtStyle, ReadingDirection } from "@/lib/types/manga";
import StylePicker from "./StylePicker";
import { PRESET_STORY_TEMPLATES } from "../lib/sample-data";
import { calculateStoryCreditCost } from "../lib/credits";
import { Sparkles, BookOpen, Compass, Zap, Layers, ArrowRight, Wand2 } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Preset Story Inspiration Chips */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Wand2 className="h-3.5 w-3.5 text-rose-400" />
          <span>Quick Test Inspirations (One-click presets):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_STORY_TEMPLATES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:border-rose-500/60 hover:text-white hover:bg-zinc-850 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Title & Story Body Input */}
      <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl">
        <div>
          <label className="block text-sm font-bold text-zinc-100 mb-1.5">
            Manga Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Shadow Blade: The Crimson Rift"
            className="w-full rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white border border-zinc-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-zinc-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold text-zinc-100">
              Story Prompt / Script Narrative <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-zinc-400 font-mono">
              {wordCount} words • {body.length} chars
            </span>
          </div>

          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste your story, scene, or comic outline here. Claude LLM will automatically extract consistent characters, pace pages, frame camera angles, and format speech balloons..."
            rows={7}
            className="w-full rounded-2xl bg-zinc-950 p-4 text-sm text-zinc-200 border border-zinc-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all resize-y placeholder:text-zinc-600 leading-relaxed font-sans"
          />
          <p className="text-[11px] text-zinc-400 mt-1.5">
            💡 Tip: Mention key characters by name and describe the climactic action. Dialogue in quotes will be converted into authentic manga speech bubbles.
          </p>
        </div>
      </div>

      {/* Art Style Picker */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl">
        <StylePicker
          selectedStyle={style}
          onSelectStyle={setStyle}
          colorMode={colorMode}
          onChangeColorMode={setColorMode}
        />
      </div>

      {/* Manga Format & Layout Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reading Direction */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl space-y-3">
          <div>
            <label className="block text-sm font-bold text-zinc-100">
              Reading Direction
            </label>
            <p className="text-xs text-zinc-400">
              Right-to-left matches authentic Japanese tankobon manga volume order.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setReadingDirection("rtl")}
              className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                readingDirection === "rtl"
                  ? "border-rose-500 bg-rose-950/20 text-white ring-1 ring-rose-500/30"
                  : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <span className="font-bold text-xs text-white">Right-to-Left (RTL)</span>
              <span className="text-[10px] text-zinc-400 mt-0.5">Traditional Japanese Manga</span>
            </button>

            <button
              type="button"
              onClick={() => setReadingDirection("ltr")}
              className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                readingDirection === "ltr"
                  ? "border-rose-500 bg-rose-950/20 text-white ring-1 ring-rose-500/30"
                  : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <span className="font-bold text-xs text-white">Left-to-Right (LTR)</span>
              <span className="text-[10px] text-zinc-400 mt-0.5">Western Graphic Novel</span>
            </button>
          </div>
        </div>

        {/* Target Pages */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-bold text-zinc-100">
                Target Page Count
              </label>
              <p className="text-xs text-zinc-400">
                Paces your story across 1 to 6 multi-panel pages.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {creditCost} Credit{creditCost > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {[1, 2, 4, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setTargetPages(num)}
                className={`py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                  targetPages === num
                    ? "border-rose-500 bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-600/30"
                    : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {num} {num === 1 ? "Page" : "Pages"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Credit & Submit Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/30 via-zinc-900/80 to-zinc-950 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <Zap className="h-5 w-5 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white">
                Generation Cost: {creditCost} Credits
              </span>
              <span className="text-xs text-zinc-400">
                (Your Balance: {userCredits} Credits)
              </span>
            </div>
            <span className="text-xs text-zinc-400">
              Includes character locking, script generation, panel art, lettering & A5 PDF.
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!body.trim() || isSubmitting || !hasSufficientCredits}
          className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 px-7 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 hover:opacity-95 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Forging Manga...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Forge Manga PDF</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
