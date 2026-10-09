"use client";

import React from "react";
import { StoryStatus } from "@/lib/types/manga";
import { Check, Loader2, Sparkles, AlertCircle, FileText, UserCheck, Paintbrush, MessageSquare, Download } from "lucide-react";

interface ProgressTimelineProps {
  status: StoryStatus;
  progress: number;
  error?: string;
  onApproveCheckpoint?: () => void;
}

interface StepItem {
  key: StoryStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  {
    key: "scripting",
    label: "1. Scripting Stage",
    description: "Claude LLM analyzing story beats, dialogues, camera angles & characters.",
    icon: FileText,
  },
  {
    key: "designing_characters",
    label: "2. Character Reference Sheet",
    description: "Generating turnaround model sheets & locking visual appearance traits.",
    icon: UserCheck,
  },
  {
    key: "drawing",
    label: "3. Panel Inking & Art",
    description: "Rendering parallel manga panels with locked style & reference conditioning.",
    icon: Paintbrush,
  },
  {
    key: "lettering",
    label: "4. Lettering & Bubbles",
    description: "Overlaying crisp SVG speech balloons, thought clouds, captions & SFX.",
    icon: MessageSquare,
  },
  {
    key: "exporting",
    label: "5. PDF Composition",
    description: "Assembling multi-page A5 manga document & generating signed download.",
    icon: Download,
  },
];

export default function ProgressTimeline({
  status,
  progress,
  error,
  onApproveCheckpoint,
}: ProgressTimelineProps) {
  const getStepState = (stepKey: StoryStatus) => {
    if (status === "done") return "completed";
    if (status === "failed") return "failed";

    const stepOrder: StoryStatus[] = [
      "queued",
      "scripting",
      "designing_characters",
      "awaiting_approval",
      "drawing",
      "lettering",
      "exporting",
      "done",
    ];

    const currentIndex = stepOrder.indexOf(status);
    const targetIndex = stepOrder.indexOf(stepKey);

    if (currentIndex > targetIndex) return "completed";
    if (currentIndex === targetIndex) return "active";
    return "pending";
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6">
      {/* Header bar with live pulse & percentage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            {status === "done" ? (
              <Check className="h-5 w-5 text-emerald-400" />
            ) : status === "failed" ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-rose-500" />
            )}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Manga Generation Pipeline</span>
              {status !== "done" && status !== "failed" && (
                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </h3>
            <p className="text-xs text-zinc-400">
              {status === "done"
                ? "All pages & high-resolution manga PDF generated successfully!"
                : status === "failed"
                ? "Generation encountered an issue. Credits refunded."
                : "Real-time AI pipeline orchestrating multi-step manga creation."}
            </p>
          </div>
        </div>

        {/* Progress percent badge */}
        <div className="flex items-center gap-2">
          <div className="w-32 bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-zinc-300 min-w-[38px] text-right">
            {progress}%
          </span>
        </div>
      </div>

      {/* Error display if failed */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-red-500/40 bg-red-950/40 p-4 text-xs font-semibold text-red-300">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
        {STEPS.map((step) => {
          const state = getStepState(step.key);
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all ${
                state === "completed"
                  ? "border-emerald-500/30 bg-emerald-950/10 text-zinc-300"
                  : state === "active"
                  ? "border-rose-500/60 bg-rose-950/20 text-white ring-1 ring-rose-500/30 shadow-lg shadow-rose-950/30"
                  : "border-zinc-850 bg-zinc-900/30 text-zinc-500"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      state === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : state === "active"
                        ? "bg-rose-500 text-white shadow"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {state === "completed" ? (
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    ) : state === "active" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    {state === "completed" ? "Done" : state === "active" ? "Running" : "Waiting"}
                  </span>
                </div>

                <h4
                  className={`text-xs font-bold ${
                    state === "active"
                      ? "text-rose-300 font-extrabold"
                      : state === "completed"
                      ? "text-zinc-200"
                      : "text-zinc-400"
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
