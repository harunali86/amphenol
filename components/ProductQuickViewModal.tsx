"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRfq } from "@/context/RfqContext";
import {
  X,
  Check,
  Copy,
  Plus,
  Minus,
  Download,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Building2,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";

export function ProductQuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToRfq,
    setActiveTab,
    setIsRfqOpen,
    toggleCompare,
    compareProducts,
    startDirectCheckout,
  } = useRfq();

  const [qty, setQty] = useState<number>(10);
  const [copied, setCopied] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);

  // Sync default quantity whenever a new product is opened
  useEffect(() => {
    if (quickViewProduct) {
      setQty(quickViewProduct.moq || 10);
      setCopied(false);
      setAddedFeedback(false);
      setHoveredPin(null);
    }
  }, [quickViewProduct]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const basePrice = product.priceTiers[0]?.price || 2850;

  // Generate volume discount tiers
  const volumeTiers = [
    { qty: "1–9 pcs", tier: "Prototype", price: Math.round(basePrice * 1.15), discount: "Standard" },
    { qty: `${product.moq}–49 pcs`, tier: "Pilot Batch", price: basePrice, discount: "Standard MOQ" },
    { qty: "50–249 pcs", tier: "Batch Production", price: Math.round(basePrice * 0.86), discount: "Save 14%" },
    { qty: "250+ pcs", tier: "Plant Contract", price: Math.round(basePrice * 0.74), discount: "Save 26%" },
  ];

  const handleCopyMpn = () => {
    navigator.clipboard.writeText(product.mpn);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleAddRfq = () => {
    addToRfq(product, qty, "catalog");
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  // Generate concentric circular pins based on pin count
  const renderPinoutSvg = () => {
    const count = Math.min(product.pinCount, 128);
    const cx = 100;
    const cy = 100;
    const pins: { id: number; x: number; y: number; size: number }[] = [];

    if (count <= 15) {
      // 1-ring layout
      const r = 45;
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
        pins.push({ id: i + 1, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), size: 4.5 });
      }
    } else if (count <= 40) {
      // 2-ring layout
      const r1 = 28;
      const count1 = Math.round(count * 0.35);
      const r2 = 60;
      const count2 = count - count1;
      let id = 1;
      for (let i = 0; i < count1; i++) {
        const angle = (i * 2 * Math.PI) / count1 - Math.PI / 2;
        pins.push({ id: id++, x: cx + r1 * Math.cos(angle), y: cy + r1 * Math.sin(angle), size: 3.5 });
      }
      for (let i = 0; i < count2; i++) {
        const angle = (i * 2 * Math.PI) / count2 - Math.PI / 2;
        pins.push({ id: id++, x: cx + r2 * Math.cos(angle), y: cy + r2 * Math.sin(angle), size: 3.5 });
      }
    } else {
      // 3-ring layout
      const r1 = 18;
      const r2 = 42;
      const r3 = 68;
      const count1 = Math.round(count * 0.15);
      const count2 = Math.round(count * 0.35);
      const count3 = count - count1 - count2;
      let id = 1;
      for (let i = 0; i < count1; i++) {
        const angle = (i * 2 * Math.PI) / count1 - Math.PI / 2;
        pins.push({ id: id++, x: cx + r1 * Math.cos(angle), y: cy + r1 * Math.sin(angle), size: 3 });
      }
      for (let i = 0; i < count2; i++) {
        const angle = (i * 2 * Math.PI) / count2 - Math.PI / 2;
        pins.push({ id: id++, x: cx + r2 * Math.cos(angle), y: cy + r2 * Math.sin(angle), size: 3 });
      }
      for (let i = 0; i < count3; i++) {
        const angle = (i * 2 * Math.PI) / count3 - Math.PI / 2;
        pins.push({ id: id++, x: cx + r3 * Math.cos(angle), y: cy + r3 * Math.sin(angle), size: 3 });
      }
    }

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Outer Circular Shell */}
        <circle cx={cx} cy={cy} r="92" fill="#001433" stroke="#3b82f6" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="85" fill="#00183b" stroke="#1d4ed8" strokeWidth="1" strokeDasharray="3 3" />
        
        {/* Alignment Key Notch */}
        <rect x="95" y="6" width="10" height="7" fill="#60a5fa" rx="1" />
        <circle cx={cx} cy="10" r="1.5" fill="#ffffff" />

        {/* Concentric Guide Circles */}
        <circle cx={cx} cy={cy} r="68" fill="none" stroke="#1e3a8a" strokeWidth="0.5" strokeDasharray="2 4" />
        <circle cx={cx} cy={cy} r="42" fill="none" stroke="#1e3a8a" strokeWidth="0.5" strokeDasharray="2 4" />
        <circle cx={cx} cy={cy} r="18" fill="none" stroke="#1e3a8a" strokeWidth="0.5" strokeDasharray="2 4" />

        {/* Dynamic Pins */}
        {pins.map((pin) => {
          const isHov = hoveredPin === pin.id;
          return (
            <g
              key={pin.id}
              onMouseEnter={() => setHoveredPin(pin.id)}
              onMouseLeave={() => setHoveredPin(null)}
              className="cursor-pointer"
            >
              {isHov && (
                <circle cx={pin.x} cy={pin.y} r={pin.size + 4} fill="#38bdf8" opacity="0.4" />
              )}
              <circle
                cx={pin.x}
                cy={pin.y}
                r={pin.size}
                fill={isHov ? "#ffffff" : "#facc15"}
                stroke={isHov ? "#38bdf8" : "#ca8a04"}
                strokeWidth={isHov ? "1.5" : "0.75"}
              />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-[#000c1e]/80 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-sm border border-slate-300 bg-white shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#001435] text-white px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 border border-blue-400/30 px-2 py-0.5 rounded-2xs">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-base sm:text-lg font-black text-amber-300">
              <span>{product.mpn}</span>
              <button
                onClick={handleCopyMpn}
                title="Copy Part Number"
                className="text-slate-400 hover:text-white p-1 rounded-xs transition-colors cursor-pointer"
              >
                {copied ? (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-0.5 font-sans">
                    <Check className="h-3.5 w-3.5" /> Copied!
                  </span>
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Pune Plant Stock: {product.stock.toLocaleString()} pcs</span>
            </span>
            <button
              onClick={() => setQuickViewProduct(null)}
              className="text-slate-400 hover:text-white p-1 rounded-xs transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Hardware Preview & Concentric Pinout Diagram */}
            <div className="lg:col-span-5 space-y-4">
              {/* Product Photo Stage */}
              <div className="relative h-52 bg-slate-50 border border-slate-200 rounded-xs p-3 flex items-center justify-center overflow-hidden group">
                <Image
                  src={product.image}
                  alt={product.mpn}
                  fill
                  sizes="300px"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-[#001435]/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-2xs">
                  {product.series}
                </div>
                <div className="absolute bottom-2 right-2 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-2xs">
                  24H Dispatch
                </div>
              </div>

              {/* Inside Face Pinout Preview Card */}
              <div className="bg-[#001026] text-white border border-blue-400/25 p-4 rounded-xs relative">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                  <span className="font-bold text-blue-300">Front Face Pin Layout</span>
                  <span className="text-amber-400 font-bold">{product.pinCount} Gold Contacts</span>
                </div>

                <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                  {renderPinoutSvg()}
                  <div className="absolute -bottom-2 bg-[#001435] border border-blue-400/40 px-2.5 py-0.5 text-[10px] font-mono text-slate-200 rounded-full flex items-center gap-1 shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>
                      {hoveredPin
                        ? `Pin #${hoveredPin} • ${product.currentRating} • Gold`
                        : "Hover on gold pin"}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center mt-3 font-mono">
                  Pure 24K Gold-Plated Copper Alloy Contacts
                </div>
              </div>

              {/* Verified Accreditations Strip */}
              <div className="border border-slate-200 bg-slate-50 p-3 rounded-xs space-y-1.5 text-xs">
                <div className="font-bold text-[#002855] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Factory Compliance &amp; Standards</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600 font-medium">
                  <span className="flex items-center gap-1">✓ AS9100D Certified</span>
                  <span className="flex items-center gap-1">✓ MIL-STD-790 Audited</span>
                  <span className="flex items-center gap-1">✓ IP68 Submersible</span>
                  <span className="flex items-center gap-1">✓ 100% Domestic GST ITC</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Full Specs, Volume Tiers & RFQ Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h3 className="text-lg font-black text-[#002855] leading-snug">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  High-reliability interconnect manufactured at Amphenol Interconnect India Bhosari, Pune. Featuring anti-decoupling vibration retention, 360° EMI shielding, and tested for defense, aerospace, and severe environment applications.
                </p>
              </div>

              {/* Tiered Volume Pricing Matrix */}
              <div className="border border-slate-200 rounded-xs overflow-hidden">
                <div className="bg-slate-100/90 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-800">
                    Tiered Volume Pricing (Pune Factory Direct)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700">
                    +100% Domestic GST Credit
                  </span>
                </div>
                <div className="grid grid-cols-4 divide-x divide-slate-200 text-center bg-white">
                  {volumeTiers.map((t, idx) => (
                    <div key={idx} className="p-2.5 hover:bg-blue-50/50 transition-colors">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                        {t.qty}
                      </span>
                      <strong className="text-sm font-black text-[#002855] font-mono block mt-0.5">
                        ₹{t.price.toLocaleString("en-IN")}
                      </strong>
                      <span className={`text-[9px] font-bold block mt-0.5 ${idx > 1 ? "text-emerald-600" : "text-slate-400"}`}>
                        {t.discount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Technical Specifications Matrix
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Series</span>
                    <strong className="text-slate-800 font-medium">{product.series}</strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Contact Pin Count</span>
                    <strong className="text-slate-800 font-medium">{product.pinCount} Pins</strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Current Capacity</span>
                    <strong className="text-slate-800 font-medium">{product.currentRating}</strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Voltage Rating</span>
                    <strong className="text-slate-800 font-medium">{product.voltageRating}</strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Operating Temp</span>
                    <strong className="text-slate-800 font-medium">{product.operatingTemp}</strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Mating Style</span>
                    <strong className="text-slate-800 font-medium">{product.matingType}</strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Shell Size</span>
                    <strong className="text-slate-800 font-medium">{product.shellSize}</strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">HSN Code (Tax)</span>
                    <strong className="text-slate-800 font-mono">8536.69.90 (18% GST)</strong>
                  </div>
                </div>
              </div>

              {/* Ordering Controls & RFQ Action */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">Order Quantity:</span>
                    <div className="flex items-center border border-slate-300 bg-white rounded-xs overflow-hidden h-9">
                      <button
                        onClick={() => setQty((prev) => Math.max(product.moq || 1, prev - (product.moq || 10)))}
                        disabled={qty <= (product.moq || 1)}
                        className="px-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer h-full"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 font-mono text-sm font-bold text-slate-900 min-w-10 text-center select-none">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty((prev) => prev + (product.moq || 10))}
                        className="px-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer h-full"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal Calculation */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Total</span>
                    <strong className="text-base font-black text-[#002855] font-mono">
                      ₹{(basePrice * qty).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                {/* Primary & Secondary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleAddRfq}
                    className={`flex-1 py-2.5 px-4 text-xs font-bold transition-all shadow-md rounded-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                      addedFeedback
                        ? "bg-emerald-600 text-white scale-102 shadow-emerald-500/30"
                        : "bg-[#002855] hover:bg-[#001D3D] text-white"
                    }`}
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Added {qty} units to RFQ Basket!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Add {qty} pcs to RFQ Quote</span>
                      </>
                    )}
                  </button>

                  {/* Direct Order Button */}
                  <button
                    onClick={() => {
                      if (quickViewProduct) {
                        startDirectCheckout(quickViewProduct, qty);
                        setQuickViewProduct(null);
                      }
                    }}
                    className="border border-[#002855] bg-white hover:bg-slate-50 text-[#002855] py-2.5 px-4 text-xs font-semibold rounded-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <CreditCard className="h-3.5 w-3.5 text-[#002855]" />
                    <span>Direct Order</span>
                  </button>

                  <button
                    onClick={() => {
                      setQuickViewProduct(null);
                      setIsRfqOpen(true);
                    }}
                    className="border border-[#002855] text-[#002855] hover:bg-blue-50 py-2.5 px-4 text-xs font-bold rounded-xs transition-colors cursor-pointer"
                  >
                    View RFQ Cart
                  </button>

                  <button
                    onClick={() => {
                      setQuickViewProduct(null);
                      setActiveTab("configurator");
                    }}
                    className="border border-slate-300 text-slate-700 hover:bg-slate-100 py-2.5 px-3.5 text-xs font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wrench className="h-3.5 w-3.5 text-blue-700" />
                    <span>3D Configurator</span>
                  </button>

                  {/* Compare Toggle Button */}
                  {quickViewProduct && (
                    <button
                      type="button"
                      onClick={() => toggleCompare(quickViewProduct)}
                      className={`border py-2.5 px-3.5 text-xs font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                        compareProducts.some(
                          (cp) => cp.id === quickViewProduct.id || cp.mpn === quickViewProduct.mpn
                        )
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "border-slate-300 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                      <span>
                        {compareProducts.some(
                          (cp) => cp.id === quickViewProduct.id || cp.mpn === quickViewProduct.mpn
                        )
                          ? "In Compare List"
                          : "Add to Compare"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
