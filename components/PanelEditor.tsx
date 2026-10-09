"use client";

import React, { useState } from "react";
import { BubbleType, DialogueItem, PanelData } from "@/lib/types/manga";
import { X, Plus, Trash2, RefreshCw, MessageSquare, Sparkles, Check, Flame } from "lucide-react";

interface PanelEditorProps {
  panel: PanelData;
  onClose: () => void;
  onSaveDialogue: (panelId: string, updatedDialogue: DialogueItem[], updatedCaption?: string, updatedSfx?: string) => void;
  onRegeneratePanel?: (panelId: string) => Promise<void>;
}

export default function PanelEditor({
  panel,
  onClose,
  onSaveDialogue,
  onRegeneratePanel,
}: PanelEditorProps) {
  const [dialogueList, setDialogueList] = useState<DialogueItem[]>(
    panel.dialogue && panel.dialogue.length > 0 ? [...panel.dialogue] : []
  );
  const [caption, setCaption] = useState<string>(panel.caption || "");
  const [sfx, setSfx] = useState<string>(panel.sfx || "");
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleAddDialogue = () => {
    setDialogueList([
      ...dialogueList,
      {
        speaker: panel.characters[0] || "Hero",
        text: "New dialogue beat...",
        type: "speech",
      },
    ]);
  };

  const handleRemoveDialogue = (index: number) => {
    setDialogueList(dialogueList.filter((_, i) => i !== index));
  };

  const handleUpdateDialogue = (index: number, updates: Partial<DialogueItem>) => {
    const next = [...dialogueList];
    next[index] = { ...next[index], ...updates };
    setDialogueList(next);
  };

  const handleSave = () => {
    onSaveDialogue(panel.id, dialogueList, caption, sfx);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleRegen = async () => {
    if (!onRegeneratePanel || isRegenerating) return;
    setIsRegenerating(true);
    try {
      await onRegeneratePanel(panel.id);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-rose-950/20 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400 mb-2">
            <MessageSquare className="h-3.5 w-3.5" />
            Editing Panel #{panel.panelNo} Lettering
          </div>
          <h3 className="text-xl font-extrabold text-white">Edit Dialogue & Bubbles</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Scene Description: <span className="text-zinc-300 font-medium">{panel.scene}</span>
          </p>
        </div>

        {/* Panel Image Thumbnail & Regenerate Button */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            {panel.imageUrl && (
              <img
                src={panel.imageUrl}
                alt="Panel preview"
                className="h-16 w-16 rounded-xl object-cover border border-zinc-700 shrink-0"
              />
            )}
            <div>
              <span className="text-xs font-bold text-white block">Panel Inking & Art</span>
              <span className="text-[11px] text-zinc-400">
                Camera: {panel.camera} • Emotion: {panel.emotion}
              </span>
            </div>
          </div>

          {onRegeneratePanel && (
            <button
              onClick={handleRegen}
              disabled={isRegenerating}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
              {isRegenerating ? "Redrawing..." : "Regenerate Art (1 Credit)"}
            </button>
          )}
        </div>

        {/* Dialogue Items list */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
              Dialogue Speech Bubbles ({dialogueList.length})
            </label>
            <button
              onClick={handleAddDialogue}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Bubble
            </button>
          </div>

          {dialogueList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-500">
              No dialogue bubbles on this panel. Click &quot;Add Bubble&quot; to place one.
            </div>
          ) : (
            dialogueList.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  {/* Speaker Name */}
                  <input
                    type="text"
                    value={item.speaker}
                    onChange={(e) => handleUpdateDialogue(idx, { speaker: e.target.value })}
                    placeholder="Speaker name"
                    className="rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white border border-zinc-700/80 focus:border-rose-500 outline-none w-1/3"
                  />

                  {/* Bubble Type Selector */}
                  <select
                    value={item.type}
                    onChange={(e) =>
                      handleUpdateDialogue(idx, { type: e.target.value as BubbleType })
                    }
                    className="rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-200 border border-zinc-700/80 focus:border-rose-500 outline-none cursor-pointer"
                  >
                    <option value="speech">Speech Oval</option>
                    <option value="shout">⚡ Shout Burst</option>
                    <option value="thought">☁ Thought Cloud</option>
                    <option value="caption">Rectangle Caption</option>
                  </select>

                  {/* Delete */}
                  <button
                    onClick={() => handleRemoveDialogue(idx)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete bubble"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Dialogue Text */}
                <textarea
                  value={item.text}
                  onChange={(e) => handleUpdateDialogue(idx, { text: e.target.value })}
                  placeholder="Dialogue text (max ~15 words recommended)..."
                  rows={2}
                  className="w-full rounded-xl bg-zinc-950 p-3 text-xs text-zinc-200 border border-zinc-700/80 focus:border-rose-500 outline-none resize-none leading-relaxed"
                />
              </div>
            ))
          )}
        </div>

        {/* SFX & Caption */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              SFX Sound Effect
            </label>
            <input
              type="text"
              value={sfx}
              onChange={(e) => setSfx(e.target.value)}
              placeholder="e.g. BOOM, SLASH, DODGE"
              className="w-full rounded-xl bg-zinc-900/60 px-3.5 py-2.5 text-xs font-black uppercase text-rose-400 border border-zinc-800 focus:border-rose-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Narrative Caption Box
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Meanwhile, at the outer gate..."
              className="w-full rounded-xl bg-zinc-900/60 px-3.5 py-2.5 text-xs text-zinc-200 border border-zinc-800 focus:border-rose-500 outline-none"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:opacity-95 transition-all cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="h-4 w-4" />
                Lettering Saved!
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Apply Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
