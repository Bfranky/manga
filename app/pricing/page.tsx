"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PRICING_PLANS } from "@/lib/credits";

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

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-medium text-zinc-500 uppercase">
              CREDIT PRICING
            </span>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Pay-As-You-Go Generation Credits
            </h1>
            <p className="text-xs text-zinc-400">
              1 Credit generates 1 complete high-resolution manga page with character locking & vector lettering.
            </p>

            {/* Currency selector toggle */}
            <div className="inline-flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 mt-4">
              <button
                onClick={() => setCurrency("USD")}
                className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency("NGN")}
                className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  currency === "NGN"
                    ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                NGN (₦)
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successPlan && (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs font-medium text-emerald-400 max-w-md mx-auto">
              <span>✓</span>
              <span>{successPlan}</span>
            </div>
          )}

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRICING_PLANS.map((plan) => {
              const price =
                currency === "USD" ? `$${plan.priceUSD}` : `₦${plan.priceNGN.toLocaleString()}`;
              const isProcessing = processingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all ${
                    plan.popular
                      ? "border-rose-500/60 bg-zinc-900 shadow-lg"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{plan.name}</h3>
                      {plan.popular && (
                        <span className="rounded bg-rose-500/20 text-rose-400 px-2 py-0.5 text-[10px] font-mono uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{price}</span>
                      <span className="text-xs text-zinc-500">one-time</span>
                    </div>
                    <div className="my-3 inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
                      +{plan.credits} Credits (~{plan.credits} pages)
                    </div>
                    <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{plan.description}</p>
                  </div>

                  <button
                    onClick={() => handleBuy(plan.id, plan.credits)}
                    disabled={Boolean(processingPlan)}
                    className={`w-full rounded-lg py-2.5 text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${
                      plan.popular
                        ? "bg-rose-600 text-white hover:bg-rose-500"
                        : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    {isProcessing ? "Processing..." : `Select Plan`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
