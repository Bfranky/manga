"use client";

import React, { useState, useEffect, useRef } from "react";
import { DialogueItem, PageData, PanelData, ReadingDirection } from "@/lib/types/manga";
import { LAYOUT_TEMPLATES } from "@/lib/layout/templates";
import SpeechBubble, { SFXOverlay } from "./SpeechBubble";
import PanelEditor from "./PanelEditor";

interface MangaPageViewerProps {
  pages: PageData[];
  title: string;
  readingDirection: ReadingDirection;
  colorMode: "bw" | "color";
  onUpdatePanelDialogue?: (panelId: string, dialogue: DialogueItem[], caption?: string, sfx?: string) => void;
  onRegeneratePanel?: (panelId: string) => Promise<void>;
  onDownloadPDF?: () => void;
  isExportingPDF?: boolean;
  readOnly?: boolean;
}

export default function MangaPageViewer({
  pages,
  title,
  readingDirection: initialReadingDirection,
  colorMode,
  onUpdatePanelDialogue,
  onRegeneratePanel,
  onDownloadPDF,
  isExportingPDF = false,
  readOnly = false,
}: MangaPageViewerProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [readingMode, setReadingMode] = useState<"scroll" | "single" | "dual">("single");
  const [readingDirection, setReadingDirection] = useState<ReadingDirection>(initialReadingDirection);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [editingPanel, setEditingPanel] = useState<PanelData | null>(null);
  const [readerTheme, setReaderTheme] = useState<"dark" | "black">("black");

  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for paged reading
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingPanel) return;

      if (e.key === "ArrowRight") {
        if (readingDirection === "rtl") {
          handlePrevPage();
        } else {
          handleNextPage();
        }
      } else if (e.key === "ArrowLeft") {
        if (readingDirection === "rtl") {
          handleNextPage();
        } else {
          handlePrevPage();
        }
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPageIndex, readingDirection, readingMode, pages.length, editingPanel]);

  if (!pages || pages.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center text-zinc-400">
        No pages generated yet.
      </div>
    );
  }

  const handleNextPage = () => {
    const step = readingMode === "dual" ? 2 : 1;
    if (currentPageIndex + step < pages.length) {
      setCurrentPageIndex(currentPageIndex + step);
    } else if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(pages.length - 1);
    }
  };

  const handlePrevPage = () => {
    const step = readingMode === "dual" ? 2 : 1;
    if (currentPageIndex - step >= 0) {
      setCurrentPageIndex(currentPageIndex - step);
    } else {
      setCurrentPageIndex(0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const activePage = pages[currentPageIndex] || pages[0];
  const secondPage = readingMode === "dual" ? pages[currentPageIndex + 1] : null;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center w-full transition-colors ${
        isFullscreen ? "fixed inset-0 z-50 bg-black p-4 overflow-y-auto" : "space-y-4"
      }`}
    >
      {/* Reader Control Bar - Clean Studio Design */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-5xl bg-zinc-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-800 shadow-md">
        {/* Left: Reading Mode & Direction Toggles */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
            <button
              onClick={() => setReadingMode("single")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                readingMode === "single" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
              title="Single Page Mode"
            >
              Single
            </button>
            <button
              onClick={() => setReadingMode("dual")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                readingMode === "dual" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
              title="Double Page Spread (Tankobon)"
            >
              Spread
            </button>
            <button
              onClick={() => setReadingMode("scroll")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                readingMode === "scroll" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
              title="Vertical Continuous Scroll (Webtoon)"
            >
              Vertical Scroll
            </button>
          </div>

          {/* Reading Direction */}
          <button
            onClick={() => setReadingDirection(readingDirection === "rtl" ? "ltr" : "rtl")}
            className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            title="Toggle Japanese (RTL) / Western (LTR) Reading Flow"
          >
            {readingDirection === "rtl" ? "RTL (Japanese)" : "LTR (Western)"}
          </button>
        </div>

        {/* Center: Pagination (for Paged Modes) */}
        {readingMode !== "scroll" && (
          <div className="flex items-center gap-2">
            <button
              onClick={readingDirection === "rtl" ? handleNextPage : handlePrevPage}
              disabled={
                readingDirection === "rtl"
                  ? currentPageIndex >= pages.length - 1
                  : currentPageIndex === 0
              }
              className="px-2.5 py-1 rounded-md bg-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {readingDirection === "rtl" ? "Next →" : "← Prev"}
            </button>

            <span className="text-xs font-mono font-medium text-zinc-300 px-1">
              {readingMode === "dual" && secondPage
                ? `Pages ${currentPageIndex + 1}-${currentPageIndex + 2} of ${pages.length}`
                : `Page ${currentPageIndex + 1} of ${pages.length}`}
            </span>

            <button
              onClick={readingDirection === "rtl" ? handlePrevPage : handleNextPage}
              disabled={
                readingDirection === "rtl"
                  ? currentPageIndex === 0
                  : readingMode === "dual"
                  ? currentPageIndex >= pages.length - 2
                  : currentPageIndex === pages.length - 1
              }
              className="px-2.5 py-1 rounded-md bg-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {readingDirection === "rtl" ? "← Prev" : "Next →"}
            </button>
          </div>
        )}

        {/* Right: Zoom, Fullscreen & Download PDF */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center bg-zinc-950 px-1 py-0.5 rounded-lg border border-zinc-800">
            <button
              onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.1))}
              className="px-2 py-0.5 text-xs text-zinc-400 hover:text-white"
              title="Zoom out"
            >
              −
            </button>
            <span className="text-[11px] font-mono text-zinc-400 px-1.5">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
              className="px-2 py-0.5 text-xs text-zinc-400 hover:text-white"
              title="Zoom in"
            >
              +
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            title="Toggle Fullscreen (Key: F)"
          >
            {isFullscreen ? "Exit Full" : "Fullscreen"}
          </button>

          {/* Download PDF Action */}
          {onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              disabled={isExportingPDF}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isExportingPDF ? (
                <span>Exporting...</span>
              ) : (
                <>
                  <span>Download PDF</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Reader Canvas Area */}
      <div
        className={`w-full flex justify-center py-4 overflow-x-auto ${
          readerTheme === "black" ? "bg-black/60" : "bg-zinc-950"
        }`}
      >
        {readingMode === "scroll" ? (
          /* ================= VERTICAL SCROLL MODE ================= */
          <div
            className="flex flex-col items-center gap-8 w-full max-w-3xl transition-transform"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
          >
            {pages.map((page, idx) => (
              <div key={page.id} className="w-full flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-xs text-zinc-500 font-mono mb-2 px-2">
                  <span>PAGE {idx + 1} / {pages.length}</span>
                  <span>{title}</span>
                </div>
                <SinglePageView
                  page={page}
                  title={title}
                  colorMode={colorMode}
                  readOnly={readOnly}
                  onEditPanel={(panel) => setEditingPanel(panel)}
                />
              </div>
            ))}
          </div>
        ) : readingMode === "dual" ? (
          /* ================= DUAL PAGE SPREAD (TANKOBON) ================= */
          <div
            className="flex items-center justify-center gap-4 transition-transform max-w-6xl"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
          >
            {/* In Japanese RTL: Left side is higher page number, Right side is lower page number */}
            {readingDirection === "rtl" ? (
              <>
                {secondPage ? (
                  <SinglePageView
                    page={secondPage}
                    title={title}
                    colorMode={colorMode}
                    readOnly={readOnly}
                    onEditPanel={(panel) => setEditingPanel(panel)}
                  />
                ) : (
                  <div className="w-[440px] h-[620px] bg-zinc-950 border border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-xs font-mono">
                    END OF CHAPTER
                  </div>
                )}
                <SinglePageView
                  page={activePage}
                  title={title}
                  colorMode={colorMode}
                  readOnly={readOnly}
                  onEditPanel={(panel) => setEditingPanel(panel)}
                />
              </>
            ) : (
              <>
                <SinglePageView
                  page={activePage}
                  title={title}
                  colorMode={colorMode}
                  readOnly={readOnly}
                  onEditPanel={(panel) => setEditingPanel(panel)}
                />
                {secondPage ? (
                  <SinglePageView
                    page={secondPage}
                    title={title}
                    colorMode={colorMode}
                    readOnly={readOnly}
                    onEditPanel={(panel) => setEditingPanel(panel)}
                  />
                ) : (
                  <div className="w-[440px] h-[620px] bg-zinc-950 border border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-xs font-mono">
                    END OF CHAPTER
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* ================= SINGLE PAGE FOCUSED VIEW ================= */
          <div
            className="transition-transform"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
          >
            <SinglePageView
              page={activePage}
              title={title}
              colorMode={colorMode}
              readOnly={readOnly}
              onEditPanel={(panel) => setEditingPanel(panel)}
            />
          </div>
        )}
      </div>

      {/* Floating Bottom Quick Navigator */}
      <div className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800 shadow-lg text-xs">
        {pages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPageIndex(idx)}
            className={`h-6 min-w-[24px] px-1.5 rounded-md font-mono text-[11px] font-semibold transition-all ${
              currentPageIndex === idx
                ? "bg-rose-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Panel Quick Editor Modal */}
      {editingPanel && (
        <PanelEditor
          panel={editingPanel}
          onSave={(dialogue, caption, sfx) => {
            if (onUpdatePanelDialogue) {
              onUpdatePanelDialogue(editingPanel.id, dialogue, caption, sfx);
            }
            setEditingPanel(null);
          }}
          onRegenerate={
            onRegeneratePanel
              ? async () => {
                  await onRegeneratePanel(editingPanel.id);
                  setEditingPanel(null);
                }
              : undefined
          }
          onClose={() => setEditingPanel(null)}
        />
      )}
    </div>
  );
}

/**
 * Single Manga Page Rendering Component
 */
function SinglePageView({
  page,
  title,
  colorMode,
  readOnly,
  onEditPanel,
}: {
  page: PageData;
  title: string;
  colorMode: "bw" | "color";
  readOnly: boolean;
  onEditPanel: (panel: PanelData) => void;
}) {
  const layoutConfig = (LAYOUT_TEMPLATES as Record<string, any>)[page.layout] || LAYOUT_TEMPLATES.L4B;

  return (
    <div className="relative w-[480px] sm:w-[560px] md:w-[620px] aspect-[1/1.414] bg-white rounded-md shadow-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden border border-zinc-800">
      {/* Top Page Header Margin */}
      <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-zinc-500 uppercase border-b border-zinc-200 pb-1 mb-2">
        <span className="font-bold text-zinc-700">{title}</span>
        <span>PAGE {page.pageNo}</span>
      </div>

      {/* Grid Panels Container */}
      <div
        className="flex-1 grid gap-2.5 sm:gap-3.5 w-full h-full"
        style={{
          gridTemplateColumns: layoutConfig.gridCols,
          gridTemplateRows: layoutConfig.gridRows,
        }}
      >
        {page.panels.map((panel, pIdx) => {
          const slot = layoutConfig.slots[pIdx] || layoutConfig.slots[0];

          return (
            <div
              key={panel.id || pIdx}
              className={`relative overflow-hidden border-2 border-black bg-zinc-950 group select-none shadow-sm ${
                slot.className || ""
              }`}
            >
              {/* Background Art Canvas (2D Scene with background staging) */}
              <img
                src={panel.imageUrl}
                alt={panel.scene}
                className={`w-full h-full object-cover select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.02] ${
                  colorMode === "bw" ? "contrast-110" : ""
                }`}
              />

              {/* Vector SFX Overlay */}
              {panel.sfx && <SFXOverlay sfx={panel.sfx} />}

              {/* Vector Dialogue Balloons */}
              {panel.dialogue && panel.dialogue.length > 0 && (
                <div className="absolute inset-0 p-2 sm:p-3 pointer-events-none flex flex-col justify-between">
                  {panel.dialogue.map((bubble, bIdx) => (
                    <SpeechBubble
                      key={bIdx}
                      speaker={bubble.speaker}
                      text={bubble.text}
                      type={bubble.type}
                      index={bIdx}
                      total={panel.dialogue.length}
                    />
                  ))}
                </div>
              )}

              {/* Panel Caption Box */}
              {panel.caption && (
                <div className="absolute bottom-2 left-2 right-2 max-w-[85%] bg-black/85 text-zinc-100 text-[10px] sm:text-xs font-serif italic p-1.5 border border-zinc-700 shadow-md rounded pointer-events-none">
                  {panel.caption}
                </div>
              )}

              {/* Quick Edit Overlay Button on Hover */}
              {!readOnly && (
                <button
                  onClick={() => onEditPanel(panel)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 hover:bg-black text-white text-[10px] font-semibold px-2 py-1 rounded border border-zinc-700 shadow-md flex items-center gap-1 cursor-pointer"
                >
                  Edit Panel
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Page Footer Margin */}
      <div className="flex justify-between items-center text-[8px] font-mono text-zinc-400 uppercase pt-1 mt-2 border-t border-zinc-200">
        <span>MANGAFORGE STUDIO // 2D SERIALIZATION</span>
        <span>• {page.pageNo} •</span>
      </div>
    </div>
  );
}
