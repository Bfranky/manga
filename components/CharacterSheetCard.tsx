"use client";

import React, { useState } from "react";
import { CharacterData, ColorMode, MangaArtStyle } from "@/lib/types/manga";

interface CharacterSheetCardProps {
  character: CharacterData;
  style?: MangaArtStyle;
  colorMode?: ColorMode;
  onApprove?: (charId: string) => void;
  onRegenerate?: (charId: string) => Promise<void>;
  readOnly?: boolean;
}

export default function CharacterSheetCard({
  character,
  onApprove,
  onRegenerate,
  readOnly = false,
}: CharacterSheetCardProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegen = async () => {
    if (!onRegenerate || isRegenerating) return;
    setIsRegenerating(true);
    try {
      await onRegenerate(character.id);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-all">
      {/* Model Sheet Image Frame */}
      <div className="relative w-full sm:w-48 h-60 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0">
        {character.refImageUrl ? (
          <img
            src={character.refImageUrl}
            alt={character.name}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500 font-mono">
            GENERATING SHEET...
          </div>
        )}

        <div className="absolute top-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[9px] font-mono text-zinc-300 border border-zinc-700/60">
          LOCKED MODEL
        </div>

        {!readOnly && onRegenerate && (
          <button
            onClick={handleRegen}
            disabled={isRegenerating}
            className="absolute bottom-2 right-2 rounded bg-black/80 hover:bg-black text-white px-2 py-1 text-[10px] font-semibold border border-zinc-700 transition-colors"
          >
            {isRegenerating ? "Redrawing..." : "Redraw"}
          </button>
        )}
      </div>

      {/* Character Details */}
      <div className="flex flex-col justify-between flex-1 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold">
                {character.role}
              </span>
              <h3 className="text-base font-bold text-white">{character.name}</h3>
            </div>

            {character.isApproved && (
              <span className="rounded bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                LOCKED ✓
              </span>
            )}
          </div>

          <div className="mt-3 space-y-2">
            <div className="rounded-lg bg-zinc-950/80 p-2.5 border border-zinc-800">
              <span className="block text-[10px] font-mono uppercase text-zinc-500 mb-0.5">
                VISUAL APPEARANCE PROFILE
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{character.appearance}</p>
            </div>

            <div className="rounded-lg bg-zinc-950/80 p-2.5 border border-zinc-800">
              <span className="block text-[10px] font-mono uppercase text-zinc-500 mb-0.5">
                SIGNATURE OUTFIT (LOCKED)
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{character.outfit}</p>
            </div>
          </div>
        </div>

        {!readOnly && onApprove && !character.isApproved && (
          <div className="pt-2 border-t border-zinc-800 flex justify-end">
            <button
              type="button"
              onClick={() => onApprove(character.id)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              Approve Model Checkpoint
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
