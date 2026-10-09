"use client";

import React from "react";
import { ColorMode, MangaArtStyle } from "@/lib/types/manga";
import { STYLE_PROMPTS } from "@/lib/ai/prompts";

interface StylePickerProps {
  selectedStyle: MangaArtStyle;
  onSelectStyle: (style: MangaArtStyle) => void;
  colorMode?: ColorMode;
  onChangeColorMode?: (mode: ColorMode) => void;
}

const STYLE_BADGES: Record<MangaArtStyle, { tag: string; bgGrad: string }> = {
  shonen: { tag: "High Energy Action", bgGrad: "from-orange-500 to-rose-600" },
  seinen: { tag: "Gritty Noir Inking", bgGrad: "from-zinc-500 to-zinc-700" },
  shojo: { tag: "Ethereal & Romantic", bgGrad: "from-pink-500 to-rose-500" },
  chibi: { tag: "Comedic 4-Koma", bgGrad: "from-amber-400 to-amber-600" },
  cyberpunk: { tag: "Sci-Fi Metropolis", bgGrad: "from-cyan-500 to-blue-600" },
  "dark-fantasy": { tag: "Gothic & Eldritch", bgGrad: "from-purple-600 to-slate-800" },
  "retro-90s": { tag: "Vintage 90s Anime", bgGrad: "from-indigo-500 to-purple-700" },
  webtoon: { tag: "Korean Manhwa", bgGrad: "from-emerald-500 to-teal-700" },
};

export default function StylePicker({
  selectedStyle,
  onSelectStyle,
}: StylePickerProps) {
  const styles = Object.keys(STYLE_PROMPTS) as MangaArtStyle[];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {styles.map((styleKey) => {
        const config = STYLE_PROMPTS[styleKey];
        const badge = STYLE_BADGES[styleKey];
        const isSelected = selectedStyle === styleKey;

        return (
          <button
            key={styleKey}
            type="button"
            onClick={() => onSelectStyle(styleKey)}
            className={`relative text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
              isSelected
                ? "border-rose-500 bg-zinc-900 shadow-sm"
                : "border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/60"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">
                  {config.name}
                </h4>
                {isSelected && (
                  <span className="text-rose-500 text-xs font-bold">✓</span>
                )}
              </div>
              <span className="text-[10px] font-mono text-zinc-500 block">
                {badge.tag}
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
              {config.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
