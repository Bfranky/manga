"use client";

import React from "react";
import { BubbleType, DialogueItem } from "@/lib/types/manga";
import {
  calculateBubblePosition,
  getBubbleFontSize,
  generateShoutBurstPath,
  SFX_PRESETS,
} from "../lib/lettering/bubbles";

interface SpeechBubbleProps {
  dialogue: DialogueItem;
  index: number;
  totalDialogue: number;
  onEdit?: () => void;
  isEditable?: boolean;
}

export default function SpeechBubble({
  dialogue,
  index,
  totalDialogue,
  onEdit,
  isEditable = false,
}: SpeechBubbleProps) {
  const { top, left } = calculateBubblePosition(index, totalDialogue);
  const { fontSize, lineHeight } = getBubbleFontSize(dialogue.text);

  const bubbleStyle: React.CSSProperties = {
    top: dialogue.positionY !== undefined ? `${dialogue.positionY}%` : top,
    left: dialogue.positionX !== undefined ? `${dialogue.positionX}%` : left,
    fontSize,
    lineHeight,
  };

  // Render Thought Cloud Bubble
  if (dialogue.type === "thought") {
    return (
      <div
        style={bubbleStyle}
        onClick={onEdit}
        className={`absolute z-20 max-w-[55%] min-w-[90px] rounded-2xl border-2 border-dashed border-zinc-950 bg-white/95 px-3 py-2 text-zinc-950 shadow-md backdrop-blur-xs select-none transition-transform ${
          isEditable ? "cursor-pointer hover:scale-105 hover:ring-2 hover:ring-rose-500" : ""
        }`}
      >
        <div className="font-extrabold text-[9px] uppercase tracking-wider text-zinc-500 mb-0.5">
          {dialogue.speaker} (thought)
        </div>
        <p className="font-serif italic font-medium">{dialogue.text}</p>
        
        {/* Thought trailing circles */}
        <div className="absolute -bottom-2.5 left-4 flex gap-1">
          <div className="h-2 w-2 rounded-full border border-zinc-900 bg-white" />
          <div className="h-1.5 w-1.5 rounded-full border border-zinc-900 bg-white" />
        </div>
      </div>
    );
  }

  // Render Shout Explosive Bubble Burst
  if (dialogue.type === "shout") {
    return (
      <div
        style={bubbleStyle}
        onClick={onEdit}
        className={`absolute z-20 max-w-[65%] min-w-[110px] rounded-xl border-3 border-zinc-950 bg-amber-50 px-3.5 py-2 text-zinc-950 shadow-xl select-none transition-transform ${
          isEditable ? "cursor-pointer hover:scale-105 hover:ring-2 hover:ring-rose-500" : ""
        }`}
      >
        <div className="font-black text-[9px] uppercase tracking-widest text-rose-600 mb-0.5 flex items-center gap-1">
          <span>⚡</span> {dialogue.speaker}
        </div>
        <p className="font-sans font-black uppercase tracking-tight text-zinc-950 drop-shadow-xs">
          {dialogue.text}
        </p>
      </div>
    );
  }

  // Render Caption Box
  if (dialogue.type === "caption") {
    return (
      <div
        style={bubbleStyle}
        onClick={onEdit}
        className={`absolute z-20 max-w-[70%] rounded-md border border-zinc-950 bg-zinc-900/90 text-zinc-100 px-3 py-1.5 shadow-lg backdrop-blur-xs select-none transition-transform ${
          isEditable ? "cursor-pointer hover:scale-105 hover:ring-2 hover:ring-rose-500" : ""
        }`}
      >
        <p className="font-mono text-[10px] leading-snug">{dialogue.text}</p>
      </div>
    );
  }

  // Default Speech Oval Bubble with Pointer Tail
  return (
    <div
      style={bubbleStyle}
      onClick={onEdit}
      className={`absolute z-20 max-w-[55%] min-w-[90px] rounded-[18px] border-2 border-zinc-950 bg-white px-3 py-2 text-zinc-950 shadow-lg select-none transition-transform ${
        isEditable ? "cursor-pointer hover:scale-105 hover:ring-2 hover:ring-rose-500" : ""
      }`}
    >
      <div className="font-bold text-[9px] uppercase tracking-wider text-zinc-500 mb-0.5">
        {dialogue.speaker}
      </div>
      <p className="font-sans font-bold text-zinc-950">{dialogue.text}</p>
      
      {/* Speech pointer tail */}
      <div className="absolute -bottom-2 left-5 h-0 w-0 border-x-6 border-x-transparent border-t-8 border-t-zinc-950" />
      <div className="absolute -bottom-1.5 left-5 h-0 w-0 border-x-5 border-x-transparent border-t-7 border-t-white" />
    </div>
  );
}

export function SFXOverlay({ sfx }: { sfx?: string }) {
  if (!sfx) return null;
  const upper = sfx.toUpperCase();
  const preset = SFX_PRESETS[upper] || SFX_PRESETS.DEFAULT;

  return (
    <div
      style={{
        transform: preset.transform,
        filter: preset.shadow,
      }}
      className="absolute bottom-4 right-4 z-20 pointer-events-none select-none font-black text-3xl sm:text-4xl tracking-tighter"
    >
      <span
        style={{
          color: preset.color,
          WebkitTextStroke: `1.5px ${preset.stroke}`,
        }}
        className="font-extrabold italic"
      >
        {sfx}
      </span>
    </div>
  );
}
