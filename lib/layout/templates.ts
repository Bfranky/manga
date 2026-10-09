import { LayoutTemplateId, ReadingDirection } from "../types/manga";

export interface PanelSlot {
  slotIndex: number; // 0-based index
  aspectRatio: "wide" | "tall" | "square" | "splash";
  gridArea: string;
  defaultCamera: string;
  isSplash?: boolean;
}

export interface LayoutTemplate {
  id: LayoutTemplateId;
  name: string;
  panelCount: number;
  description: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  slots: PanelSlot[];
}

export const LAYOUT_TEMPLATES: Record<LayoutTemplateId, LayoutTemplate> = {
  L1S: {
    id: "L1S",
    name: "Full Page Splash",
    panelCount: 1,
    description: "Single massive cinematic splash panel for peak climaxes, reveals, and iconic title moments.",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",
    slots: [
      {
        slotIndex: 0,
        aspectRatio: "splash",
        gridArea: "1 / 1 / 2 / 2",
        defaultCamera: "Cinematic full shot / wide dramatic reveal",
        isSplash: true,
      },
    ],
  },
  L3A: {
    id: "L3A",
    name: "3 Horizontal Strips",
    panelCount: 3,
    description: "Classic 3-tier horizontal progression, ideal for steady dialogue and panoramic environmental action.",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    slots: [
      { slotIndex: 0, aspectRatio: "wide", gridArea: "1 / 1 / 2 / 2", defaultCamera: "Establishing wide shot" },
      { slotIndex: 1, aspectRatio: "wide", gridArea: "2 / 1 / 3 / 2", defaultCamera: "Medium conversation" },
      { slotIndex: 2, aspectRatio: "wide", gridArea: "3 / 1 / 4 / 2", defaultCamera: "Reaction or climax punchline" },
    ],
  },
  L4A: {
    id: "L4A",
    name: "2x2 Quad Grid",
    panelCount: 4,
    description: "Balanced 4-panel dynamic grid with rhythm and rapid back-and-forth character interactions.",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    slots: [
      { slotIndex: 0, aspectRatio: "square", gridArea: "1 / 1 / 2 / 2", defaultCamera: "Medium shot" },
      { slotIndex: 1, aspectRatio: "square", gridArea: "1 / 2 / 2 / 3", defaultCamera: "Close-up reaction" },
      { slotIndex: 2, aspectRatio: "square", gridArea: "2 / 1 / 3 / 2", defaultCamera: "Over-the-shoulder" },
      { slotIndex: 3, aspectRatio: "square", gridArea: "2 / 2 / 3 / 3", defaultCamera: "Dynamic action" },
    ],
  },
  L4B: {
    id: "L4B",
    name: "Hero Header + 3-Panel Base",
    panelCount: 4,
    description: "One impactful wide establishing panel across the top, followed by 3 fast vertical rhythm panels underneath.",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1.2fr 1fr",
    slots: [
      { slotIndex: 0, aspectRatio: "wide", gridArea: "1 / 1 / 2 / 4", defaultCamera: "Panoramic establishing action" },
      { slotIndex: 1, aspectRatio: "tall", gridArea: "2 / 1 / 3 / 2", defaultCamera: "Close up face" },
      { slotIndex: 2, aspectRatio: "tall", gridArea: "2 / 2 / 3 / 3", defaultCamera: "Action beat" },
      { slotIndex: 3, aspectRatio: "tall", gridArea: "2 / 3 / 3 / 4", defaultCamera: "Reaction beat" },
    ],
  },
  L5A: {
    id: "L5A",
    name: "5-Panel Dynamic Climax",
    panelCount: 5,
    description: "Two dialogue setups on top, an intense central wide action strip in the middle, and two resolving beats below.",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1.3fr 1fr",
    slots: [
      { slotIndex: 0, aspectRatio: "square", gridArea: "1 / 1 / 2 / 2", defaultCamera: "Medium shot" },
      { slotIndex: 1, aspectRatio: "square", gridArea: "1 / 2 / 2 / 3", defaultCamera: "Close-up dialogue" },
      { slotIndex: 2, aspectRatio: "wide", gridArea: "2 / 1 / 3 / 3", defaultCamera: "Dynamic combat or revelation impact" },
      { slotIndex: 3, aspectRatio: "square", gridArea: "3 / 1 / 4 / 2", defaultCamera: "Shocked reaction" },
      { slotIndex: 4, aspectRatio: "square", gridArea: "3 / 2 / 4 / 3", defaultCamera: "Next move cliffhanger" },
    ],
  },
  L6A: {
    id: "L6A",
    name: "6-Panel Rapid Storyboard",
    panelCount: 6,
    description: "High panel-density layout for intricate conversations, rapid tactical battle sequences, or comedic timing.",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr",
    slots: [
      { slotIndex: 0, aspectRatio: "square", gridArea: "1 / 1 / 2 / 2", defaultCamera: "Angle 1" },
      { slotIndex: 1, aspectRatio: "square", gridArea: "1 / 2 / 2 / 3", defaultCamera: "Angle 2" },
      { slotIndex: 2, aspectRatio: "square", gridArea: "2 / 1 / 3 / 2", defaultCamera: "Angle 3" },
      { slotIndex: 3, aspectRatio: "square", gridArea: "2 / 2 / 3 / 3", defaultCamera: "Angle 4" },
      { slotIndex: 4, aspectRatio: "square", gridArea: "3 / 1 / 4 / 2", defaultCamera: "Angle 5" },
      { slotIndex: 5, aspectRatio: "square", gridArea: "3 / 2 / 4 / 3", defaultCamera: "Angle 6" },
    ],
  },
};

/**
 * Automatically chooses the ideal layout template based on panel count and splash flag
 */
export function selectLayoutTemplate(panelCount: number, hasSplash?: boolean): LayoutTemplateId {
  if (hasSplash || panelCount === 1) return "L1S";
  if (panelCount === 3) return "L3A";
  if (panelCount === 4) return "L4B";
  if (panelCount === 5) return "L5A";
  if (panelCount >= 6) return "L6A";
  return "L4A"; // fallback default
}

/**
 * Adjusts visual ordering for Right-To-Left Japanese manga reading direction
 */
export function getReadingOrderLabel(panelIndex: number, direction: ReadingDirection, totalPanels: number): string {
  if (direction === "rtl") {
    return `Panel #${panelIndex + 1} (RTL reading order)`;
  }
  return `Panel #${panelIndex + 1} (LTR reading order)`;
}
