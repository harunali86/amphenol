"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRfq } from "@/context/RfqContext";
import { Product } from "@/data/catalog";
import {
  X,
  Plus,
  Check,
  Eye,
  Sliders,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowLeftRight,
  ExternalLink,
  Copy,
} from "lucide-react";

export function ProductCompareModal() {
  const {
    compareProducts,
    toggleCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
    addToRfq,
    setQuickViewProduct,
  } = useRfq();

  const [highlightDifferences, setHighlightDifferences] = useState(true);
  const [addedMpn, setAddedMpn] = useState<string | null>(null);
  const [copiedMpn, setCopiedMpn] = useState<string | null>(null);

  if (!isCompareModalOpen || compareProducts.length === 0) {
    return null;
  }

  const handleCopy = (mpn: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mpn);
    setCopiedMpn(mpn);
    setTimeout(() => setCopiedMpn(null), 2000);
  };

  const handleAdd = (product: Product) => {
    addToRfq(product, product.moq, "catalog");
    setAddedMpn(product.mpn);
    setTimeout(() => setAddedMpn(null), 1800);
  };

  const handleAddAll = () => {
    compareProducts.forEach((p) => {
      addToRfq(p, p.moq, "catalog");
    });
    setAddedMpn("ALL");
    setTimeout(() => setAddedMpn(null), 2000);
  };

  // Helper to test if values across compared products differ
  const valuesDiffer = (extractor: (p: Product) => any) => {
    if (compareProducts.length < 2) return false;
    const firstVal = JSON.stringify(extractor(compareProducts[0]));
    return compareProducts.some((p) => JSON.stringify(extractor(p)) !== firstVal);
  };

  const specRows: {
    section?: string;
    label: string;
    extractor: (p: Product) => React.ReactNode;
    rawExtractor?: (p: Product) => any;
  }[] = [
    // General
    { section: "General & Standards", label: "Series & Class", extractor: (p) => p.series },
    { label: "Category", extractor: (p) => p.category },
    {
      label: "Mil-Spec Standard",
      extractor: (p) => (
        <span className="font-mono font-bold text-slate-800">
          {p.category.includes("Military")
            ? p.series.includes("38999")
              ? "MIL-DTL-38999 Series III"
              : p.series.includes("62IN")
              ? "MIL-DTL-26482 / 62IN"
              : "MIL-DTL-26482 Series II"
            : p.category.includes("EV")
            ? "SAE J1772 / USCAR-2 & 37"
            : "IEC 61076-2-101 / Industrial"}
        </span>
      ),
      rawExtractor: (p) => p.category,
    },
    {
      label: "QPL Listing Status",
      extractor: (p) => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-2xs ${
            p.category.includes("Military")
              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
              : "bg-slate-100 text-slate-700 border border-slate-300"
          }`}
        >
          {p.category.includes("Military") ? "✓ QPL Qualified" : "Commercial Heavy-Duty"}
        </span>
      ),
      rawExtractor: (p) => p.category.includes("Military"),
    },

    // Electrical
    { section: "Electrical Specifications", label: "Total Pin Contacts", extractor: (p) => `${p.pinCount} Positions` },
    { label: "Contact Gender", extractor: (p) => p.contactGender },
    { label: "Current Rating", extractor: (p) => <span className="font-mono font-bold text-[#002855]">{p.currentRating}</span> },
    { label: "Operating Voltage", extractor: (p) => <span className="font-mono">{p.voltageRating}</span> },

    // Mechanical & Environmental
    { section: "Mechanical & Environment", label: "Coupling Style", extractor: (p) => p.matingType },
    { label: "Shell Size", extractor: (p) => p.shellSize || "Standard Shell" },
    {
      label: "Shell Plating & Corrosion",
      extractor: (p) => (
        <div>
          <span className="font-semibold text-slate-800">{p.shellPlating}</span>
          <span className="block text-[10px] text-slate-500">
            {p.shellPlating.includes("Cadmium")
              ? "500 Hrs Salt Spray (Olive Drab)"
              : p.shellPlating.includes("Nickel")
              ? "48 Hrs Salt Spray • RoHS Compliant"
              : "High Conductivity Industrial Passivation"}
          </span>
        </div>
      ),
      rawExtractor: (p) => p.shellPlating,
    },
    {
      label: "Operating Temperature",
      extractor: (p) => <span className="font-mono font-semibold">{p.operatingTemp}</span>,
      rawExtractor: (p) => p.operatingTemp,
    },
    {
      label: "IP Sealing Protection",
      extractor: (p) => (
        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-2xs border border-emerald-200">
          {p.ipRating}
        </span>
      ),
      rawExtractor: (p) => p.ipRating,
    },

    // Logistics & Pricing
    { section: "Stock & Commercial Terms", label: "Pune Warehouse Stock", extractor: (p) => (
      <div className="font-mono font-bold text-emerald-700 flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{p.stock.toLocaleString()} pcs</span>
      </div>
    ), rawExtractor: (p) => p.stock },
    { label: "Standard Lead Time", extractor: (p) => p.leadTime },
    { label: "Minimum Order (MOQ)", extractor: (p) => `${p.moq} pcs` },
    {
      label: "Prototype Price (1-9 pcs)",
      extractor: (p) => (
        <span className="font-mono font-bold text-slate-900">
          ₹{p.priceTiers[0].price.toLocaleString("en-IN")}
        </span>
      ),
      rawExtractor: (p) => p.priceTiers[0].price,
    },
    {
      label: "Pilot Price (10-49 pcs)",
      extractor: (p) => (
        <span className="font-mono font-bold text-slate-900">
          ₹{Math.round(p.priceTiers[0].price * 0.92).toLocaleString("en-IN")}
        </span>
      ),
      rawExtractor: (p) => Math.round(p.priceTiers[0].price * 0.92),
    },
    {
      label: "Production Price (50-249 pcs)",
      extractor: (p) => (
        <span className="font-mono font-bold text-emerald-800">
          ₹{p.priceTiers[1] ? p.priceTiers[1].price.toLocaleString("en-IN") : Math.round(p.priceTiers[0].price * 0.85).toLocaleString("en-IN")}
        </span>
      ),
      rawExtractor: (p) => p.priceTiers[1]?.price || Math.round(p.priceTiers[0].price * 0.85),
    },
    {
      label: "HSN Code & GST",
      extractor: () => <span className="font-mono text-[11px] text-slate-600">8536.69.90 (18% ITC)</span>,
    },

    // Drop-in Equivalents
    {
      section: "Direct Competitor Drop-in Equivalents",
      label: "TE / Glenair Equivalents",
      extractor: (p) => (
        <div className="space-y-1">
          {p.competitorEquivalents.length > 0 ? (
            p.competitorEquivalents.map((c, i) => (
              <div key={i} className="text-[11px] font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-2xs border border-slate-200">
                <strong className="text-slate-900">{c.brand}:</strong> {c.partNumber}
              </div>
            ))
          ) : (
            <span className="text-[11px] text-slate-400 italic">Proprietary Amphenol Design</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white rounded-sm shadow-2xl border border-blue-900/30 overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="bg-[#001D3D] text-white p-3 sm:p-4 md:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 border-b border-blue-400/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-amber-300">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2 flex-wrap">
                <span>Side-by-Side Parametric Matrix</span>
                <span className="text-xs font-mono font-normal text-blue-200 bg-blue-950/80 px-2 py-0.5 rounded-2xs border border-blue-400/30">
                  {compareProducts.length} Connectors Selected
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Direct comparative analysis across electrical, mechanical, environmental and commercial metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Highlight Differences Toggle */}
            <button
              type="button"
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-all flex items-center gap-1.5 cursor-pointer ${
                highlightDifferences
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-xs"
                  : "bg-white/10 text-slate-300 border-white/20 hover:bg-white/20"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Highlight Differences</span>
            </button>

            {/* Add All to RFQ */}
            <button
              type="button"
              onClick={handleAddAll}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              {addedMpn === "ALL" ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Added All!</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add All to RFQ</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(false)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Matrix Area */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-3 sm:p-4 md:p-6 bg-slate-50">
          <div className="min-w-[560px] sm:min-w-[680px]">
            <table className="w-full border-collapse text-left text-xs bg-white border border-slate-200 shadow-xs rounded-xs overflow-hidden">
              {/* Sticky Table Header with Products */}
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-100">
                  <th className="p-4 w-48 font-bold text-slate-700 uppercase tracking-wider text-[11px] align-top bg-slate-100/90 sticky left-0 z-10 border-r border-slate-200">
                    Product &amp; Actions
                  </th>
                  {compareProducts.map((p) => (
                    <th key={p.id} className="p-4 align-top w-64 border-r border-slate-200 last:border-r-0">
                      <div className="flex flex-col h-full justify-between space-y-3">
                        {/* Top: Remove + Image */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => toggleCompare(p)}
                            title="Remove from comparison"
                            className="absolute top-0 right-0 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xs transition-colors cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="w-24 h-24 mx-auto relative bg-slate-50 border border-slate-200 rounded-xs p-2 flex items-center justify-center">
                            <Image
                              src={p.image}
                              alt={p.mpn}
                              fill
                              sizes="96px"
                              className="object-contain p-1"
                            />
                          </div>
                        </div>

                        {/* Middle: MPN & Series */}
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-mono text-sm font-black text-[#002855]">
                              {p.mpn}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopy(p.mpn, e)}
                              title="Copy MPN"
                              className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                            >
                              {copiedMpn === p.mpn ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                          <div className="text-xs font-bold text-slate-700 mt-0.5">{p.series}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-normal">
                            {p.title}
                          </div>
                        </div>

                        {/* Bottom: Direct Order Buttons */}
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Unit Rate:</span>
                            <strong className="font-mono text-slate-900 text-sm">
                              ₹{p.priceTiers[0].price.toLocaleString("en-IN")}
                            </strong>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAdd(p)}
                            className={`w-full py-2 text-xs font-bold rounded-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                              addedMpn === p.mpn
                                ? "bg-emerald-600 text-white"
                                : "bg-[#002855] hover:bg-[#001D3D] text-white active:scale-95"
                            }`}
                          >
                            {addedMpn === p.mpn ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Added to RFQ!</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add to RFQ</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsCompareModalOpen(false);
                              setQuickViewProduct(p);
                            }}
                            className="w-full py-1.5 text-[11px] font-semibold text-slate-600 hover:text-[#002855] hover:bg-slate-100 border border-slate-300 rounded-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View Full Specs &amp; Pinout</span>
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Matrix Rows */}
              <tbody className="divide-y divide-slate-200">
                {specRows.map((row, idx) => {
                  // If it's a section header
                  const isSection = !!row.section;
                  const isDifferent = highlightDifferences && valuesDiffer(row.rawExtractor || row.extractor);

                  return (
                    <React.Fragment key={idx}>
                      {isSection && (
                        <tr className="bg-slate-800 text-white font-bold text-xs">
                          <td
                            colSpan={compareProducts.length + 1}
                            className="py-2.5 px-4 tracking-wider uppercase text-[10px] text-blue-200 font-mono bg-slate-900"
                          >
                            {row.section}
                          </td>
                        </tr>
                      )}
                      <tr
                        className={`transition-colors ${
                          isDifferent
                            ? "bg-amber-50/70 hover:bg-amber-100/70"
                            : "hover:bg-slate-50/80"
                        }`}
                      >
                        {/* Spec Label */}
                        <td className="py-2.5 px-4 font-semibold text-slate-700 text-xs align-middle bg-slate-50/50 sticky left-0 border-r border-slate-200">
                          <div className="flex items-center justify-between gap-2">
                            <span>{row.label}</span>
                            {isDifferent && (
                              <span className="text-[9px] font-bold text-amber-800 bg-amber-200/90 border border-amber-300 px-1 py-0.2 rounded-2xs uppercase">
                                Differs
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Product Values */}
                        {compareProducts.map((p) => (
                          <td
                            key={p.id}
                            className={`py-2.5 px-4 text-xs align-middle border-r border-slate-200 last:border-r-0 ${
                              isDifferent ? "font-medium text-slate-900" : "text-slate-700"
                            }`}
                          >
                            {row.extractor(p)}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 border-t border-slate-200 p-3 sm:px-6 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-amber-200 border border-amber-400 rounded-2xs" />
            <span>Amber highlight indicates diverging technical or pricing parameters.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearCompare}
              className="text-slate-600 hover:text-rose-600 font-medium cursor-pointer"
            >
              Clear Comparison List
            </button>
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(false)}
              className="bg-[#002855] hover:bg-[#001D3D] text-white px-4 py-1.5 font-bold rounded-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
