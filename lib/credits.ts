import { CreditLedgerEntry, Profile } from "./types/manga";

export const DEFAULT_CREDITS = 3;
export const COST_PER_PAGE = 1; // 1 credit per page
export const REGEN_PANEL_COST = 1;
export const REGEN_CHARACTER_COST = 0; // free in checkpoint

export interface PricingPlan {
  id: string;
  name: string;
  credits: number;
  priceUSD: number;
  priceNGN: number;
  description: string;
  popular?: boolean;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 10,
    priceUSD: 5,
    priceNGN: 5000,
    description: "Great for quick one-shots and short mini-stories.",
    features: [
      "10 Generation Credits (~10 Manga Pages)",
      "All Art Styles (Shonen, Seinen, Shojo, Chibi)",
      "High-Resolution PDF Download",
      "Character Consistency Locking",
      "Per-Panel Dialogue Editing",
    ],
  },
  {
    id: "mangaka_pro",
    name: "Mangaka Pro",
    credits: 50,
    priceUSD: 19,
    priceNGN: 20000,
    popular: true,
    description: "Ideal for passionate storytellers and multi-chapter series.",
    features: [
      "50 Generation Credits (~50 Manga Pages)",
      "Priority Queue & Concurrency Boost",
      "Full Color & B&W Screentone Modes",
      "Unlimited Character Refinement Checkpoints",
      "Full Manga PDF Export with Custom Covers",
      "Shareable Web Reader Links",
    ],
  },
  {
    id: "studio_master",
    name: "Studio Master",
    credits: 200,
    priceUSD: 59,
    priceNGN: 65000,
    description: "Designed for content creators, indie publishers and studios.",
    features: [
      "200 Generation Credits (~200 Manga Pages)",
      "Ultra High-Res Print-Ready PDF 300DPI",
      "Fastest GPU Parallel Generation",
      "Custom Watermark Removal & Commercial Rights",
      "Direct API & Webhook Access",
      "Dedicated Discord / Priority Support",
    ],
  },
];

/**
 * Calculates total credits needed for a story generation
 */
export function calculateStoryCreditCost(targetPages: number): number {
  return Math.max(1, Math.ceil(targetPages * COST_PER_PAGE));
}
