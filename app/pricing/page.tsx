"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PRICING_PLANS } from "@/lib/credits";
import { Zap, Check, ShieldCheck, Sparkles, CreditCard, Flame } from "lucide-react";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const handleBuy = (planId: string, credits: number) => {
    setProcessingPlan(planId);
    setTimeout(async () => {
      try {
        await fetch("/api/credits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: credits,
            reason: `Purchased ${planId.toUpperCase()} Pack`,
          }),
        });

        // Update local storage
        const current = parseInt(localStorage.getItem("mangaforge_credits") || "8", 10);
        localStorage.setItem("mangaforge_credits", (current + credits).toString());

        setProcessingPlan(null);
        setSuccessPlan(`Added +${credits} Credits to your balance!`);
        setTimeout(() => setSuccessPlan(null), 3000);
      } catch (err) {
        setProcessingPlan(null);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400">
              <Zap className="h-3.5 w-3.5 fill-amber-400" />
              Pay-As-You-Go Manga Credits
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Simple, Transparent Credit Packs
            </h1>
            <p className="text-sm text-zinc-400">
              No hidden fees. 1 Credit = 1 high-resolution manga page with character locking & lettering.
            </p>

            {/* Currency selector toggle */}
            <div className="inline-flex items-center gap-1.5 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 mt-4 shadow-lg">
              <button
                onClick={() => setCurrency("USD")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-rose-600 text-white shadow-md font-extrabold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Stripe (USD $)
              </button>
              <button
                onClick={() => setCurrency("NGN")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  currency === "NGN"
                    ? "bg-emerald-600 text-white shadow-md font-extrabold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Paystack (NGN ₦)
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successPlan && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-sm font-bold text-emerald-400 max-w-md mx-auto animate-in zoom-in-95">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>{successPlan}</span>
            </div>
          )}

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => {
              const price =
                currency === "USD" ? `$${plan.priceUSD}` : `₦${plan.priceNGN.toLocaleString()}`;
              const isProcessing = processingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-3xl border p-8 transition-all ${
                    plan.popular
                      ? "border-rose-500/60 bg-gradient-to-b from-rose-950/30 via-zinc-900/60 to-zinc-950 ring-2 ring-rose-500/20 shadow-2xl shadow-rose-950/40"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 px-4 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
                      Most Popular Mangaka Pack
                    </span>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{plan.description}</p>

                    <div className="my-6 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">{price}</span>
                      <span className="text-xs text-zinc-400">/ one-time pack</span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-xs font-bold text-amber-300 mb-6">
                      <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
                      +{plan.credits} Manga Credits
                    </div>

                    <ul className="space-y-3 pt-2 border-t border-zinc-800/80">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBuy(plan.id, plan.credits)}
                    disabled={Boolean(processingPlan)}
                    className={`mt-8 w-full rounded-2xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      plan.popular
                        ? "bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white shadow-lg shadow-rose-600/30 hover:opacity-95"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Purchase with {currency === "USD" ? "Stripe" : "Paystack"}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Refund & Guarantee Bar */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white block font-bold">100% Failed Job Refund Guarantee:</strong>
                If any AI provider timeout or permanent rendering failure occurs, your credits are automatically refunded to your ledger.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
