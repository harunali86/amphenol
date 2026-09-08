"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRfq } from "@/context/RfqContext";
import { CATALOG_PRODUCTS, Product } from "@/data/catalog";
import {
  Table as TableIcon,
  LayoutGrid,
  Filter,
  CheckCircle2,
  FileText,
  Plus,
  Minus,
  ArrowUpDown,
  Download,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  X,
  Copy,
  Check,
  Search,
  RotateCcw,
  Box,
  ArrowLeftRight,
  CreditCard,
} from "lucide-react";

export function CatalogView() {
  const { addToRfq, toggleCompare, compareProducts, startDirectCheckout } = useRfq();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPlating, setSelectedPlating] = useState<string>("all");
  const [selectedMating, setSelectedMating] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [copiedMpn, setCopiedMpn] = useState<string | null>(null);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Product Lines" },
    { id: "Military & Aerospace", label: "Military & Aerospace (QPL)" },
    { id: "EV & Power", label: "EV & Powertrain (High Voltage)" },
    { id: "Industrial & Harsh Env", label: "Industrial & Heavy Duty" },
    { id: "Rugged Data & Telecom", label: "Rugged Data, RF & Fiber" },
  ];

  const platings = [
    "all",
    "Olive Drab Cadmium",
    "Electroless Nickel",
    "Passivated Stainless Steel",
    "Black Anodized Aluminum",
    "PA66 Flame Retardant UL94V-0",
  ];

  const matingTypes = ["all", "Threaded", "Bayonet", "Push-Pull", "Latch"];

  const handleCopyMpn = (mpn: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mpn);
    setCopiedMpn(mpn);
    setTimeout(() => setCopiedMpn(null), 2000);
  };

  const getQuantity = (id: string, moq: number) => {
    return quantities[id] !== undefined ? quantities[id] : moq;
  };

  const handleQtyChange = (id: string, delta: number, moq: number) => {
    const current = getQuantity(id, moq);
    const next = Math.max(moq, current + delta);
    setQuantities((prev) => ({ ...prev, [id]: next }));
  };

  const handleAdd = (p: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const qty = getQuantity(p.id, p.moq);
    addToRfq(p, qty, "catalog");
    setAddedItemNotice(p.mpn);
    setTimeout(() => setAddedItemNotice(null), 2500);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedPlating("all");
    setSelectedMating("all");
    setInStockOnly(false);
    setSearchFilter("");
  };

  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (selectedPlating !== "all" && !p.shellPlating.toLowerCase().includes(selectedPlating.toLowerCase())) {
        return false;
      }
      if (selectedMating !== "all" && p.matingType !== selectedMating) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matches =
          p.mpn.toLowerCase().includes(q) ||
          p.series.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.currentRating.toLowerCase().includes(q) ||
          p.ipRating.toLowerCase().includes(q) ||
          p.shellPlating.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedPlating, selectedMating, inStockOnly, searchFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header Bar */}
      <div className="border border-slate-300 bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-black uppercase tracking-tight text-[#002855]">
                Parametric Product Catalog
              </h2>
              <span className="bg-[#002855] text-white px-2.5 py-0.5 text-xs font-mono font-bold tracking-wider">
                15,000+ SKUs INDEXED
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[11px] font-bold">
                PUNE CENTRAL HUB DIRECT
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Explore authentic Amphenol Interconnect India circular, rectangular, high-voltage EV, and harsh environment connectors with verified parametric data, official PDF catalogues, and direct factory RFQ pricing.
            </p>
          </div>

          {/* Dual View Switcher */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <div className="flex items-center border border-slate-300 bg-slate-100 p-0.5">
              <button
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition-all ${
                  viewMode === "cards"
                    ? "bg-[#002855] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Visual Product Cards</span>
              </button>

              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition-all ${
                  viewMode === "table"
                    ? "bg-[#002855] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span>Engineer Table View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Action Toast Notification */}
        {addedItemNotice && (
          <div className="mt-3 flex items-center justify-between bg-emerald-50 border border-emerald-300 px-4 py-2 text-xs text-emerald-900 font-medium animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>
                Added <strong>{addedItemNotice}</strong> to RFQ Cart with domestic GST invoicing breakdown.
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Cart Updated</span>
          </div>
        )}
      </div>

      {/* Main Layout: Left Parametric Sidebar + Right Product List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Parametric Filters (Mouser / DigiKey Format) */}
        <div className="lg:col-span-3 space-y-4 border border-slate-300 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#002855]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Parametric Filters
              </h3>
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Search */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Part Number or Spec
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="e.g. D38999, 62IN, 66 pins, IP68..."
                className="w-full border border-slate-300 bg-slate-50 px-3 py-1.5 pl-8 text-xs text-slate-900 focus:border-[#002855] focus:bg-white focus:outline-none"
              />
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>

          {/* In-Stock Filter */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 border border-slate-200 p-2.5 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#002855] focus:ring-[#002855]"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">In Stock Only</div>
                <div className="text-[10px] text-slate-500">Ready for 24h Pune dispatch</div>
              </div>
            </label>
          </div>

          {/* Category Filter */}
          <div className="pt-2 border-t border-slate-200">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
              Product Categories
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? "bg-[#002855] text-white font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && <ChevronRight className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Shell Plating Filter */}
          <div className="pt-2 border-t border-slate-200">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
              Shell Plating / Finish
            </label>
            <div className="space-y-1">
              {platings.map((plating) => (
                <button
                  key={plating}
                  onClick={() => setSelectedPlating(plating)}
                  className={`w-full text-left px-2.5 py-1 text-xs transition-colors flex items-center justify-between ${
                    selectedPlating === plating
                      ? "bg-slate-200 font-bold text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{plating === "all" ? "All Platings" : plating}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mating Coupling Filter */}
          <div className="pt-2 border-t border-slate-200">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
              Mating Mechanism
            </label>
            <div className="space-y-1">
              {matingTypes.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMating(m)}
                  className={`w-full text-left px-2.5 py-1 text-xs transition-colors flex items-center justify-between ${
                    selectedMating === m
                      ? "bg-slate-200 font-bold text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{m === "all" ? "All Coupling Types" : m}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="pt-3 border-t border-slate-200 text-center">
            <span className="text-xs font-mono font-bold text-slate-700">
              Showing {filteredProducts.length} of {CATALOG_PRODUCTS.length} Series
            </span>
          </div>
        </div>

        {/* Right Section: Product Catalog Display */}
        <div className="lg:col-span-9 space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="border border-slate-300 bg-white p-12 text-center">
              <Box className="h-10 w-10 mx-auto text-slate-400 mb-3" />
              <h4 className="text-sm font-bold text-slate-900">No matching connectors found</h4>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing or adjusting your search filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 inline-flex items-center gap-1.5 bg-[#002855] text-white px-4 py-2 text-xs font-bold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "cards" ? (
            /* VIEW MODE 1: VISUAL INDUSTRIAL CARDS (PEI-Genesis / Amphenol RF Format) */
            <div className="space-y-4">
              {filteredProducts.map((p) => {
                const qty = getQuantity(p.id, p.moq);
                return (
                  <div
                    key={p.id}
                    className="border border-slate-300 bg-white hover:border-[#002855] transition-all shadow-xs overflow-hidden"
                  >
                    <div className="p-5 flex flex-col md:flex-row items-start gap-5">
                      {/* Left: Product Cutout Image Container */}
                      <div
                        onClick={() => setPreviewProduct(p)}
                        className="w-full md:w-40 h-36 md:h-40 shrink-0 border border-slate-200 bg-slate-50 p-2 flex flex-col items-center justify-center relative cursor-pointer group"
                      >
                        <div className="relative w-28 h-28">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 150px"
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="mt-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                          {p.shellSize || p.category}
                        </span>
                        <div className="absolute inset-0 bg-blue-900/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="bg-[#002855] text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1 shadow-sm">
                            <Eye className="h-3 w-3" /> Inspect CAD
                          </span>
                        </div>
                      </div>

                      {/* Middle: Technical Parameters & Documentation */}
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* MPN & Badges Header */}
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-base font-black text-[#002855] tracking-tight hover:underline cursor-pointer" onClick={() => setPreviewProduct(p)}>
                              {p.mpn}
                            </span>
                            <button
                              onClick={(e) => handleCopyMpn(p.mpn, e)}
                              className="text-slate-400 hover:text-[#002855] transition-colors p-1"
                              title="Copy Part Number"
                            >
                              {copiedMpn === p.mpn ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5">
                              {p.series}
                            </span>
                            {p.badges.map((b) => (
                              <span
                                key={b}
                                className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200"
                              >
                                {b}
                              </span>
                            ))}
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                            {p.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                            {p.description}
                          </p>
                        </div>

                        {/* Parametric Specifications Matrix */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-3 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              Contacts / Pins
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              {p.pinCount} Contacts ({p.contactGender.split(" ")[0]})
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              Current / Voltage
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              {p.currentRating} • {p.voltageRating}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              Environmental Sealing
                            </span>
                            <span className="font-bold text-emerald-700">
                              {p.ipRating}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              Shell Plating / Finish
                            </span>
                            <span className="font-medium text-slate-800">
                              {p.shellPlating}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              Coupling Mechanism
                            </span>
                            <span className="font-medium text-slate-800">
                              {p.matingType} Mating
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              Operating Temp
                            </span>
                            <span className="font-mono font-medium text-slate-800">
                              {p.operatingTemp}
                            </span>
                          </div>
                        </div>

                        {/* Direct Documentation & Cross-Reference */}
                        <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                          <a
                            href={p.datasheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-[#002855] hover:underline"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Download Official PDF Catalogue</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>

                          <button
                            type="button"
                            onClick={() => toggleCompare(p)}
                            className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-2xs border transition-colors cursor-pointer ${
                              compareProducts.some((cp) => cp.id === p.id || cp.mpn === p.mpn)
                                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                : "text-slate-700 hover:text-[#002855] border-slate-300 hover:border-slate-400 bg-slate-50"
                            }`}
                          >
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                            <span>
                              {compareProducts.some((cp) => cp.id === p.id || cp.mpn === p.mpn)
                                ? "In Compare"
                                : "Compare"}
                            </span>
                          </button>

                          <button
                            onClick={() => setPreviewProduct(p)}
                            className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-[#002855]"
                          >
                            <Layers className="h-3.5 w-3.5 text-[#002855]" />
                            <span>3D STEP & CAD Pinout</span>
                          </button>

                          {p.competitorEquivalents.length > 0 && (
                            <span className="text-[11px] text-slate-500">
                              Cross-Ref: <strong className="text-slate-800">{p.competitorEquivalents[0].brand}</strong> ({p.competitorEquivalents[0].partNumber})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Stock, Pricing & RFQ Purchase Action */}
                      <div className="w-full md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-5 flex flex-col justify-between self-stretch space-y-4">
                        <div>
                          {/* Stock Status */}
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>{p.stock.toLocaleString()} in Stock</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {p.warehouse} (24h Dispatch)
                          </p>

                          {/* Unit Pricing */}
                          <div className="mt-3">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Unit Price (@ MOQ {p.moq})
                            </div>
                            <div className="text-lg font-mono font-black text-[#002855]">
                              ₹{p.priceTiers[0].price.toLocaleString("en-IN")}
                              <span className="text-xs font-normal text-slate-500"> + GST</span>
                            </div>
                          </div>

                          {/* Tier Pricing Summary */}
                          <div className="mt-2 text-[10px] text-slate-500 space-y-0.5 font-mono">
                            <div>50+ pcs: ₹{p.priceTiers[1]?.price.toLocaleString("en-IN") || p.priceTiers[0].price} / pc</div>
                            <div>250+ pcs: ₹{p.priceTiers[2]?.price.toLocaleString("en-IN") || p.priceTiers[0].price} / pc</div>
                          </div>
                        </div>

                        {/* Interactive Quantity & Add to RFQ */}
                        <div className="space-y-2">
                          <div className="flex items-center border border-slate-300">
                            <button
                              onClick={() => handleQtyChange(p.id, -1, p.moq)}
                              className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <input
                              type="number"
                              value={qty}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || p.moq;
                                setQuantities((prev) => ({ ...prev, [p.id]: Math.max(p.moq, val) }));
                              }}
                              className="w-full text-center text-xs font-mono font-bold text-slate-900 border-x border-slate-300 py-1.5 focus:outline-none"
                            />
                            <button
                              onClick={() => handleQtyChange(p.id, 1, p.moq)}
                              className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 mt-2">
                            <button
                              onClick={(e) => handleAdd(p, e)}
                              className="flex items-center justify-center gap-1 bg-[#002855] hover:bg-[#001f3f] text-white py-2 text-[11px] font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                              <span>RFQ Cart</span>
                            </button>
                            <button
                              onClick={(e) => {
                                if (e) e.stopPropagation();
                                const qty = getQuantity(p.id, p.moq);
                                startDirectCheckout(p, qty);
                              }}
                              className="flex items-center justify-center gap-1 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2 text-[11px] font-semibold transition-all shadow-2xs active:scale-98 cursor-pointer rounded-xs"
                              title="Direct Corporate Checkout"
                            >
                              <CreditCard className="h-3 w-3 text-slate-600" />
                              <span>Buy</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* VIEW MODE 2: DENSE ENGINEER TABLE (DigiKey format with 52px Photos & full badges) */
            <div className="border border-slate-300 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      <th className="py-3 px-3">Product Photo & MPN</th>
                      <th className="py-3 px-3">Series & Shell</th>
                      <th className="py-3 px-2 text-center">Pins</th>
                      <th className="py-3 px-3">Electrical</th>
                      <th className="py-3 px-2">Sealing</th>
                      <th className="py-3 px-3">Shell Plating</th>
                      <th className="py-3 px-3">Factory Stock</th>
                      <th className="py-3 px-3">Unit Price (MOQ)</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {filteredProducts.map((p) => {
                      const qty = getQuantity(p.id, p.moq);
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-blue-50/60 transition-colors"
                        >
                          {/* Image & MPN */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <div
                                onClick={() => setPreviewProduct(p)}
                                className="w-12 h-12 shrink-0 border border-slate-200 bg-slate-50 p-1 flex items-center justify-center cursor-pointer hover:border-[#002855]"
                              >
                                <div className="relative w-10 h-10">
                                  <Image
                                    src={p.image}
                                    alt={p.mpn}
                                    fill
                                    sizes="40px"
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              <div>
                                <div
                                  onClick={() => setPreviewProduct(p)}
                                  className="font-mono text-xs font-black text-[#002855] hover:underline cursor-pointer"
                                >
                                  {p.mpn}
                                </div>
                                <div className="flex gap-1 mt-0.5">
                                  {p.badges.slice(0, 1).map((b) => (
                                    <span
                                      key={b}
                                      className="bg-blue-50 text-blue-800 border border-blue-200 px-1 py-0.2 text-[9px] font-semibold"
                                    >
                                      {b}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Series */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{p.series}</div>
                            <div className="text-[11px] text-slate-500 font-normal">
                              {p.shellSize ? `${p.shellSize} • ` : ""}{p.matingType} Mating
                            </div>
                          </td>

                          {/* Pins */}
                          <td className="py-3 px-2 text-center font-mono font-bold text-slate-800">
                            {p.pinCount}
                          </td>

                          {/* Electrical */}
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                            <div>{p.currentRating}</div>
                            <div className="text-slate-500">{p.voltageRating}</div>
                          </td>

                          {/* Sealing */}
                          <td className="py-3 px-2">
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 text-[10px] font-bold whitespace-nowrap">
                              {p.ipRating}
                            </span>
                          </td>

                          {/* Shell Plating (Full text badge, no truncation!) */}
                          <td className="py-3 px-3">
                            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 text-[11px] font-medium border border-slate-200 inline-block">
                              {p.shellPlating}
                            </span>
                          </td>

                          {/* Factory Stock */}
                          <td className="py-3 px-3">
                            <div className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              {p.stock.toLocaleString()} pcs
                            </div>
                            <div className="text-[10px] text-slate-500">{p.warehouse}</div>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-3">
                            <div className="font-mono font-bold text-[#002855]">
                              ₹{p.priceTiers[0].price.toLocaleString("en-IN")}
                            </div>
                            <div className="text-[10px] text-slate-500">MOQ: {p.moq} pcs</div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => toggleCompare(p)}
                                className={`p-1.5 border transition-colors cursor-pointer ${
                                  compareProducts.some((cp) => cp.id === p.id || cp.mpn === p.mpn)
                                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                    : "border-slate-300 bg-white text-slate-600 hover:border-[#002855] hover:text-[#002855]"
                                }`}
                                title="Add to side-by-side comparison"
                              >
                                <ArrowLeftRight className="h-3.5 w-3.5" />
                              </button>

                              <button
                                onClick={() => setPreviewProduct(p)}
                                className="border border-slate-300 bg-white p-1.5 text-slate-600 hover:border-[#002855] hover:text-[#002855]"
                                title="Inspect CAD & Spec Sheet"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>

                              <button
                                onClick={() => handleAdd(p)}
                                className="flex items-center gap-1 bg-[#002855] hover:bg-[#001f3f] px-2 py-1.5 text-[11px] font-bold text-white shadow-xs cursor-pointer"
                                title="Add to RFQ Cart"
                              >
                                <Plus className="h-3 w-3" />
                                RFQ
                              </button>

                              <button
                                onClick={() => {
                                  const qty = getQuantity(p.id, p.moq);
                                  startDirectCheckout(p, qty);
                                }}
                                className="flex items-center gap-1 border border-slate-300 bg-white hover:bg-slate-100 px-2 py-1.5 text-[11px] font-semibold text-slate-800 shadow-2xs cursor-pointer rounded-xs"
                                title="Direct Corporate Checkout & Payment"
                              >
                                <CreditCard className="h-3 w-3 text-slate-600" />
                                Buy
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED ENGINEERING SPEC SHEET MODAL (Quick View Drawer) */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-slate-300 bg-white p-6 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setPreviewProduct(null)}
              className="absolute right-4 top-4 border border-slate-200 bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
              <div className="w-20 h-20 shrink-0 border border-slate-200 bg-slate-50 p-2 flex items-center justify-center relative">
                <Image
                  src={previewProduct.image}
                  alt={previewProduct.mpn}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-lg font-black text-[#002855]">
                    {previewProduct.mpn}
                  </h3>
                  <span className="bg-[#002855] text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                    {previewProduct.series}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  {previewProduct.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {previewProduct.description}
                </p>
              </div>
            </div>

            {/* Detailed Parameters Grid */}
            <div className="py-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                Technical & Environmental Specification Matrix
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Contact Layout</span>
                  <p className="font-mono font-bold text-slate-900">{previewProduct.pinCount} Positions ({previewProduct.contactGender})</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Current Rating</span>
                  <p className="font-mono font-bold text-slate-900">{previewProduct.currentRating}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Voltage Rating</span>
                  <p className="font-mono font-bold text-slate-900">{previewProduct.voltageRating}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Environmental Ingress</span>
                  <p className="font-bold text-emerald-700">{previewProduct.ipRating}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Operating Temperature</span>
                  <p className="font-mono font-medium text-slate-900">{previewProduct.operatingTemp}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Shell Plating</span>
                  <p className="font-medium text-slate-900">{previewProduct.shellPlating}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Mating Coupling</span>
                  <p className="font-medium text-slate-900">{previewProduct.matingType}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Shell Size</span>
                  <p className="font-mono font-bold text-slate-900">{previewProduct.shellSize || "Standard"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Lead Time</span>
                  <p className="font-medium text-emerald-700">{previewProduct.leadTime}</p>
                </div>
              </div>

              {/* Volume Tier Pricing Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Volume Price Schedule (Plant Direct Invoicing)
                </h4>
                <div className="grid grid-cols-4 gap-2 border border-slate-200 p-2 text-center text-xs">
                  {previewProduct.priceTiers.map((tier) => (
                    <div key={tier.qty} className="bg-slate-50 p-2">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">{tier.qty}+ pcs</div>
                      <div className="font-mono font-bold text-[#002855] text-sm">
                        ₹{tier.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Cross Reference */}
              {previewProduct.competitorEquivalents.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Verified Competitor Cross-Reference Equivalents
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {previewProduct.competitorEquivalents.map((c) => (
                      <div
                        key={c.partNumber}
                        className="bg-slate-100 border border-slate-200 px-3 py-1 text-xs"
                      >
                        <span className="text-slate-500">{c.brand}: </span>
                        <span className="font-mono font-bold text-[#002855]">{c.partNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <a
                href={previewProduct.datasheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-[#002855] hover:underline"
              >
                <FileText className="h-4 w-4" />
                <span>Open Official Amphenol PDF Catalogue</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="px-4 py-2 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAdd(previewProduct);
                    setPreviewProduct(null);
                  }}
                  className="flex items-center gap-1.5 bg-[#002855] hover:bg-[#001f3f] text-white px-5 py-2 text-xs font-bold shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to RFQ Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
