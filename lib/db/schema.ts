// MangaForge Drizzle / Postgres SQL Schema Definitions matching Section 5 Data Model

export interface ProfileTable {
  id: string; // the auth user id
  displayName: string | null;
  credits: number;
  plan: string;
  createdAt: Date;
}

export interface StoryTable {
  id: string; // uuid
  userId: string;
  title: string | null;
  body: string;
  style: string;
  colorMode: string;
  readingDirection: string;
  targetPages: number;
  status: string;
  progress: number;
  error: string | null;
  pdfUrl: string | null;
  createdAt: Date;
}

export interface CharacterTable {
  id: string; // uuid
  storyId: string;
  name: string;
  role: string | null;
  appearance: string;
  outfit: string | null;
  refImageUrl: string | null;
}

export interface PageTable {
  id: string; // uuid
  storyId: string;
  pageNo: number;
  layout: string;
}

export interface PanelTable {
  id: string; // uuid
  pageId: string;
  panelNo: number;
  scene: string;
  camera: string | null;
  emotion: string | null;
  characters: string[];
  dialogue: any[];
  caption: string | null;
  sfx: string | null;
  imagePrompt: string | null;
  imageUrl: string | null;
  status: string;
}

export interface CreditLedgerTable {
  id: string; // uuid
  userId: string;
  delta: number;
  reason: string;
  storyId: string | null;
  createdAt: Date;
}

export const SQL_MIGRATION_V1 = `
create table if not exists profiles (
  id text primary key,
  display_name text,
  credits int not null default 3,
  plan text not null default 'free',
  created_at timestamptz default now()
);

create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references profiles(id),
  title text,
  body text not null,
  style text not null default 'shonen',
  color_mode text not null default 'bw',
  reading_direction text not null default 'rtl',
  target_pages int not null default 6,
  status text not null default 'queued',
  progress int not null default 0,
  error text,
  pdf_url text,
  created_at timestamptz default now()
);

create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  name text not null,
  role text,
  appearance text not null,
  outfit text,
  ref_image_url text
);

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  page_no int not null,
  layout text not null,
  unique (story_id, page_no)
);

create table if not exists panels (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  panel_no int not null,
  scene text not null,
  camera text,
  emotion text,
  characters text[] default '{}',
  dialogue jsonb default '[]',
  caption text,
  sfx text,
  image_prompt text,
  image_url text,
  status text not null default 'pending'
);

create table if not exists credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references profiles(id),
  delta int not null,
  reason text not null,
  story_id uuid,
  created_at timestamptz default now()
);
`;
