import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MangaForge | Story to Manga PDF Engine",
  description: "Turn plain-text stories into multi-page manga PDFs automatically with locked character consistency, dynamic panel layouts, and vector speech bubbles.",
  keywords: ["manga", "anime comic", "story to manga", "AI manga generator", "comic PDF", "manga studio"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-rose-500 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
