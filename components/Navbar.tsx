"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRfq } from "@/context/RfqContext";
import {
  Search,
  Bot,
  FileSpreadsheet,
  Sliders,
  ShoppingBag,
  ChevronDown,
  Phone,
  FileText,
  User,
  ShieldCheck,
  Check,
  ArrowRight,
  CreditCard,
  MapPin,
  Building2,
} from "lucide-react";

export function Navbar() {
  const {
    items,
    totalQuantity,
    subtotal,
    setIsRfqOpen,
    setIsAiAdvisorOpen,
    setIsSearchOpen,
    activeTab,
    setActiveTab,
    startDirectCheckout,
    openTracking,
    setIsAdminOpen,
  } = useRfq();

  const [inStockOnly, setInStockOnly] = useState(true);
  const [rohsOnly, setRohsOnly] = useState(true);
  const [isCartHovered, setIsCartHovered] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsSearchOpen]);

  return (
    <>
      {/* 1. TOP UTILITY BAR (Fully Responsive) */}
      <div className="bg-[#00183b] text-slate-300 text-xs px-3 sm:px-6 py-1 border-b border-[#002855]/60">
        <div className="mx-auto max-w-[1850px] flex items-center justify-between text-[11px]">
          {/* Left: Plant Status */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
            <span className="font-medium text-slate-300">Pune Plant Direct</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">Toll Free: +91 20 2712 0481</span>
          </div>

          {/* Right: Quick Links (Hidden on small mobile, essential links shown) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span
              onClick={() => setActiveTab("catalog")}
              className="cursor-pointer hover:text-white transition-colors hidden md:inline"
            >
              Compliance &amp; Certifications
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span
              onClick={() => setActiveTab("bom")}
              className="cursor-pointer hover:text-white transition-colors hidden lg:inline"
            >
              Competitor Cross-Ref
            </span>
            <span className="text-slate-600 hidden lg:inline">|</span>
            <span
              onClick={() => setActiveTab("catalog")}
              className="cursor-pointer hover:text-white transition-colors hidden sm:inline"
            >
              Distributor Stock
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span
              onClick={() => openTracking()}
              className="cursor-pointer text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 font-bold"
              title="Track Pune Factory Dispatch & BlueDart Air Express Waybill"
            >
              <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Track Order</span>
            </span>
            <span className="text-slate-600">|</span>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs hover:from-blue-500 hover:to-indigo-500 transition-all border border-blue-400/40"
              title="Open Enterprise Staff Portal & Live CRM Dashboard"
            >
              <Building2 className="h-3 w-3 text-blue-200" />
              <span>Staff Portal &amp; CRM</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-white font-semibold flex items-center gap-1 cursor-default">
              <span>🇮🇳</span>
              <span className="hidden xs:inline">INR</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. STICKY MAIN HEADER & ROYAL NAV */}
      <header className="sticky top-0 z-40 w-full bg-[#001435] font-sans border-b border-[#002855] shadow-md">
        <div className="mx-auto max-w-[1850px] px-3 py-2 sm:px-6">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Official Amphenol RF Vector SVG */}
            <div
              onClick={() => setActiveTab("overview")}
              className="flex cursor-pointer items-center shrink-0 select-none py-1 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/amphenol-rf-site.svg"
                alt="Amphenol RF"
                className="h-7 sm:h-9 w-auto object-contain group-hover:opacity-95 transition-opacity"
              />
            </div>

            {/* Large Precision Search Bar (Desktop only, lg+) */}
            <div className="hidden lg:flex flex-1 max-w-2xl items-center">
              <div className="w-full">
                <div className="flex items-center border border-slate-400 bg-white focus-within:border-[#002855] focus-within:ring-1 focus-within:ring-[#002855] shadow-2xs transition-all">
                  {/* Category Dropdown */}
                  <div
                    onClick={() => setActiveTab("catalog")}
                    className="flex items-center gap-1 border-r border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer select-none shrink-0 hover:bg-slate-100 transition-colors"
                  >
                    <span>Parts</span>
                    <ChevronDown className="h-3 w-3 text-slate-500" />
                  </div>

                  {/* Input trigger */}
                  <div
                    onClick={() => setIsSearchOpen(true)}
                    className="flex-1 flex items-center px-3 py-2 text-xs text-slate-400 cursor-pointer select-none"
                  >
                    <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                    <span>Enter Part Number, Series, or Competitor MPN (e.g. D38999, DTS26W)...</span>
                  </div>

                  <kbd className="mr-2 border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                    Ctrl+K
                  </kbd>

                  {/* Blue Search Action Button */}
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-[#002855] hover:bg-[#001D3D] text-white px-5 py-2.5 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* In-Stock & RoHS checkboxes */}
                <div className="flex items-center gap-4 mt-1.5 text-[11px] text-slate-300 font-medium">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="h-3.5 w-3.5 border-slate-300 text-[#002855] focus:ring-[#002855]"
                    />
                    <span>In Stock (Pune Warehouse)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rohsOnly}
                      onChange={(e) => setRohsOnly(e.target.checked)}
                      className="h-3.5 w-3.5 border-slate-300 text-[#002855] focus:ring-[#002855]"
                    />
                    <span>RoHS / REACH Compliant</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Action Icons: AI Advisor + Quick Checkout + RFQ Cart */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              {/* AI Advisor Button */}
              <button
                onClick={() => setIsAiAdvisorOpen(true)}
                className="flex items-center gap-1.5 border border-blue-400/40 bg-white/10 hover:bg-white/20 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white active:scale-98 transition-all rounded-xs cursor-pointer"
                title="AI Technical Connector Advisor"
              >
                <Bot className="h-4 w-4 text-blue-300" />
                <span className="hidden sm:inline">AI Advisor</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              </button>

              {/* Quick Checkout Button (Visible sm+) */}
              <button
                onClick={() => startDirectCheckout()}
                className="hidden sm:flex items-center gap-1.5 border border-blue-400/40 bg-white/10 hover:bg-white/20 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold active:scale-98 transition-all rounded-xs cursor-pointer"
                title="Direct Corporate Checkout & Payment"
              >
                <CreditCard className="h-3.5 w-3.5 text-blue-300" />
                <span className="hidden md:inline">Quick Checkout</span>
                <span className="md:hidden">Buy</span>
              </button>

              {/* Cart Button with Hover Preview Drawer */}
              <div
                className="relative"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <button
                  onClick={() => setIsRfqOpen(true)}
                  className="flex items-center gap-2 bg-[#002855] hover:bg-[#001D3D] text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold active:scale-98 transition-all shadow-xs rounded-xs cursor-pointer border border-blue-400/30"
                >
                  <div className="relative">
                    <ShoppingBag className="h-4 w-4 text-blue-200" />
                    {totalQuantity > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D32F2F] px-1 text-[9px] font-bold text-white">
                        {totalQuantity}
                      </span>
                    )}
                  </div>
                  <div className="text-left hidden xs:block">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-300 font-semibold leading-none">
                      Basket
                    </span>
                    <span className="font-mono text-xs font-bold text-white leading-tight">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </button>

                {/* Micro-Interaction: Hover Mini Cart Dropdown */}
                {isCartHovered && items.length > 0 && (
                  <div className="absolute right-0 top-full pt-2 z-50 w-80 sm:w-84 animate-fadeIn">
                    <div className="border border-slate-300 bg-white p-4 shadow-2xl text-slate-900 text-xs">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                        <span className="font-bold uppercase tracking-wider text-[#002855]">
                          Order Basket ({items.length} SKUs • {totalQuantity} pcs)
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium font-mono">24h Dispatch</span>
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-100">
                        {items.map((item) => (
                          <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-mono font-bold text-[#002855] truncate">
                                {item.product.mpn}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Qty: {item.quantity} pcs • ₹{item.unitPrice.toLocaleString("en-IN")}/pc
                              </div>
                            </div>
                            <div className="font-mono font-bold text-slate-800 text-right shrink-0">
                              ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between font-bold">
                        <span>Subtotal:</span>
                        <span className="font-mono text-[#002855] text-sm">
                          ₹{subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Primary Action: Direct Checkout */}
                      <button
                        onClick={() => {
                          setIsCartHovered(false);
                          startDirectCheckout();
                        }}
                        className="mt-3 w-full bg-[#002855] hover:bg-[#001D3D] text-white py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-xs shadow-xs"
                      >
                        <CreditCard className="h-3.5 w-3.5 text-blue-200" />
                        <span>Proceed to Checkout (₹{subtotal.toLocaleString("en-IN")})</span>
                      </button>

                      {/* Secondary Action: Formal RFQ */}
                      <button
                        onClick={() => {
                          setIsCartHovered(false);
                          setIsRfqOpen(true);
                        }}
                        className="mt-1.5 w-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-1.5 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer rounded-xs"
                      >
                        <span>Generate Formal RFQ Quotation</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Input Bar */}
          <div className="mt-2 lg:hidden">
            <div
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-between border border-slate-300 bg-white px-3 py-2 text-xs text-slate-500 rounded-xs shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">Search 15,000+ connectors, MPNs...</span>
              </div>
              <kbd className="border border-slate-200 bg-slate-100 px-1 font-mono text-[9px] shrink-0">
                Search
              </kbd>
            </div>
          </div>
        </div>
      </header>

      {/* 3. SOLID ROYAL NAVY NAVIGATION BAR (Touch-Swipeable on Mobile) */}
      <div className="bg-[#002855] text-white text-xs font-bold border-t border-[#001d3d]">
        <div className="mx-auto max-w-[1850px] px-2 sm:px-6 flex items-center justify-between">
          <nav className="flex items-center space-x-1 py-0 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap shrink-0 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-[#001833] transition-all flex items-center gap-1.5 uppercase tracking-wider text-[10px] sm:text-[11px] cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "overview" ? "bg-[#001833] text-white border-b-2 border-[#D32F2F]" : "text-slate-100"
              }`}
            >
              Products &amp; Sectors
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-[#001833] transition-all flex items-center gap-1.5 uppercase tracking-wider text-[10px] sm:text-[11px] cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "catalog" ? "bg-[#001833] text-white border-b-2 border-[#D32F2F]" : "text-slate-100"
              }`}
            >
              Parametric Catalog
            </button>

            <button
              onClick={() => setActiveTab("configurator")}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-[#001833] transition-all flex items-center gap-1.5 uppercase tracking-wider text-[10px] sm:text-[11px] cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "configurator" ? "bg-[#001833] text-white border-b-2 border-[#D32F2F]" : "text-slate-100"
              }`}
            >
              <Sliders className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>3D Part Builder</span>
            </button>

            <button
              onClick={() => setActiveTab("bom")}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-[#001833] transition-all flex items-center gap-1.5 uppercase tracking-wider text-[10px] sm:text-[11px] cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "bom" ? "bg-[#001833] text-white border-b-2 border-[#D32F2F]" : "text-slate-100"
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>BOM Excel Importer</span>
            </button>
          </nav>

          <div className="hidden xl:flex items-center space-x-3 text-[11px] text-blue-200 shrink-0">
            <span>Direct Plant Dispatch: <strong className="text-white">Pune Central Hub</strong></span>
            <span>•</span>
            <span className="text-emerald-300">100% Domestic GST Credit</span>
          </div>
        </div>
      </div>
    </>
  );
}
