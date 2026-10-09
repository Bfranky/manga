"use client";

import React, { useState } from "react";
import { DialogueItem, PageData, PanelData, ReadingDirection, LayoutTemplateId } from "@/lib/types/manga";
import { LAYOUT_TEMPLATES } from "@/lib/layout/templates";
import SpeechBubble, { SFXOverlay } from "./SpeechBubble";
import PanelEditor from "./PanelEditor";
import { Edit3, RefreshCw, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, BookOpen, Layers } from "lucide-react";

interface MangaPageViewerProps {
  pages: PageData[];
  title: string;
  readingDirection: ReadingDirection;
  colorMode: "bw" | "color";
  onUpdatePanelDialogue?: (panelId: string, dialogue: DialogueItem[], caption?: string, sfx?: string) => void;
  onRegeneratePanel?: (panelId: string) => Promise<void>;
  readOnly?: boolean;
}

export default function MangaPageViewer({
  pages,
  title,
  readingDirection,
  colorMode,
  onUpdatePanelDialogue,
  onRegeneratePanel,
  readOnly = false,
}: MangaPageViewerProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [editingPanel, setEditingPanel] = useState<PanelData | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!pages || pages.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
        No pages generated yet.
      </div>
    );
  }

  const activePage = pages[currentPageIndex] || pages[0];
  const layoutConfig = (LAYOUT_TEMPLATES as Record<string, any>)[activePage.layout] || LAYOUT_TEMPLATES.L4B;

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between w-full max-w-3xl bg-zinc-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-zinc-800 shadow-lg">
        {/* Page Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={readingDirection === "rtl" ? handleNextPage : handlePrevPage}
            disabled={readingDirection === "rtl" ? currentPageIndex === pages.length - 1 : currentPageIndex === 0}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={readingDirection === "rtl" ? "Next Page (RTL)" : "Previous Page"}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-xs font-bold text-zinc-200 px-2 font-mono">
            Page {currentPageIndex + 1} of {pages.length}
          </span>

          <button
            onClick={readingDirection === "rtl" ? handlePrevPage : handleNextPage}
            disabled={readingDirection === "rtl" ? currentPageIndex === 0 : currentPageIndex === pages.length - 1}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={readingDirection === "rtl" ? "Previous Page (RTL)" : "Next Page"}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Layout Badge & Reading direction */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="rounded-lg bg-zinc-800 px-2 py-1 text-[11px] font-mono text-zinc-400 border border-zinc-700">
            Layout: {activePage.layout}
          </span>
          <span className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-2 py-1 text-[11px] font-bold text-rose-400 uppercase">
            {readingDirection === "rtl" ? "Right-to-Left (Japanese)" : "Left-to-Right"}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.1))}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-[11px] font-mono font-bold text-zinc-400 w-9 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main A5 Manga Page Container */}
      <div
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top center",
          transition: "transform 0.15s ease-out",
        }}
        className="w-full max-w-[580px] aspect-[1/1.414] rounded-2xl bg-white shadow-2xl p-4 sm:p-5 flex flex-col justify-between select-none relative border border-zinc-300"
      >
        {/* Page Header Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          <span className="truncate max-w-[280px]">{title}</span>
          <span>PAGE {activePage.pageNo} / {pages.length}</span>
        </div>

        {/* Dynamic Panel Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: layoutConfig.gridTemplateColumns,
            gridTemplateRows: layoutConfig.gridTemplateRows,
            gap: "8px",
          }}
          className="flex-1 my-2 min-h-0"
        >
          {activePage.panels.map((panel, pIdx) => {
            const slot = layoutConfig.slots[pIdx] || layoutConfig.slots[0];
            const dialogueList = panel.dialogue || [];

            return (
              <div
                key={panel.id}
                style={{
                  gridArea: slot?.gridArea,
                }}
                className="relative overflow-hidden rounded-xl border-2 border-zinc-950 bg-zinc-900 shadow-inner group"
              >
                {/* Panel Image Background */}
                {panel.imageUrl ? (
                  <img
                    src={panel.imageUrl}
                    alt={`Panel ${panel.panelNo}`}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-zinc-600 text-xs font-mono">
                    Generating Panel #{panel.panelNo}...
                  </div>
                )}

                {/* Narrative Caption */}
                {panel.caption && (
                  <div className="absolute top-2 left-2 z-20 max-w-[85%] rounded-md border border-zinc-950 bg-zinc-950/90 px-2.5 py-1 text-[10px] font-mono text-zinc-100 shadow-md">
                    {panel.caption}
                  </div>
                )}

                {/* Speech & Thought Bubbles */}
                {dialogueList.map((d, dIdx) => (
                  <SpeechBubble
                    key={dIdx}
                    dialogue={d}
                    index={dIdx}
                    totalDialogue={dialogueList.length}
                    isEditable={!readOnly}
                    onEdit={() => !readOnly && setEditingPanel(panel)}
                  />
                ))}

                {/* SFX Graphic */}
                <SFXOverlay sfx={panel.sfx} />

                {/* Hover Quick Editor Controls */}
                {!readOnly && (
                  <div className="absolute inset-0 z-30 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                    <button
                      onClick={() => setEditingPanel(panel)}
                      className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-zinc-950 shadow-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-rose-600" />
                      Edit Lettering
                    </button>

                    {onRegeneratePanel && (
                      <button
                        onClick={() => onRegeneratePanel(panel.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
                        Regen Art
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Page Footer Footer */}
        <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-zinc-400">
          <span>MANGAFORGE ENGINE</span>
          <span>A5 MANGA PRINT COMPLIANT</span>
        </div>
      </div>

      {/* Editing Modal Drawer */}
      {editingPanel && (
        <PanelEditor
          panel={editingPanel}
          onClose={() => setEditingPanel(null)}
          onSaveDialogue={(panelId, dialogue, caption, sfx) => {
            if (onUpdatePanelDialogue) {
              onUpdatePanelDialogue(panelId, dialogue, caption, sfx);
            }
            // update in current local view
            const target = activePage.panels.find((p) => p.id === panelId);
            if (target) {
              target.dialogue = dialogue;
              target.caption = caption;
              target.sfx = sfx;
            }
          }}
          onRegeneratePanel={onRegeneratePanel}
        />
      )}
    </div>
  );
}
