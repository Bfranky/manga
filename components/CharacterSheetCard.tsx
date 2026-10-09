"use client";

import React, { useState } from "react";
import { CharacterData, ColorMode, MangaArtStyle } from "@/lib/types/manga";
import { CheckCircle2, RefreshCw, User, Shield, Sparkles } from "lucide-react";

interface CharacterSheetCardProps {
  character: CharacterData;
  style: MangaArtStyle;
  colorMode: ColorMode;
  onApprove?: (charId: string) => void;
  onRegenerate?: (charId: string) => Promise<void>;
  readOnly?: boolean;
}

export default function CharacterSheetCard({
  character,
  style,
  colorMode,
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
    <div className="flex flex-col md:flex-row gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl hover:border-zinc-700 transition-all">
      {/* Model Sheet Image Frame */}
      <div className="relative w-full md:w-56 h-64 md:h-72 rounded-xl overflow-hidden border border-zinc-700/80 bg-zinc-950 shrink-0 group">
        {character.refImageUrl ? (
          <img
            src={character.refImageUrl}
            alt={character.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center flex-col gap-2 text-zinc-500">
            <User className="h-10 w-10 text-zinc-600" />
            <span className="text-xs">Generating Model Sheet...</span>
          </div>
        )}

        {/* Locked Design Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-amber-500/30">
          <Shield className="h-3 w-3 text-amber-400" />
          Consistency Locked
        </div>

        {/* Regenerate quick trigger */}
        {!readOnly && onRegenerate && (
          <button
            onClick={handleRegen}
            disabled={isRegenerating}
            title="Regenerate character reference sheet"
            className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900/90 text-zinc-200 hover:text-white hover:bg-rose-600 transition-colors shadow-md border border-zinc-700 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin text-rose-400" : ""}`} />
          </button>
        )}
      </div>

      {/* Character Details & Prompt Lock */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-rose-400">
                {character.role}
              </span>
              <h3 className="text-xl font-extrabold text-white">{character.name}</h3>
            </div>

            {character.isApproved && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approved Design
              </span>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-zinc-950/70 p-3 border border-zinc-800/80">
              <span className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                Visual Appearance Profile
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{character.appearance}</p>
            </div>

            <div className="rounded-xl bg-zinc-950/70 p-3 border border-zinc-800/80">
              <span className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                Signature Outfit (Locked per panel)
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{character.outfit}</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        {!readOnly && (
          <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
            <span className="text-xs text-zinc-400">
              {character.isApproved
                ? "This reference sheet is locked for panel generation."
                : "Approve this sheet to lock character traits for drawing."}
            </span>

            <div className="flex items-center gap-2">
              {onApprove && !character.isApproved && (
                <button
                  type="button"
                  onClick={() => onApprove(character.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Design Checkpoint
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
