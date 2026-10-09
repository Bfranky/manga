import { BubbleType, DialogueItem } from "../types/manga";

export interface BubbleLayoutProps {
  dialogue: DialogueItem;
  index: number;
  totalDialogue: number;
  panelWidth?: number;
  panelHeight?: number;
}

/**
 * Calculates responsive position for bubbles if not explicitly pinned
 */
export function calculateBubblePosition(index: number, total: number): { top: string; left: string; right?: string } {
  if (total === 1) {
    return { top: "8%", left: "10%" };
  }
  if (total === 2) {
    if (index === 0) return { top: "8%", left: "8%" };
    return { top: "55%", left: "45%" };
  }
  if (total === 3) {
    if (index === 0) return { top: "6%", left: "6%" };
    if (index === 1) return { top: "38%", left: "45%" };
    return { top: "68%", left: "12%" };
  }
  const row = Math.floor(index / 2);
  const col = index % 2;
  return {
    top: `${8 + row * 38}%`,
    left: `${6 + col * 48}%`,
  };
}

/**
 * Returns dynamic font size based on text length to guarantee text never overflows speech balloon
 */
export function getBubbleFontSize(text: string): { fontSize: string; lineHeight: string } {
  const len = text.length;
  if (len < 20) return { fontSize: "0.85rem", lineHeight: "1.15" };
  if (len < 45) return { fontSize: "0.75rem", lineHeight: "1.1" };
  if (len < 80) return { fontSize: "0.68rem", lineHeight: "1.05" };
  return { fontSize: "0.60rem", lineHeight: "1.0" };
}

/**
 * Generates SVG Path definition for shout action bubble bursts
 */
export function generateShoutBurstPath(w: number, h: number): string {
  const points = [
    [w * 0.1, h * 0.15],
    [w * 0.25, 0],
    [w * 0.4, h * 0.12],
    [w * 0.6, 0],
    [w * 0.75, h * 0.15],
    [w, h * 0.1],
    [w * 0.88, h * 0.35],
    [w, h * 0.55],
    [w * 0.86, h * 0.75],
    [w * 0.95, h],
    [w * 0.7, h * 0.85],
    [w * 0.5, h],
    [w * 0.35, h * 0.85],
    [w * 0.15, h * 0.98],
    [w * 0.18, h * 0.75],
    [0, h * 0.5],
    [w * 0.12, h * 0.3],
  ];

  return `M ${points.map((p) => p.join(",")).join(" L ")} Z`;
}

/**
 * SFX visual styling presets
 */
export const SFX_PRESETS: Record<string, { color: string; stroke: string; transform: string; shadow: string }> = {
  BOOM: {
    color: "#ff2a2a",
    stroke: "#ffffff",
    transform: "rotate(-12deg) scale(1.2)",
    shadow: "drop-shadow(3px 3px 0 #000)",
  },
  SLASH: {
    color: "#00f0ff",
    stroke: "#000000",
    transform: "rotate(18deg) skewX(-15deg)",
    shadow: "drop-shadow(2px 2px 0 #fff)",
  },
  DODGE: {
    color: "#ffe600",
    stroke: "#000000",
    transform: "rotate(-6deg)",
    shadow: "drop-shadow(2px 2px 0 #000)",
  },
  CRASH: {
    color: "#ff5500",
    stroke: "#ffffff",
    transform: "rotate(8deg) scale(1.15)",
    shadow: "drop-shadow(3px 4px 0 #000)",
  },
  DEFAULT: {
    color: "#ffffff",
    stroke: "#000000",
    transform: "rotate(-8deg)",
    shadow: "drop-shadow(2px 2px 0 #000)",
  },
};
