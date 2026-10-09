"use client";

import React, { useState, useEffect } from "react";
import { PRICING_PLANS } from "../lib/credits";

export default function CreditBadge() {
  const [credits, setCredits] = useState<number>(8);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
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
      setSuccessMessage(`Added +${addCredits} Credits to your account`);
      setTimeout(() => {
        setSuccessMessage(null);
        setModalOpen(false);
      }, 1500);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-700 hover:text-white transition-all cursor-pointer"
        title="View or top up credits"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span>{credits} Credits</span>
        <span className="text-zinc-500 text-[11px] font-bold">+</span>
      </button>

      {/* Top Up Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-xs font-mono font-medium text-zinc-400">CREDIT MANAGEMENT</span>
              <h3 className="text-xl font-bold text-white mt-1">Top Up Generation Credits</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Current balance: <span className="text-white font-semibold">{credits} Credits</span>. Each credit generates a complete manga page.
              </p>
            </div>

            {/* Currency toggle */}
            <div className="flex items-center justify-between mb-5 bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
              <span className="text-xs font-medium text-zinc-400 ml-2">Payment Currency:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrency("USD")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    currency === "USD"
                      ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency("NGN")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    currency === "NGN"
                      ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  NGN (₦)
                </button>
              </div>
            </div>

            {/* Success alert */}
            {successMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs font-medium text-emerald-400">
                <span>✓</span>
                {successMessage}
              </div>
            )}

            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRICING_PLANS.map((plan) => {
                const isSelected = purchasingPlan === plan.id;
                const priceFormatted =
                  currency === "USD" ? `$${plan.priceUSD}` : `₦${plan.priceNGN.toLocaleString()}`;

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
                      plan.popular
                        ? "border-rose-500/60 bg-zinc-900/90 shadow-md"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                        {plan.popular && (
                          <span className="rounded bg-rose-500/20 text-rose-400 px-1.5 py-0.5 text-[9px] font-mono uppercase">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white">{priceFormatted}</span>
                      </div>
                      <div className="my-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
                        +{plan.credits} Credits
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-4">{plan.description}</p>
                    </div>

                    <button
                      onClick={() => handlePurchase(plan.id, plan.credits)}
                      disabled={Boolean(purchasingPlan)}
                      className={`w-full rounded-lg py-2 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        plan.popular
                          ? "bg-rose-600 text-white hover:bg-rose-500"
                          : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
                      }`}
                    >
                      {isSelected ? "Processing..." : `Select Plan`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
