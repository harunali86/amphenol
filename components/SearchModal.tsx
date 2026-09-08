"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRfq } from "@/context/RfqContext";
import { CATALOG_PRODUCTS, Product } from "@/data/catalog";
import {
  Search,
  X,
  ArrowRight,
  Download,
  Plus,
  Zap,
  CheckCircle2,
  Box,
  CornerDownLeft,
} from "lucide-react";

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToRfq, setActiveTab } = useRfq();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return CATALOG_PRODUCTS.slice(0, 5); // Default popular suggestions
    }

    const q = query.toLowerCase();
    return CATALOG_PRODUCTS.filter((p) => {
      const matchMpn = p.mpn.toLowerCase().includes(q);
      const matchSeries = p.series.toLowerCase().includes(q);
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchCompetitor = p.competitorEquivalents.some((c) =>
        c.partNumber.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q)
      );

      return matchMpn || matchSeries || matchTitle || matchDesc || matchCategory || matchCompetitor;
    });
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900 transition-all">
        {/* Search Bar Input */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Part Number, Competitor MPN (e.g. DTS26W), Series, or Specs (e.g. IP68 250A)..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Quick Filter Tags / Benchmark info */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2 text-[11px] text-slate-500 dark:border-slate-800/60 dark:bg-slate-900/50 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Filters:</span>
            {["D38999", "EV High Voltage", "RadSok 300A", "Ethernet Cat6"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Zap className="h-3 w-3" /> Sub-30ms Engine
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Box className="mx-auto h-8 w-8 text-slate-400 stroke-1 mb-2" />
              <p className="text-sm font-medium">No exact match found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for general series like &quot;38999&quot;, &quot;RadSok&quot;, or competitor MPNs like &quot;DTS26W&quot;.
              </p>
            </div>
          ) : (
            searchResults.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl p-3 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-400">
                      {product.mpn}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {product.series}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      {product.stock.toLocaleString()} in stock ({product.warehouse})
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                    {product.title}
                  </p>

                  <div className="mt-1 flex items-center gap-2 sm:gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                    <span>Pins: <strong className="text-slate-700 dark:text-slate-300">{product.pinCount}</strong></span>
                    <span>•</span>
                    <span>Rating: <strong className="text-slate-700 dark:text-slate-300">{product.currentRating}</strong></span>
                    <span>•</span>
                    <span>Sealing: <strong className="text-slate-700 dark:text-slate-300">{product.ipRating}</strong></span>
                    {product.competitorEquivalents.length > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1">
                        <span>•</span>
                        <span className="text-blue-600 dark:text-blue-400">
                          Cross-match: {product.competitorEquivalents[0].brand} ({product.competitorEquivalents[0].partNumber})
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Unit Price (@ MOQ)</div>
                    <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      ₹{product.priceTiers[0].price.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <button
                      onClick={() => {
                        addToRfq(product, product.moq, "catalog");
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
                    >
                      <Plus className="h-3 w-3" />
                      Add to RFQ
                    </button>
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        setActiveTab("catalog");
                      }}
                      className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                      title="View in Parametric Catalog"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <span className="hidden sm:inline">Press <kbd className="font-mono font-bold">ESC</kbd> to close</span>
          <span className="sm:hidden text-[10px]">Tap outside to close</span>
          <span className="text-slate-400 hidden sm:inline">15,000+ SKUs Indexed • Real-time Warehouse Inventory</span>
        </div>
      </div>
    </div>
  );
}
