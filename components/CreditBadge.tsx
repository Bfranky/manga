"use client";

import React, { useState, useEffect } from "react";
import { Zap, Plus, Check, ShieldCheck, CreditCard, Sparkles, X } from "lucide-react";
import { PRICING_PLANS } from "../lib/credits";

export default function CreditBadge() {
  const [credits, setCredits] = useState<number>(8);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Read credits from localStorage if available
    const saved = localStorage.getItem("mangaforge_credits");
    if (saved) {
      setCredits(parseInt(saved, 10));
    }
  }, []);

  const handlePurchase = (planId: string, addCredits: number) => {
    setPurchasingPlan(planId);
    setTimeout(() => {
      const newBalance = credits + addCredits;
      setCredits(newBalance);
      localStorage.setItem("mangaforge_credits", newBalance.toString());
      setPurchasingPlan(null);
      setSuccessMessage(`Successfully added +${addCredits} Credits to your account!`);
      setTimeout(() => {
        setSuccessMessage(null);
        setModalOpen(false);
      }, 1800);
    }, 1200);
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer shadow-sm group"
        title="Click to view or top up credits"
      >
        <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
        <span>{credits} Credits</span>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/30 text-[10px] text-amber-200">
          +
        </span>
      </button>

      {/* Top Up Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-rose-950/20 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 mb-2">
                <Zap className="h-3.5 w-3.5 fill-amber-400" />
                Current Balance: {credits} Credits
              </div>
              <h3 className="text-2xl font-extrabold text-white">Top Up Manga Credits</h3>
              <p className="text-sm text-zinc-400 mt-1">
                1 Credit generates 1 complete high-res manga page with character locking & lettering.
              </p>
            </div>

            {/* Currency toggle: Stripe (USD) vs Paystack (NGN) */}
            <div className="flex items-center justify-between mb-6 bg-zinc-900/60 p-1.5 rounded-xl border border-zinc-800/80">
              <span className="text-xs font-medium text-zinc-400 ml-2">Select Currency / Gateway:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrency("USD")}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                    currency === "USD"
                      ? "bg-rose-600 text-white shadow"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  Stripe (USD $)
                </button>
                <button
                  onClick={() => setCurrency("NGN")}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                    currency === "NGN"
                      ? "bg-emerald-600 text-white shadow"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  Paystack (NGN ₦)
                </button>
              </div>
            </div>

            {/* Success alert */}
            {successMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-sm font-semibold text-emerald-400 animate-in zoom-in-95">
                <Check className="h-4 w-4 text-emerald-400" />
                {successMessage}
              </div>
            )}

            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRICING_PLANS.map((plan) => {
                const isSelected = purchasingPlan === plan.id;
                const priceFormatted =
                  currency === "USD" ? `$${plan.priceUSD}` : `₦${plan.priceNGN.toLocaleString()}`;

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                      plan.popular
                        ? "border-rose-500/60 bg-gradient-to-b from-rose-950/20 to-zinc-900/50 shadow-lg shadow-rose-950/30"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <h4 className="text-base font-bold text-white">{plan.name}</h4>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-white">{priceFormatted}</span>
                        <span className="text-xs text-zinc-400">/ one-time</span>
                      </div>
                      <div className="my-3 inline-flex items-center gap-1.5 rounded-lg bg-zinc-800/80 px-2.5 py-1 text-xs font-bold text-amber-300">
                        <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
                        +{plan.credits} Credits
                      </div>
                      <p className="text-xs text-zinc-400 mb-4">{plan.description}</p>
                    </div>

                    <button
                      onClick={() => handlePurchase(plan.id, plan.credits)}
                      disabled={Boolean(purchasingPlan)}
                      className={`w-full rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        plan.popular
                          ? "bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-600/30 hover:opacity-95"
                          : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
                      } ${isSelected ? "opacity-75" : ""}`}
                    >
                      {isSelected ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-3.5 w-3.5" />
                          Buy with {currency === "USD" ? "Stripe" : "Paystack"}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Assurance */}
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Automatic refund if any generation fails permanently.
              </span>
              <span className="text-[11px] text-zinc-400">Instant activation</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
