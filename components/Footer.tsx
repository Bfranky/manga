import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 text-zinc-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white font-sans">
              MANGA<span className="text-rose-500">FORGE</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Turn plain-text story narratives into serialized 2D manga pages with character consistency, atmospheric background staging, and on-screen chapter reading.
          </p>
        </div>

        {/* Product Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">Product</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/new" className="hover:text-white transition-colors">
                Manga Studio
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Library & Projects
              </Link>
            </li>
            <li>
              <Link href="/stories/demo-story-01" className="hover:text-white transition-colors">
                Reader Demo
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing & Credits
              </Link>
            </li>
          </ul>
        </div>

        {/* Technical Architecture */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">Platform</h4>
          <ul className="space-y-1.5 text-xs text-zinc-400">
            <li>Next.js App Router & Tailwind CSS</li>
            <li>Neon Serverless Postgres</li>
            <li>2D Scene & Background Staging</li>
            <li>Interactive Multi-Mode Reader</li>
            <li>Vector Speech Balloon Lettering</li>
          </ul>
        </div>

        {/* Security & Ownership */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">Creator Rights</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Creators retain 100% intellectual property ownership of their stories, character designs, and exported chapters.
          </p>
          <div className="text-xs text-emerald-400 font-medium pt-1">
            ✓ Private database encryption active
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© 2026 MangaForge Studio. All rights reserved.</p>
        <p>Built for storytellers and mangaka worldwide.</p>
      </div>
    </footer>
  );
}
