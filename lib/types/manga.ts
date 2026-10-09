import { z } from "zod";

export type ColorMode = "bw" | "color";
export type ReadingDirection = "rtl" | "ltr";
export type MangaArtStyle = 
  | "shonen" 
  | "shojo" 
  | "seinen" 
  | "chibi" 
  | "cyberpunk" 
  | "dark-fantasy"
  | "retro-90s"
  | "webtoon";

export type StoryStatus = 
  | "queued" 
  | "scripting" 
  | "designing_characters" 
  | "awaiting_approval"
  | "drawing" 
  | "lettering" 
  | "exporting" 
  | "done" 
  | "failed";

export type BubbleType = "speech" | "thought" | "shout" | "caption";

export interface DialogueItem {
  speaker: string;
  text: string;
  type: BubbleType;
  positionX?: number; // 0 to 100%
  positionY?: number; // 0 to 100%
}

export interface PanelData {
  id: string;
  pageId: string;
  panelNo: number;
  scene: string;
  camera: string;
  emotion: string;
  characters: string[];
  dialogue: DialogueItem[];
  caption?: string;
  sfx?: string;
  imagePrompt: string;
  imageUrl?: string;
  status: "pending" | "generating" | "completed" | "failed";
  aspectRatio?: "square" | "wide" | "tall" | "splash";
  gridArea?: string;
}

export interface PageData {
  id: string;
  storyId: string;
  pageNo: number;
  layout: LayoutTemplateId;
  panels: PanelData[];
}

export interface CharacterData {
  id: string;
  storyId: string;
  name: string;
  role: string;
  appearance: string;
  outfit: string;
  refImageUrl?: string;
  isApproved?: boolean;
}

export interface StoryData {
  id: string;
  userId: string;
  title: string;
  body: string;
  style: MangaArtStyle;
  colorMode: ColorMode;
  readingDirection: ReadingDirection;
  targetPages: number;
  status: StoryStatus;
  progress: number; // 0 - 100
  error?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt?: string;
  characters?: CharacterData[];
  pages?: PageData[];
  logline?: string;
}

export interface Profile {
  id: string;
  displayName: string;
  email: string;
  credits: number;
  plan: "free" | "starter" | "mangaka_pro" | "studio_master";
  createdAt: string;
}

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  delta: number;
  reason: string;
  storyId?: string;
  createdAt: string;
}

export type LayoutTemplateId = "L1S" | "L3A" | "L4A" | "L4B" | "L5A" | "L6A";

// Zod Schemas for Script LLM Validation
export const DialogueSchema = z.object({
  speaker: z.string().describe("Character name or Narrator"),
  text: z.string().max(100).describe("Short punchy dialogue, max ~15 words"),
  type: z.enum(["speech", "thought", "shout"]).default("speech"),
});

export const PanelScriptSchema = z.object({
  panelNo: z.number().int().min(1),
  scene: z.string().describe("Visual description of environment, action, and subject pose. No embedded dialogue."),
  camera: z.string().describe("Close-up, wide-shot, low-angle, over-the-shoulder, bird-eye, dynamic foreshortened"),
  emotion: z.string().describe("Dominant facial expression and emotional mood"),
  characters: z.array(z.string()).describe("List of character names visible in this panel"),
  dialogue: z.array(DialogueSchema).default([]),
  caption: z.string().optional().describe("Narrative caption box text"),
  sfx: z.string().optional().describe("Sound effect (e.g. DOOM, SWISH, CLANG, DODGE)"),
  aspectRatio: z.enum(["square", "wide", "tall", "splash"]).optional(),
});

export const PageScriptSchema = z.object({
  pageNo: z.number().int().min(1),
  layout: z.enum(["L1S", "L3A", "L4A", "L4B", "L5A", "L6A"]).optional(),
  panels: z.array(PanelScriptSchema).min(1).max(6),
});

export const CharacterScriptSchema = z.object({
  name: z.string(),
  role: z.string().describe("e.g. Protagonist, Rival, Mentor, Antagonist, Ally"),
  appearance: z.string().describe("Age, build, hairstyle and color, eyes, skin tone, distinctive scars or marks"),
  outfit: z.string().describe("Fixed signature outfit that will stay strictly consistent across all panels"),
});

export const MangaScriptSchema = z.object({
  title: z.string(),
  logline: z.string(),
  characters: z.array(CharacterScriptSchema).min(1).max(6),
  pages: z.array(PageScriptSchema).min(1).max(12),
});

export type MangaScript = z.infer<typeof MangaScriptSchema>;
