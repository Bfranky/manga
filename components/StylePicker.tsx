"use client";

import React from "react";
import { ColorMode, MangaArtStyle } from "@/lib/types/manga";
import { STYLE_PROMPTS } from "@/lib/ai/prompts";
import { Sparkles, Palette, Check } from "lucide-react";

interface StylePickerProps {
  selectedStyle: MangaArtStyle;
  onSelectStyle: (style: MangaArtStyle) => void;
  colorMode: ColorMode;
  onChangeColorMode: (mode: ColorMode) => void;
}

const STYLE_BADGES: Record<MangaArtStyle, { tag: string; bgGrad: string }> = {
  shonen: { tag: "Action / High Energy", bgGrad: "from-orange-600 to-red-700" },
  seinen: { tag: "Mature / Gritty Inking", bgGrad: "from-zinc-700 to-stone-900" },
  shojo: { tag: "Romance / Ethereal", bgGrad: "from-pink-500 to-rose-700" },
  chibi: { tag: "Comedic / 4-Koma", bgGrad: "from-amber-400 to-yellow-600" },
  cyberpunk: { tag: "Sci-Fi / Mecha", bgGrad: "from-cyan-500 to-blue-700" },
  "dark-fantasy": { tag: "Gothic / Eldritch", bgGrad: "from-purple-800 to-slate-950" },
  "retro-90s": { tag: "Vintage 90s OVA", bgGrad: "from-indigo-600 to-purple-800" },
  webtoon: { tag: "Manhwa / Glossy", bgGrad: "from-emerald-500 to-teal-800" },
};

export default function StylePicker({
  selectedStyle,
  onSelectStyle,
  colorMode,
  onChangeColorMode,
}: StylePickerProps) {
  const styles = Object.keys(STYLE_PROMPTS) as MangaArtStyle[];

  return (
    <div className="space-y-5">
      {/* Header & Color Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-sm font-bold text-zinc-100">
            Manga Art Style & Rendering
          </label>
          <p className="text-xs text-zinc-400">
            Select the aesthetic style preset and inking mode for character & panel art.
          </p>
        </div>

        {/* Color Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChangeColorMode("bw")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              colorMode === "bw"
                ? "bg-zinc-100 text-zinc-950 shadow-md font-extrabold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-zinc-400" />
            B&W Screentone
          </button>
          <button
            type="button"
            onClick={() => onChangeColorMode("color")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              colorMode === "color"
                ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md font-extrabold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            Full Color
          </button>
        </div>
      </div>

      {/* Style Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {styles.map((styleKey) => {
          const config = STYLE_PROMPTS[styleKey];
          const badge = STYLE_BADGES[styleKey];
          const isSelected = selectedStyle === styleKey;

          return (
            <button
              key={styleKey}
              type="button"
              onClick={() => onSelectStyle(styleKey)}
              className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
                isSelected
                  ? "border-rose-500 bg-zinc-900/90 ring-2 ring-rose-500/30 shadow-lg shadow-rose-950/40"
                  : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70"
              }`}
            >
              {/* Active selection checkmark */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
              )}

              {/* Gradient Banner Top */}
              <div
                className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${badge.bgGrad} mb-3 group-hover:w-16 transition-all`}
              />

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                  {config.name}
                </h4>
                <span className="inline-block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">
                  {badge.tag}
                </span>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                  {config.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
