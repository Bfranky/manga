# MangaForge: Story to Manga PDF Engine 🎨📖

> **One-line pitch:** Paste your story, press generate, get your manga PDF.

**Version 1.0** • Prepared for Blessed • Built with Next.js App Router, Tailwind CSS, TypeScript, Claude LLM scripting contracts, character consistency locking, dynamic CSS grid layouts, and vector SVG lettering.

---

## ✨ Features

- 🎭 **Story to Multi-Page Manga:** Turns raw text stories into paced, structured comic storyboards.
- 🔒 **Locked Character Consistency:** Generates front-view model sheets and locks facial traits, hairstyles, and outfits across every panel.
- 📐 **Dynamic Layout Engine:** Predefined CSS Grid templates (**L1S Splash, L3A 3-Strips, L4A 2x2, L4B Hero + Base, L5A Climax, L6A Dense**).
- 💬 **Zero-Garble Vector Lettering:** AI draws panel art without text; crisp SVG speech balloons (ovals with tails, shout bursts, thought clouds, captions, SFX) are overlaid with smart auto-fit font sizing.
- 📖 **RTL & LTR Support:** Authentic Japanese Right-to-Left reading order alongside Western graphic novel Left-to-Right.
- 🎨 **8 Curated Art Styles:** Shonen, Seinen, Shojo, Chibi, Cyberpunk Mecha, Dark Fantasy, Retro 90s OVA, and Modern Webtoon.
- 📄 **A5 Multi-Page PDF Export:** Downloadable A5 manga PDF with custom chapter covers, page borders, and metadata.
- 💳 **Credit Ledger & Monetization:** Pay-as-you-go credit system with Paystack (NGN ₦) and Stripe (USD $) support.
- ✏️ **Per-Panel Dialogue Editor & Art Regenerator:** Live preview studio allowing dialogue tweaking, bubble repositioning, and individual panel redrawing.

---

## 🏗️ Architecture & Tech Stack

- **Frontend & Routing:** Next.js (App Router), React 19, Tailwind CSS, Lucide Icons.
- **Data & Storage:** Neon Serverless Postgres schema (`lib/db/schema.ts`), Drizzle ORM compatible.
- **AI Pipelines:**
  - **Scripting:** Claude 3.5 Sonnet / Anthropic API with strict Zod contracts (`lib/ai/script.ts`).
  - **Character & Panel Inking:** Fal.ai / Replicate / Flux Kontext reference conditioning (`lib/ai/images.ts`).
  - **Local Generative Fallback:** Dynamic SVG anime engine for instant offline testing.
- **PDF Engine:** jsPDF + HTML Canvas vector rendering engine (`lib/pdf/exporter.ts`).

---

## 🚀 Getting Started

### 1. Run the Development Server

```bash
cd mangaforge
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Available Routes

| Route | Description |
| :--- | :--- |
| `/` | Landing page with interactive live manga reader preview & style gallery |
| `/new` | Manga Story creation wizard with presets, style picker & credit calculator |
| `/stories/[id]` | Real-time generation studio, character sheet checkpoint, and manga editor |
| `/dashboard` | User dashboard with saved stories, credit balance, and transaction history |
| `/pricing` | Credit top-up packs with Stripe USD & Paystack NGN toggle |
| `/s/[id]` | Public read-only shareable reader page |
| `/login` & `/signup` | Authentication pages with 3 free bonus credits |

---

## 📑 Database Schema (Section 5)

Applied in `lib/db/schema.ts`:
- `profiles` (User profile, credits, plan)
- `stories` (Story metadata, prompt, status, progress, PDF URL)
- `characters` (Turnaround model sheets, appearance, signature outfits)
- `pages` (Page numbers, layout templates)
- `panels` (Scene description, camera angle, emotion, dialogue JSONB, SFX, image URLs)
- `credit_ledger` (Transaction audit trail, deltas, reasons)

---

© 2026 MangaForge Engine.
