"use client";

import React from "react";
import Image from "next/image";
import { useRfq } from "@/context/RfqContext";
import { ArrowLeftRight, X, Trash2, CheckCircle2 } from "lucide-react";

export function ProductCompareDock() {
  const {
    compareProducts,
    toggleCompare,
    clearCompare,
    setIsCompareModalOpen,
  } = useRfq();

  if (compareProducts.length === 0) {
    return null;
  }

  const canCompare = compareProducts.length >= 2;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-45 w-[95%] max-w-4xl animate-fadeIn">
      <div className="bg-[#001D3D]/95 text-white border-2 border-blue-400/50 shadow-2xl backdrop-blur-md rounded-md p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Summary & Selected Product Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 pr-2 border-r border-blue-400/30">
            <div className="w-8 h-8 rounded-xs bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-blue-200">
                Compare Tray
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                {compareProducts.length} of 4 items
              </div>
            </div>
          </div>

          {/* Selected Item Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {compareProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 bg-slate-900/90 border border-blue-400/40 rounded-xs px-2 py-1 shadow-xs group"
              >
                <div className="relative w-6 h-6 shrink-0 bg-white/10 rounded-2xs overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.mpn}
                    fill
                    sizes="24px"
                    className="object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="font-mono text-xs font-bold text-amber-300 max-w-[110px] truncate">
                    {p.mpn}
                  </div>
                  <div className="text-[9px] text-slate-400 leading-none">
                    {p.series} • {p.pinCount}P
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCompare(p)}
                  title={`Remove ${p.mpn}`}
                  className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 p-0.5 rounded-2xs transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            title="Clear comparison list"
            className="text-slate-400 hover:text-slate-200 text-xs px-2.5 py-2 font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Clear</span>
          </button>

          <button
            type="button"
            disabled={!canCompare}
            onClick={() => setIsCompareModalOpen(true)}
            className={`px-4 py-2 text-xs font-bold rounded-xs transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              canCompare
                ? "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-950"
                : "bg-slate-700/60 text-slate-400 cursor-not-allowed border border-slate-600/40"
            }`}
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>
              {canCompare
                ? `Compare Side-by-Side (${compareProducts.length})`
                : "Select 1 More Part"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
