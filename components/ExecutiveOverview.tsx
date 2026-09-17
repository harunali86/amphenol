"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRfq } from "@/context/RfqContext";
import { CATALOG_PRODUCTS } from "@/data/catalog";
import {
  Wrench,
  FileText,
  Bot,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Plus,
  Minus,
  Sliders,
  ArrowLeftRight,
  UploadCloud,
  Clock,
  Receipt,
  Headphones,
  Download,
  Copy,
  Check,
  Sparkles,
  Box,
  Phone,
  CreditCard,
  Eye,
  X,
} from "lucide-react";

export function ExecutiveOverview() {
  const {
    setActiveTab,
    setIsRfqOpen,
    setIsAiAdvisorOpen,
    addToRfq,
    setQuickViewProduct,
    toggleCompare,
    compareProducts,
    startDirectCheckout,
  } = useRfq();
  const [copiedMpn, setCopiedMpn] = useState<string | null>(null);
  const [addedMpn, setAddedMpn] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<{
    title: string;
    authority: string;
    code: string;
    image: string;
    scope: string;
  } | null>(null);

  const [selectedShellSize, setSelectedShellSize] = useState<"11" | "15" | "19" | "25">("19");
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);
  const [activeMpnToken, setActiveMpnToken] = useState<string | null>("35");

  const SHELL_CONFIGS = {
    "11": { shell: "Shell 11", code: "B", pins: 13, mpn: "D38999/26WB35PN", rating: "5.0A (Size 22D)", wire: "22-28 AWG", voltage: "600 Vrms", stock: 840, price: 1950 },
    "15": { shell: "Shell 15", code: "D", pins: 37, mpn: "D38999/26WD35PN", rating: "5.0A (Size 22D)", wire: "22-28 AWG", voltage: "600 Vrms", stock: 1120, price: 2350 },
    "19": { shell: "Shell 19", code: "F", pins: 66, mpn: "D38999/26WF35PN", rating: "5.0A (Size 22D)", wire: "22-28 AWG", voltage: "600 Vrms", stock: 1420, price: 2850 },
    "25": { shell: "Shell 25", code: "J", pins: 128, mpn: "D38999/26WJ35PN", rating: "5.0A (Size 22D)", wire: "22-28 AWG", voltage: "600 Vrms", stock: 640, price: 3950 },
  };

  const currentShellConfig = SHELL_CONFIGS[selectedShellSize];

  const handleCopyMpn = (mpn: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mpn);
    setCopiedMpn(mpn);
    setTimeout(() => setCopiedMpn(null), 1800);
  };

  const [inventoryCategory, setInventoryCategory] = useState<string>("all");
  const [inventorySearchQuery, setInventorySearchQuery] = useState<string>("");
  const [inventoryQtys, setInventoryQtys] = useState<Record<string, number>>({});

  const getProductQty = (mpn: string, defaultMoq: number) => {
    return inventoryQtys[mpn] || defaultMoq;
  };

  const updateProductQty = (mpn: string, delta: number, moq: number) => {
    const current = getProductQty(mpn, moq);
    const next = Math.max(moq, current + delta);
    setInventoryQtys((prev) => ({ ...prev, [mpn]: next }));
  };


  const handleAddRfqWithFeedback = (product: any, moq: number) => {
    addToRfq(product, moq, "catalog");
    setAddedMpn(product.mpn);
    setTimeout(() => setAddedMpn(null), 1800);
  };

  const getPinsForShell = (shell: "11" | "15" | "19" | "25") => {
    const pins: { id: number; x: number; y: number; size: number }[] = [];
    const cx = 110;
    const cy = 110;
    // Round to 2 decimal places to prevent SSR/client hydration mismatch
    const r2 = (n: number) => Math.round(n * 100) / 100;

    if (shell === "11") {
      pins.push({ id: 1, x: cx, y: cy, size: 5 });
      const r1 = 38;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        pins.push({ id: i + 2, x: r2(cx + r1 * Math.cos(angle)), y: r2(cy + r1 * Math.sin(angle)), size: 4.5 });
      }
      const r2Ring = 68;
      for (let i = 0; i < 7; i++) {
        const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2;
        pins.push({ id: i + 7, x: r2(cx + r2Ring * Math.cos(angle)), y: r2(cy + r2Ring * Math.sin(angle)), size: 4.5 });
      }
    } else if (shell === "15") {
      pins.push({ id: 1, x: cx, y: cy, size: 4.5 });
      const rings = [
        { count: 6, r: 24 },
        { count: 12, r: 48 },
        { count: 18, r: 72 },
      ];
      let id = 2;
      rings.forEach((ring) => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i * 2 * Math.PI) / ring.count - Math.PI / 2;
          pins.push({ id: id++, x: r2(cx + ring.r * Math.cos(angle)), y: r2(cy + ring.r * Math.sin(angle)), size: 4 });
        }
      });
    } else if (shell === "19") {
      const rings = [
        { count: 6, r: 18 },
        { count: 14, r: 38 },
        { count: 20, r: 58 },
        { count: 26, r: 78 },
      ];
      let id = 1;
      rings.forEach((ring) => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i * 2 * Math.PI) / ring.count - Math.PI / 2;
          pins.push({ id: id++, x: r2(cx + ring.r * Math.cos(angle)), y: r2(cy + ring.r * Math.sin(angle)), size: 3.5 });
        }
      });
    } else {
      const rings = [
        { count: 8, r: 16 },
        { count: 16, r: 32 },
        { count: 24, r: 48 },
        { count: 36, r: 64 },
        { count: 44, r: 80 },
      ];
      let id = 1;
      rings.forEach((ring) => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i * 2 * Math.PI) / ring.count - Math.PI / 2;
          pins.push({ id: id++, x: r2(cx + ring.r * Math.cos(angle)), y: r2(cy + ring.r * Math.sin(angle)), size: 3 });
        }
      });
    }
    return pins;
  };

  const activePins = getPinsForShell(selectedShellSize);

  return (
    <div className="space-y-8">
      {/* 1. HERO BANNER: High-Impact Aerospace & Defense Factory Portal with Real Hardware Showcase */}
      <div className="relative border border-slate-300 bg-slate-950 overflow-hidden shadow-md">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Amphenol-Defence.jpg"
            alt="Amphenol Defense Aerospace Engineering"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001026] via-[#00183b]/95 to-[#00183b]/70" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8 sm:px-10 sm:py-14 items-center">
          {/* Left Hero Pitch */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Factory Status Ticker */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-[#001435]/90 border border-blue-400/50 px-2.5 py-0.5 text-[11px] font-bold text-blue-200 tracking-wider uppercase rounded-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span>Pune Bhosari Plant: Shift 2 Active</span>
              </div>
              <span className="text-slate-400 text-xs hidden sm:inline">•</span>
              <div className="inline-flex items-center gap-1 text-[11px] text-slate-300 font-mono">
                <span className="text-emerald-400 font-bold">14,840+ Units</span> Ready Stock
              </div>
              <span className="text-slate-400 text-xs hidden sm:inline">•</span>
              <div className="inline-flex items-center gap-1 text-[11px] text-blue-300 font-mono">
                <span>18.4h Avg Dispatch</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight leading-tight">
              Mission-Critical Interconnects for Defense, Aerospace &amp; EV
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal max-w-2xl">
              Direct Indian manufacturing plant portal with verified Bhosari warehouse stock, certified MIL-SPEC QPL series, sub-30ms parametric finder, and instant domestic GST input tax credit (ITC) invoicing.
            </p>

            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setActiveTab("catalog")}
                className="bg-white hover:bg-slate-100 text-[#002855] text-sm font-bold px-5 py-2.5 transition-all shadow-sm flex items-center justify-center gap-2 rounded-xs cursor-pointer hover:shadow-md active:scale-95"
              >
                <span>Explore 15,000+ SKUs Catalog</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>

              <button
                onClick={() => setActiveTab("configurator")}
                className="bg-[#002855] hover:bg-[#001D3D] text-white text-sm font-bold px-5 py-2.5 border border-white/30 transition-all flex items-center justify-center gap-2 rounded-xs cursor-pointer hover:border-white/60 active:scale-95"
              >
                <Wrench className="h-4 w-4 text-blue-300 shrink-0" />
                <span>3D Mil-Spec Part Builder</span>
              </button>
            </div>
            {/* Direct Plant Capabilities Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Direct Factory Invoicing (Pune Hub)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Full Test Reports &amp; QPL CoC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Same-Day Dispatch for Ready Stock</span>
              </div>
            </div>
          </div>

          {/* Right Hero Hardware Cutaway Showcase */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative rounded-sm border border-blue-400/30 bg-gradient-to-b from-slate-900/90 to-[#001435]/90 p-4 shadow-2xl backdrop-blur-xs">
              <div className="relative h-56 w-full rounded-xs overflow-hidden border border-blue-500/20 bg-slate-950 flex items-center justify-center group">
                <Image
                  src="/images/amphenol-connector-real.jpg"
                  alt="Amphenol Tri-Start D38999 Cutaway"
                  fill
                  sizes="400px"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white">
                  <span className="font-bold text-blue-300">MIL-DTL-38999 Series III</span>
                  <span className="bg-emerald-500/80 px-2 py-0.5 text-[10px] font-bold uppercase rounded-2xs">
                    In Stock (Pune)
                  </span>
                </div>
              </div>

              {/* Floating Hardware Spec Badges */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300">
                <div className="bg-[#00183b]/80 border border-blue-400/20 px-2.5 py-1.5 rounded-2xs">
                  <span className="text-slate-400 block text-[9px]">COUPLING</span>
                  <strong className="text-white">Tri-Start Self-Locking</strong>
                </div>
                <div className="bg-[#00183b]/80 border border-blue-400/20 px-2.5 py-1.5 rounded-2xs">
                  <span className="text-slate-400 block text-[9px]">EMI SHIELDING</span>
                  <strong className="text-white">65dB @ 10 GHz</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Credential Strip */}
        <div className="relative z-10 border-t border-white/10 bg-[#001026]/95 px-6 py-3 text-xs text-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <strong className="text-white">AS9100D &amp; ISO 9001:</strong> Certified Bhosari Pune Facility
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <strong className="text-white">MIL-SPEC QPL Listed:</strong> MIL-DTL-38999, 26482, 83723
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <strong className="text-white">Indian GST Invoicing:</strong> Direct Domestic Input Tax Credit
            </span>
          </div>
          <span className="text-[11px] text-blue-300 font-mono hidden xl:inline">
            Pune Central Warehouse: 105 Bhosari Industrial Area
          </span>
        </div>
      </div>

      {/* 🚀 DEFENSE & TIER-1 OEM STRATEGIC PROGRAMS BANNER */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Tier-1 Interconnect Supplier For Indian Mission-Critical Programs
            </span>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Direct Bhosari plant procurement channel for authorized defense labs, aerospace primes, and commercial EV manufacturers:
            </div>
          </div>

          {/* Strategic Program Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: "DRDO Labs", type: "Defense R&D" },
              { name: "HAL Aerospace", type: "Tejas & Rotors" },
              { name: "Indian Navy", type: "Project 75I Subsea" },
              { name: "ISRO Space", type: "Launch Vehicles" },
              { name: "Tata Motors EV", type: "800V Powertrain" },
              { name: "Mahindra Electric", type: "EV Battery Systems" },
            ].map((p, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span>{p.name}</span>
                <span className="text-[9px] font-normal text-slate-500 dark:text-slate-400">({p.type})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. OFFICIAL MARKET SEGMENTS (Real Aerospace & Defense Photography from amphenol-in.com) */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-300 pb-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002855] uppercase tracking-wider mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>Official Market Segments</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#002855]">
              Market Segments &amp; Mission-Critical Applications
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Amphenol interconnect solutions certified for India&apos;s most demanding defense, space, aerospace, and e-mobility programs
            </p>
          </div>
          <button
            onClick={() => setActiveTab("catalog")}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#002855] hover:underline cursor-pointer"
          >
            <span>View All Programs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Military & Defense",
              subtitle: "Missiles, Radars & Tactical Comms",
              image: "/images/Amphenol-Defence.jpg",
              badge: "MIL-SPEC QPL",
              specs: "MIL-DTL-38999 • 26482 • 5015",
              desc: "Battlefield-proven high-density circular interconnects engineered for extreme shock, vibration, and EMI protection.",
            },
            {
              title: "Commercial & Defense Aerospace",
              subtitle: "Flight Avionics & Turbofans",
              image: "/images/Amphenol-Aerospace.jpg",
              badge: "AS9100D CERTIFIED",
              specs: "Micro-D • Glass Hermetics • EN4165",
              desc: "Lightweight, space-saving avionics connectors certified for commercial jetliners, fighter jets, and satellites.",
            },
            {
              title: "Electric Vehicles & High Power",
              subtitle: "1000V DC RadSok Powertrain",
              image: "/images/products/ev-series.jpg",
              badge: "HVIL TOUCH-PROOF",
              specs: "250A - 400A • IP67 / IP6K9K",
              desc: "Patented RadSok contact technology providing low insertion force and high current density for battery packs and chargers.",
            },
            {
              title: "Industrial & Harsh Telecom",
              subtitle: "Heavy Machinery & Fiber Optics",
              image: "/images/Cable-Harnesses.jpg",
              badge: "IP68 RUGGED",
              specs: "RJField • TFOCA • Custom Looms",
              desc: "Ruggedized ethernet and optical solutions built for harsh Indian monsoons, chemical exposure, and oilfields.",
            },
          ].map((seg, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab("catalog")}
              className="group relative h-80 rounded-sm overflow-hidden border border-slate-300 hover:border-[#002855] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end p-5"
            >
              {/* Full-bleed photography */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={seg.image}
                  alt={seg.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001026] via-[#00183b]/85 to-transparent" />
              </div>

              {/* Foreground content */}
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-[#001435]/90 px-2 py-0.5 border border-blue-400/40 inline-block rounded-2xs">
                  {seg.badge}
                </span>
                <h3 className="text-base font-extrabold text-white group-hover:text-blue-200 transition-colors leading-tight">
                  {seg.title}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-normal">
                  {seg.desc}
                </p>
                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] font-mono text-blue-300">
                  <span>{seg.specs}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. HIGH-RELIABILITY INTERCONNECT FAMILIES (Crisp Hardware Photography & Clean Sizing) */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-300 pb-3 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#002855]">
              High-Reliability Interconnect Families
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Browse Amphenol high-reliability connector series by engineering specifications
            </p>
          </div>

          <button
            onClick={() => setActiveTab("catalog")}
            className="bg-[#002855] hover:bg-[#001D3D] text-white text-xs font-bold px-5 py-2.5 uppercase tracking-wider transition-colors shadow-xs rounded-xs cursor-pointer"
          >
            View All 15,000+ SKUs
          </button>
        </div>

        {/* 8 Product Family Cards with Large Crisp Hardware Photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              title: "MIL-DTL-38999 Series III",
              subtitle: "Tri-Start Circular Plugs & Receptacles",
              specs: "Up to 128 Pins • 65dB EMI",
              badge: "Mil-Spec QPL",
              img: "/images/circular-connector.jpg",
            },
            {
              title: "EV & RadSok High Power",
              subtitle: "1000V DC Touch-Proof Powertrain",
              specs: "250A - 400A • HVIL Interlock",
              badge: "Automotive Grade",
              img: "/images/Cable-Jointing-Connectors.jpg",
            },
            {
              title: "62IN Miniature Bayonet",
              subtitle: "MIL-DTL-26482 Quick Coupling",
              specs: "Quick 3-Point Bayonet • IP67",
              badge: "Defense Standard",
              img: "/images/Fiber-Optic-Connectors.jpg",
            },
            {
              title: "Micro-D 0.050\" Avionics",
              subtitle: "MIL-DTL-83513 Space Grade",
              specs: "Ultra-Compact • Aluminum Shell",
              badge: "Flight Certified",
              img: "/images/Rack-Panel-Connectors.jpg",
            },
            {
              title: "Heavy Duty Circular (AQWLD)",
              subtitle: "Rugged Industrial Power Connectors",
              specs: "Heavy Cable Grips • IP68 Sealed",
              badge: "Industrial Power",
              img: "/images/Audio-Connectors.jpg",
            },
            {
              title: "Vitreous Glass Hermetic",
              subtitle: "True Hermetic Glass-Sealed Series",
              specs: "Zero Leakage <10⁻⁷ cc/sec",
              badge: "True Hermetic",
              img: "/images/pcb-connectors.jpg",
            },
            {
              title: "Harsh Environment RF & RJ",
              subtitle: "RJField / USB3 / TFOCA Fiber",
              specs: "IP68 Sealed • 10 Gbps High Speed",
              badge: "Battlefield Ready",
              img: "/images/rf-connectors.jpg",
            },
            {
              title: "Military Cable Harnesses",
              subtitle: "Overmolded Mil-Spec Loom Assemblies",
              specs: "Custom Wiring • 100% Tested",
              badge: "Bhosari Factory Made",
              img: "/images/Cable-Harnesses.jpg",
            },
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab("catalog")}
              className="group cursor-pointer border border-slate-300 bg-white p-4 hover:border-[#002855] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between rounded-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#002855] transition-colors" />

              <div>
                {/* Large Product Hardware Photo Container */}
                <div className="h-40 bg-gradient-to-b from-slate-50 to-slate-100/80 border border-slate-200 rounded-xs flex items-center justify-center p-3 mb-3 overflow-hidden group-hover:border-[#002855]/40 transition-all relative">
                  <div className="relative w-32 h-32 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={cat.img}
                      alt={cat.title}
                      fill
                      sizes="150px"
                      className="object-contain drop-shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#002855] bg-blue-50 px-2 py-0.5 border border-blue-200 inline-block rounded-2xs">
                    {cat.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">QPL Verified</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1 group-hover:text-[#002855] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {cat.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-mono font-medium text-slate-700 truncate">
                  {cat.specs}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#002855] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. INTERACTIVE CONNECTOR EXPLORER & PART NUMBER GUIDE (Effortless Plain Language) */}
      <div className="border border-blue-500/30 bg-gradient-to-b from-[#001026] via-[#00183b] to-[#000c1e] text-white p-5 sm:p-7 shadow-xl rounded-sm relative overflow-hidden">
        {/* Subtle decorative background blueprint grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-white/15">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-2.5 py-0.5 rounded-2xs text-[10px] font-mono font-bold tracking-widest text-blue-300 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Interactive Product Guide
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                Connector Pin Count &amp; Part Number Guide
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Connector ke andar ki pins dekhein aur Part Number ka matlab aasaani se samjhein — click karke live explore karein:
              </p>
            </div>

            {/* Step 1: Pin Count Quick Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 self-start lg:self-center">
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                Step 1: Choose Pin Count:
              </span>
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 p-1 rounded-xs">
                {(["11", "15", "19", "25"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedShellSize(sz);
                      setHoveredPin(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-all cursor-pointer ${
                      selectedShellSize === sz
                        ? "bg-blue-600 text-white shadow-xs shadow-blue-500/50"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {SHELL_CONFIGS[sz].pins} Pins {sz === "11" ? "(Small)" : sz === "15" ? "(Medium)" : sz === "19" ? "(Standard)" : "(Heavy Duty)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Workbench Body: 2 Columns (Left: Pinout Canvas | Right: Plain Part Number Breakdown) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
            {/* Left: Concentric Gold Pin Contact Arranger */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-black/50 border border-blue-400/20 rounded-xs relative">
              <div className="w-full flex items-center justify-between text-xs font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="font-semibold">Inside Face View (Front of Connector)</span>
                </span>
                <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-xs border border-amber-400/30 text-[11px]">
                  {currentShellConfig.pins} Pure Gold Pins
                </span>
              </div>

              {/* Pin SVG Stage */}
              <div className="relative w-60 h-60 flex items-center justify-center">
                <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-[0_0_15px_rgba(30,64,175,0.4)]">
                  {/* Outer Shell Ring */}
                  <circle cx="110" cy="110" r="102" fill="#001433" stroke="#3b82f6" strokeWidth="2.5" />
                  <circle cx="110" cy="110" r="95" fill="#00183b" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Alignment Keyway Notches */}
                  <rect x="105" y="4" width="10" height="9" fill="#60a5fa" rx="1.5" />
                  <circle cx="110" cy="9" r="1.5" fill="#ffffff" />
                  <rect x="16" y="85" width="8" height="6" fill="#2563eb" rx="1" />
                  <rect x="196" y="85" width="8" height="6" fill="#2563eb" rx="1" />

                  {/* Concentric Guide Rings */}
                  <circle cx="110" cy="110" r="78" fill="none" stroke="#1e3a8a" strokeWidth="0.75" strokeDasharray="2 4" />
                  <circle cx="110" cy="110" r="58" fill="none" stroke="#1e3a8a" strokeWidth="0.75" strokeDasharray="2 4" />
                  <circle cx="110" cy="110" r="38" fill="none" stroke="#1e3a8a" strokeWidth="0.75" strokeDasharray="2 4" />
                  <circle cx="110" cy="110" r="18" fill="none" stroke="#1e3a8a" strokeWidth="0.75" strokeDasharray="2 4" />

                  {/* Dynamic Gold Contact Pins */}
                  {activePins.map((pin) => {
                    const isHovered = hoveredPin === pin.id;
                    return (
                      <g
                        key={pin.id}
                        onMouseEnter={() => setHoveredPin(pin.id)}
                        onMouseLeave={() => setHoveredPin(null)}
                        className="cursor-pointer transition-transform"
                      >
                        {isHovered && (
                          <circle cx={pin.x} cy={pin.y} r={pin.size + 4} fill="#38bdf8" opacity="0.4" />
                        )}
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={pin.size}
                          fill={isHovered ? "#ffffff" : "#facc15"}
                          stroke={isHovered ? "#38bdf8" : "#ca8a04"}
                          strokeWidth={isHovered ? "2" : "1"}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Center Hover Feedback Dot */}
                <div className="absolute -bottom-2 bg-[#001026] border border-blue-400/40 px-3 py-1 text-xs font-semibold text-slate-200 rounded-full flex items-center gap-1.5 shadow-md">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>
                    {hoveredPin
                      ? `Pin #${hoveredPin} • 5.0 Amperes Current • 24K Gold Plated`
                      : "👆 Hover on any gold dot to see pin details"}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-300 text-center font-medium">
                Real gold-plated contact pins inside the connector for clean electrical signals
              </div>
            </div>

            {/* Right: Plain-Language Part Number Breakdown & Pune Factory Availability */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Step 2: How this Part Code is Generated
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Click any box to see what it means:
                  </span>
                </div>

                {/* Interactive Token Pills with descriptive labels */}
                <div className="mt-2 grid grid-cols-7 gap-1.5 p-2 sm:p-3 bg-black/60 border border-blue-400/30 rounded-xs">
                  {[
                    { token: "D38999", label: "Series", meaning: "Military Grade Heavy-Duty Round Connector (Standard Series III)" },
                    { token: "26", label: "Plug Type", meaning: "Straight Cable Plug with quick-turn lock & metal shielding fingers" },
                    { token: "W", label: "Coating", meaning: "Waterproof (IP68) & Rust-Resistant Olive Green protective coating" },
                    { token: currentShellConfig.code, label: "Shell Size", meaning: `Outer Connector Body Size: ${currentShellConfig.shell}` },
                    { token: "35", label: "Pin Count", meaning: `${currentShellConfig.pins} Pure Gold Contact Pins inside the connector` },
                    { token: "P", label: "Pin Gender", meaning: "Male Gold Pins (fits securely into matching Female Socket)" },
                    { token: "N", label: "Lock Key", meaning: "Normal Alignment Key (prevents plugging in backwards or at wrong angle)" },
                  ].map((tok, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMpnToken(tok.token)}
                      className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-xs transition-all cursor-pointer text-center ${
                        activeMpnToken === tok.token
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/50 scale-105 border border-blue-300"
                          : "bg-white/10 text-blue-200 hover:bg-white/20 border border-transparent"
                      }`}
                      title={tok.meaning}
                    >
                      <span className="font-mono text-xs sm:text-base font-black tracking-tight">{tok.token}</span>
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-tight text-slate-300 opacity-90 mt-0.5 leading-tight">{tok.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exploded Plain-Language Meaning Card */}
              <div className="bg-[#001433] border border-blue-400/25 p-4 rounded-xs text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs font-semibold">Full Part Code:</span>
                    <span className="font-mono font-black text-amber-300 text-sm sm:text-base">{currentShellConfig.mpn}</span>
                  </div>
                  <button
                    onClick={(e) => handleCopyMpn(currentShellConfig.mpn, e)}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-xs transition-colors cursor-pointer"
                  >
                    {copiedMpn === currentShellConfig.mpn ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Selected Token Meaning Highlight */}
                {(() => {
                  const tokenDetails: Record<string, string> = {
                    "D38999": "D38999 = MIL-DTL-38999 Series III — The world standard circular connector for defense, aerospace, and harsh environments.",
                    "26": "Code 26 = Straight Cable Plug with internal grounding fingers for 100% electromagnetic shielding.",
                    "W": "Code W = Olive Drab Cadmium plating over nickel — 500-hour salt-spray corrosion protection (100% IP68 waterproof).",
                    [currentShellConfig.code]: `Code ${currentShellConfig.code} = ${currentShellConfig.shell} aluminum alloy shell with anti-vibration self-locking threads.`,
                    "35": `Code 35 = High-density arrangement holding ${currentShellConfig.pins} pure gold contact pins.`,
                    "P": "Code P = Male Pin Contacts (gold-plated copper alloy, rated 5.0 Amperes continuous per pin).",
                    "N": "Code N = Standard Master Keyway orientation (cannot be plugged in upside down).",
                  };
                  const activeText = (activeMpnToken && tokenDetails[activeMpnToken]) || tokenDetails["D38999"];
                  return (
                    <div className="bg-blue-950/60 border-l-2 border-blue-400 p-2.5 rounded-r-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block mb-0.5">
                        Selected Code Meaning:
                      </span>
                      <p className="text-white text-xs font-medium leading-relaxed">
                        {activeText}
                      </p>
                    </div>
                  );
                })()}

                {/* Plain-Language Connector Summary */}
                <div className="text-slate-300 leading-relaxed text-xs">
                  <strong className="text-white">Aasan shabdon mein (Summary):</strong> Yeh ek <span className="text-amber-300 font-bold">{currentShellConfig.pins}-Pin Military Connector Plug</span> hai. Yeh 100% waterproof (IP68) hai, supersonic vibration (Fighter Jet, Drone, Radar) mein bhi loose nahi hota, aur isme pure gold pins lagi hain jo zero rust aur clean electrical signal deti hain.
                </div>

                {/* Pune Factory Stock & Specs Bar */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-black/30 p-2 rounded-xs">
                    <span className="text-slate-400 block text-[10px]">PUNE READY STOCK</span>
                    <strong className="text-emerald-400 font-mono text-xs sm:text-sm">{currentShellConfig.stock.toLocaleString()} units</strong>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xs">
                    <span className="text-slate-400 block text-[10px]">FACTORY PRICE</span>
                    <strong className="text-white font-mono text-xs sm:text-sm">₹{currentShellConfig.price.toLocaleString("en-IN")} / pc</strong>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xs">
                    <span className="text-slate-400 block text-[10px]">TEMPERATURE</span>
                    <strong className="text-white text-xs">-65°C to +175°C</strong>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xs">
                    <span className="text-slate-400 block text-[10px]">DISPATCH SPEED</span>
                    <strong className="text-blue-300 text-xs">24 Hours Direct</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    const dummyProduct = {
                      id: `interactive-${currentShellConfig.mpn}`,
                      mpn: currentShellConfig.mpn,
                      title: `${currentShellConfig.shell} Tri-Start Straight Plug`,
                      series: "MIL-DTL-38999 Series III",
                      category: "Military & Aerospace",
                      moq: 10,
                      priceTiers: [{ qty: 10, price: currentShellConfig.price }],
                      stock: currentShellConfig.stock,
                    };
                    handleAddRfqWithFeedback(dummyProduct, 10);
                  }}
                  className={`px-5 py-2.5 text-xs font-bold transition-all shadow-md rounded-xs flex items-center gap-2 cursor-pointer active:scale-95 ${
                    addedMpn === currentShellConfig.mpn
                      ? "bg-emerald-600 text-white scale-105"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                >
                  {addedMpn === currentShellConfig.mpn ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added to RFQ Cart!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Add {currentShellConfig.pins}-Pin Connector to RFQ</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("configurator")}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-1.5 rounded-xs cursor-pointer"
                >
                  <Wrench className="h-3.5 w-3.5 text-blue-300" />
                  <span>Launch in 3D CAD Configurator</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE TOOLS & FACTORY SERVICES (Photo-Rich Interactive Feature Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool Card 1: 3D Part Builder & Parametric Finder */}
        <div className="border border-slate-300 bg-white rounded-sm overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
          <div className="relative h-44 bg-slate-900 overflow-hidden">
            <Image
              src="/images/amphenol-connector-real.jpg"
              alt="3D Connector Builder"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00183b] via-[#00183b]/60 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-[#00183b]/90 border border-blue-400/40 px-2 py-0.5 rounded-2xs">
                Interactive 3D Engine
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-base font-extrabold text-white leading-tight">
                3D Mil-Spec Part Builder &amp; Parametric Finder
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Generate real-time military part numbers with live pinout topology
              </p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Configure shell size, contact plating, keyway orientations, and pin inserts with live STEP 3D CAD downloads and real-time MPN syntax validation.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 font-mono font-medium rounded-2xs">
                MIL-DTL-38999
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 font-mono font-medium rounded-2xs">
                Dynamic Pinouts
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 font-mono font-bold rounded-2xs border border-blue-200">
                15,000+ SKUs
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveTab("configurator")}
                className="bg-[#002855] hover:bg-[#001D3D] text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer"
              >
                <Wrench className="h-3.5 w-3.5 text-blue-300" />
                <span>Launch 3D Builder</span>
              </button>

              <button
                onClick={() => setActiveTab("catalog")}
                className="text-xs font-bold text-[#002855] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Filter SKUs</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tool Card 2: Smart BOM Excel Tool & Cross-Reference */}
        <div className="border border-slate-300 bg-white rounded-sm overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
          <div className="relative h-44 bg-slate-900 overflow-hidden">
            <Image
              src="/images/Cable-Harnesses.jpg"
              alt="BOM Importer & Cross-Reference"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00183b] via-[#00183b]/60 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 bg-[#00183b]/90 border border-emerald-400/40 px-2 py-0.5 rounded-2xs">
                Batch Procurement Tool
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-base font-extrabold text-white leading-tight">
                Upload Required Parts List (BOM Excel / CSV)
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Instant quote &amp; factory stock matching for 50+ line items
              </p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your project bill-of-materials or required parts spreadsheet (.xlsx / .csv). System automatically matches Pune warehouse stock and provides drop-in QPL cross-referencing for TE &amp; Souriau.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 font-mono font-medium rounded-2xs">
                .xlsx / .csv
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 font-mono font-medium rounded-2xs">
                Parts List Upload
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 font-mono font-bold rounded-2xs border border-emerald-200">
                Instant Auto-Quote
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveTab("bom")}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload Parts List (BOM)</span>
              </button>

              <button
                onClick={() => setActiveTab("bom")}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Find Equivalents</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tool Card 3: Bhosari Factory Assembly (ATO Cell) & 24/7 AI Advisor */}
        <div className="border border-slate-300 bg-white rounded-sm overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
          <div className="relative h-44 bg-slate-900 overflow-hidden">
            <Image
              src="/images/hero-industrial.jpg"
              alt="Bhosari Pune Plant Assembly Cell"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00183b] via-[#00183b]/60 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-[#00183b]/90 border border-amber-400/40 px-2 py-0.5 rounded-2xs">
                48-Hour Dispatch Line
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-base font-extrabold text-white leading-tight">
                Assemble-to-Order Cell &amp; 24/7 AI Technical Advisor
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Direct Bhosari plant assembly with verified engineering AI assistance
              </p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast-turnaround military connector assembly directly from Bhosari, Pune. Ask natural-language engineering questions on Mil-Spec mateability and compliances.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 font-mono font-medium rounded-2xs">
                Pune Plant Hub
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 font-mono font-medium rounded-2xs">
                100% GST ITC
              </span>
              <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 font-mono font-bold rounded-2xs border border-purple-200">
                Mil-Spec Trained
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setIsAiAdvisorOpen(true)}
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ask AI Advisor</span>
              </button>

              <button
                onClick={() => setIsRfqOpen(true)}
                className="text-xs font-bold text-[#002855] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Request ATO Quote</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. IMMEDIATE FACTORY DISPATCH INVENTORY TABLE (Interactive Category Tabs & Live Search) */}
      <div className="border border-slate-300 bg-white shadow-xs rounded-xs overflow-hidden">
        {/* Table Top Header */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#002855]">
                Immediate Dispatch Inventory — Pune Central Logistics Hub
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-2xs">
                Ready Stock • 24H Dispatch
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verified Bhosari warehouse inventory available for 24-hour dispatch across India with 100% Domestic GST Input Tax Credit (ITC).
            </p>
          </div>
          <button
            onClick={() => setActiveTab("catalog")}
            className="text-xs font-bold text-[#002855] hover:text-blue-700 hover:underline flex items-center gap-1.5 shrink-0 group self-start lg:self-center"
          >
            <span>Open Full Parametric Catalog (15,000+ SKUs)</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Interactive Category Filter Tabs & Quick Search Bar */}
        <div className="border-b border-slate-200 bg-white px-5 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Ready Stock", count: "15,000+" },
              { id: "defense", label: "Military & Aerospace (D38999 / 26482)", count: "8,400+" },
              { id: "industrial", label: "Industrial Bayonet (62IN)", count: "4,200+" },
              { id: "ev", label: "EV & High Voltage (HVSL)", count: "2,400+" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setInventoryCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  inventoryCategory === tab.id
                    ? "bg-[#002855] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-2xs ${
                    inventoryCategory === tab.id
                      ? "bg-blue-800 text-blue-100"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Instant Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search MPN, Series, or Pins..."
              value={inventorySearchQuery}
              onChange={(e) => setInventorySearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#002855] focus:bg-white pl-8 pr-8 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 rounded-xs transition-all outline-hidden"
            />
            {inventorySearchQuery && (
              <button
                onClick={() => setInventorySearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Table Body */}
        {(() => {
          const filteredProducts = CATALOG_PRODUCTS.filter((p) => {
            const matchesCategory =
              inventoryCategory === "all" ||
              (inventoryCategory === "defense" && p.category === "Military & Aerospace") ||
              (inventoryCategory === "industrial" && p.category === "Industrial & Harsh Env") ||
              (inventoryCategory === "ev" && p.category === "EV & Power");

            const q = inventorySearchQuery.trim().toLowerCase();
            const matchesQuery =
              !q ||
              p.mpn.toLowerCase().includes(q) ||
              p.series.toLowerCase().includes(q) ||
              p.title.toLowerCase().includes(q) ||
              p.pinCount.toString().includes(q);

            return matchesCategory && matchesQuery;
          });

          if (filteredProducts.length === 0) {
            return (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <Search className="h-8 w-8 text-slate-300 mx-auto" />
                <div className="text-sm font-bold text-slate-700">
                  No ready-stock items found for &quot;{inventorySearchQuery}&quot;
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching by series like &quot;D38999&quot;, &quot;62IN&quot;, or click below to clear your filter.
                </p>
                <button
                  onClick={() => {
                    setInventoryCategory("all");
                    setInventorySearchQuery("");
                  }}
                  className="bg-[#002855] text-white text-xs font-bold px-4 py-2 rounded-xs hover:bg-[#001D3D] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            );
          }

          return (
            <>
              {/* DESKTOP VIEW (MD+): Full 6-Column High-Density Engineering Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/90 text-xs font-bold uppercase tracking-wider text-slate-700">
                      <th className="py-3.5 px-4">Part Number</th>
                      <th className="py-3.5 px-4">Series &amp; Class</th>
                      <th className="py-3.5 px-4">Contacts &amp; Rating</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4">Unit Price (@ MOQ)</th>
                      <th className="py-3.5 px-4 text-right">Order &amp; Procurement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 font-medium">
                    {filteredProducts.slice(0, 8).map((p) => {
                      const currentQty = getProductQty(p.mpn, p.moq);
                      const isComparing = compareProducts.some((cp) => cp.id === p.id || cp.mpn === p.mpn);
                      return (
                        <tr
                          key={p.id}
                          className={`transition-colors group/row ${
                            isComparing ? "bg-blue-50/90" : "hover:bg-blue-50/50"
                          }`}
                        >
                          {/* 1. Compare Checkbox & Photo & MPN with 1-Click Copy */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {/* Compare Checkbox */}
                              <label
                                onClick={(e) => e.stopPropagation()}
                                title={isComparing ? "Remove from comparison" : "Add to side-by-side comparison (up to 4)"}
                                className="flex items-center cursor-pointer p-0.5 select-none"
                              >
                                <input
                                  type="checkbox"
                                  checked={isComparing}
                                  onChange={() => toggleCompare(p)}
                                  className="w-4 h-4 accent-[#002855] text-[#002855] border-slate-300 rounded cursor-pointer"
                                />
                              </label>

                              <div
                                onClick={() => setQuickViewProduct(p)}
                                title="Click to view pinout diagram & full specifications"
                                className="w-11 h-11 shrink-0 border border-slate-200 bg-white p-1 flex items-center justify-center relative rounded shadow-2xs group-hover/row:border-[#002855]/60 hover:ring-2 hover:ring-[#002855]/20 cursor-pointer transition-all"
                              >
                                <div className="relative w-9 h-9">
                                  <Image
                                    src={p.image}
                                    alt={p.mpn}
                                    fill
                                    sizes="36px"
                                    className="object-contain group-hover/row:scale-105 transition-transform"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setQuickViewProduct(p)}
                                    className="font-mono text-xs sm:text-sm font-black text-[#002855] hover:text-blue-700 hover:underline cursor-pointer text-left flex items-center gap-1"
                                    title="View technical pinout diagram & specs"
                                  >
                                    <span>{p.mpn}</span>
                                    <Eye className="h-3.5 w-3.5 text-slate-400 group-hover/row:text-[#002855] transition-colors" />
                                  </button>
                                  <button
                                    onClick={(e) => handleCopyMpn(p.mpn, e)}
                                    title="Copy Part Number"
                                    className="p-1 text-slate-400 hover:text-[#002855] hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                  >
                                    {copiedMpn === p.mpn ? (
                                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                        <Check className="h-3 w-3" /> Copied!
                                      </span>
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                                <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs sm:max-w-sm">
                                  {p.title}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Series & Class */}
                          <td className="py-4 px-4">
                            <span className="inline-block bg-slate-100 text-slate-800 border border-slate-300 font-mono text-[11px] px-2 py-0.5 rounded font-semibold">
                              {p.series}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-1">
                              {p.category}
                            </div>
                          </td>

                          {/* 3. Contacts & Rating */}
                          <td className="py-4 px-4">
                            <div className="text-xs font-semibold text-slate-800">
                              {p.pinCount} Gold Pins
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {p.currentRating} • {p.ipRating}
                            </div>
                          </td>

                          {/* 4. Stock Status */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="font-mono text-xs font-bold text-emerald-700">
                                {p.stock.toLocaleString()} pcs
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              Pune Hub • 24h Air
                            </span>
                          </td>

                          {/* 5. Unit Price */}
                          <td className="py-4 px-4">
                            <div className="font-mono text-sm font-bold text-slate-900">
                              ₹{p.priceTiers[0].price.toLocaleString("en-IN")}
                              <span className="text-[10px] font-normal text-slate-500">/pc</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block">
                              MOQ: {p.moq} pcs (+GST)
                            </span>
                          </td>

                          {/* 6. Stepper & Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setQuickViewProduct(p)}
                                title="Pinout & Specs"
                                className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#002855] hover:bg-blue-50 border border-slate-200 bg-white rounded transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Specs</span>
                              </button>

                              <div className="flex items-center border border-slate-300 bg-white rounded overflow-hidden h-8">
                                <button
                                  onClick={() => updateProductQty(p.mpn, -p.moq, p.moq)}
                                  disabled={currentQty <= p.moq}
                                  className="px-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer h-full"
                                  title={`Decrease by ${p.moq}`}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-2 font-mono text-xs font-bold text-slate-800 min-w-8 text-center select-none">
                                  {currentQty}
                                </span>
                                <button
                                  onClick={() => updateProductQty(p.mpn, p.moq, p.moq)}
                                  className="px-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer h-full"
                                  title={`Increase by ${p.moq}`}
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleAddRfqWithFeedback(p, currentQty)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all shadow-xs rounded active:scale-95 cursor-pointer whitespace-nowrap ${
                                  addedMpn === p.mpn
                                    ? "bg-emerald-600 text-white scale-105"
                                    : "bg-[#002855] hover:bg-[#001D3D] text-white"
                                }`}
                                title="Add to RFQ Quotation Basket"
                              >
                                {addedMpn === p.mpn ? (
                                  <>
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Added!</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>+ RFQ</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => startDirectCheckout(p, currentQty)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-xs active:scale-95 cursor-pointer whitespace-nowrap transition-colors"
                                title="Instant Corporate Checkout & 24h Factory Dispatch"
                              >
                                <CreditCard className="h-3.5 w-3.5 text-white" />
                                <span>Buy Now</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE VIEW (< MD): Touch Product Cards (DigiKey / Amazon Mobile Style) */}
              <div className="block md:hidden divide-y divide-slate-200">
                {filteredProducts.slice(0, 8).map((p) => {
                  const currentQty = getProductQty(p.mpn, p.moq);
                  const isComparing = compareProducts.some((cp) => cp.id === p.id || cp.mpn === p.mpn);
                  return (
                    <div
                      key={p.id}
                      className={`p-4 transition-colors ${
                        isComparing ? "bg-blue-50/70" : "bg-white"
                      }`}
                    >
                      {/* Top Row: Photo + MPN & Series + Compare */}
                      <div className="flex items-start gap-3">
                        <div
                          onClick={() => setQuickViewProduct(p)}
                          className="w-14 h-14 shrink-0 border border-slate-200 bg-white p-1 rounded flex items-center justify-center relative cursor-pointer"
                        >
                          <div className="relative w-11 h-11">
                            <Image
                              src={p.image}
                              alt={p.mpn}
                              fill
                              sizes="44px"
                              className="object-contain"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <button
                              type="button"
                              onClick={() => setQuickViewProduct(p)}
                              className="font-mono text-sm font-black text-[#002855] hover:underline truncate text-left"
                            >
                              {p.mpn}
                            </button>
                            <button
                              onClick={(e) => handleCopyMpn(p.mpn, e)}
                              className="p-1 text-slate-400 hover:text-[#002855] shrink-0"
                              title="Copy MPN"
                            >
                              {copiedMpn === p.mpn ? (
                                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                  <Check className="h-3 w-3" />
                                </span>
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold border border-slate-200">
                              {p.series}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate">
                              {p.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Row: Specs & Stock & Price */}
                      <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                            Contacts &amp; IP
                          </span>
                          <span className="font-semibold text-slate-800 text-[11px]">
                            {p.pinCount} Pins • {p.ipRating}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {p.currentRating}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                            Pune Factory Stock
                          </span>
                          <span className="font-mono font-bold text-emerald-700 text-xs flex items-center justify-end gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                            {p.stock.toLocaleString()} pcs
                          </span>
                          <span className="font-mono font-black text-slate-900 text-xs block mt-0.5">
                            ₹{p.priceTiers[0].price.toLocaleString("en-IN")}{" "}
                            <span className="text-[10px] font-normal text-slate-500">/pc</span>
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Stepper + RFQ + Buy Now + Specs */}
                      <div className="mt-3 flex items-center justify-between gap-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-slate-300 bg-white rounded overflow-hidden h-9">
                          <button
                            onClick={() => updateProductQty(p.mpn, -p.moq, p.moq)}
                            disabled={currentQty <= p.moq}
                            className="px-2.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 h-full cursor-pointer"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-2 font-mono text-xs font-bold text-slate-800 min-w-7 text-center select-none">
                            {currentQty}
                          </span>
                          <button
                            onClick={() => updateProductQty(p.mpn, p.moq, p.moq)}
                            className="px-2.5 text-slate-600 hover:bg-slate-100 h-full cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 flex-1 justify-end">
                          <button
                            type="button"
                            onClick={() => setQuickViewProduct(p)}
                            className="px-2.5 py-2 border border-slate-300 bg-white text-slate-700 text-xs font-bold rounded flex items-center gap-1 hover:bg-slate-50 cursor-pointer"
                            title="Pinout & Specs"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500" />
                            <span className="hidden xs:inline">Specs</span>
                          </button>

                          <button
                            onClick={() => handleAddRfqWithFeedback(p, currentQty)}
                            className={`px-3 py-2 text-xs font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                              addedMpn === p.mpn
                                ? "bg-emerald-600 text-white"
                                : "bg-[#002855] text-white hover:bg-[#001D3D]"
                            }`}
                          >
                            {addedMpn === p.mpn ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                <span>RFQ</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => startDirectCheckout(p, currentQty)}
                            className="px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>Buy</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>

      {/* 5. DEFENCE & AEROSPACE QPL ACCREDITATIONS (Sleek HUD Ribbon) */}
      <div className="border border-slate-300 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002855] uppercase tracking-wider mb-0.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Government &amp; Military QPL Accreditations</span>
            </div>
            <h3 className="text-lg font-black text-[#002855]">
              Certified Quality Management &amp; In-House Environmental Testing
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 self-start sm:self-center">
            Facility Code: IN055352 • Bhosari, Pune Hub
          </span>
        </div>

        {/* 4 Sleek High-Tech Crest Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              title: "Ministry of Defence (DGAQA)",
              authority: "Govt. of India • Directorate General of Aeronautical Quality",
              code: "DGAQA/PUNE/ELEC/AMP-01",
              image: "/images/cert-mod.webp",
              badge: "MoD APPROVED",
              scope: "Approved for Design, Development & Manufacture of Military Aircraft, Radar & Missile Connectors",
            },
            {
              title: "MIL-STD-790 QPL Lab",
              authority: "US Defense Logistics Agency (DLA Land & Maritime)",
              code: "MIL-STD-790 Standard Practice",
              image: "/images/cert-mil-std-790.webp",
              badge: "US DoD CERTIFIED",
              scope: "Qualified Test Laboratory for MIL-DTL-38999 & MIL-DTL-26482 High-Reliability Products",
            },
            {
              title: "AS9100D & EN 9100",
              authority: "Bureau Veritas Aerospace Quality Management",
              code: "Certificate # IN055352 / AS9100D",
              image: "/images/cert-as9100d.jpg",
              badge: "AEROSPACE GRADE",
              scope: "Worldwide Aerospace Standard for Aviation, Space and Defence Component Manufacturing",
            },
            {
              title: "ISO 9001 & ISO 14001",
              authority: "International Environmental & Safety Standards",
              code: "ISO 9001:2015 & ISO 14001:2015",
              image: "/images/cert-iso9001.jpg",
              badge: "QUALITY AUDITED",
              scope: "Quality Management & Environmental Protection System for Pune Bhosari Plant",
            },
          ].map((cert, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCert(cert)}
              className="bg-slate-50 border border-slate-200 hover:border-[#002855] hover:bg-white p-3.5 rounded-xs transition-all cursor-pointer group flex flex-col justify-between hover:shadow-lg relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[9px] font-bold text-blue-900 bg-blue-100/70 border border-blue-200 px-2 py-0.5 rounded-2xs uppercase">
                    {cert.badge}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Audited</span>
                  </span>
                </div>

                {/* Visual Certificate Scan Preview */}
                <div className="relative w-full h-44 bg-white border border-slate-200 rounded-xs overflow-hidden mb-2.5 shadow-xs group-hover:border-blue-400 transition-all flex items-center justify-center">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Subtle Hover Zoom Overlay */}
                  <div className="absolute inset-0 bg-[#001435]/0 group-hover:bg-[#001435]/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                    <span className="bg-white/95 text-[#002855] text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-slate-200">
                      <Eye className="h-3.5 w-3.5 text-blue-600" />
                      <span>Zoom Document Scan</span>
                    </span>
                  </div>
                </div>

                <h4 className="text-xs font-black text-[#002855] group-hover:text-blue-700 transition-colors leading-tight">
                  {cert.title}
                </h4>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{cert.code}</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                  {cert.scope}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-mono">Bhosari Facility</span>
                <span className="text-[#002855] font-bold group-hover:underline flex items-center gap-0.5">
                  <Eye className="h-3 w-3" /> Click to Inspect Full Scan
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pune Testing Capabilities Strip */}
        <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block font-mono">500h Salt Spray</span>
            <span className="font-semibold text-slate-800">ASTM B117 Corrosion Chamber</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block font-mono">Pyrotechnic Shock</span>
            <span className="font-semibold text-slate-800">300g High-G Sine &amp; Random</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block font-mono">Hermetic Leak Rate</span>
            <span className="font-semibold text-emerald-700">&lt;1.0 × 10⁻⁷ cc/sec Helium</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block font-mono">Dielectric Voltage</span>
            <span className="font-semibold text-slate-800">Up to 2,800 VAC Spark Test</span>
          </div>
        </div>
      </div>

      {/* 6. OFFICIAL ENGINEERING CATALOGUES DIRECT DOWNLOAD BAR */}
      <div className="border border-blue-900/40 bg-gradient-to-r from-[#00183b] via-[#002855] to-[#001435] p-5 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-wider">
              <FileText className="h-4 w-4 text-blue-400" />
              <span>Direct Factory Technical Documentation</span>
            </div>
            <h3 className="text-lg font-black text-white">
              Official Amphenol Interconnect India Product Catalogues
            </h3>
            <p className="text-xs text-slate-300">
              Complete pinout diagrams, shell dimensions, contact ratings, and military part numbering decoders
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/catalogues/Amphenol-D38999-Series-III.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#002855] hover:bg-blue-50 px-3.5 py-2 text-xs font-bold transition-all shadow-xs rounded-xs"
            >
              <Download className="h-3.5 w-3.5 text-blue-700" />
              <span>D38999 Series III (4.0 MB)</span>
            </a>

            <a
              href="/catalogues/Amphenol-62IN-Series.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 text-xs font-bold transition-all rounded-xs"
            >
              <Download className="h-3.5 w-3.5 text-blue-300" />
              <span>62IN Bayonet (674 KB)</span>
            </a>

            <a
              href="/catalogues/Amphenol-India-QPL-2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold transition-all rounded-xs shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-white" />
              <span>Official 2025 QPL Leaflet (1.4 MB)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 7. CERTIFICATE INSPECTION / ZOOM MODAL */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white border border-slate-300 rounded-sm shadow-2xl overflow-hidden p-6 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 inline-block">
                  Verified Official Accreditation
                </span>
                <h3 className="text-base font-black text-[#002855] mt-1">{selectedCert.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedCert.authority}</p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xs transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* High-Resolution Document Display */}
            <div className="my-4 relative h-96 w-full bg-slate-100 border border-slate-200 rounded-xs overflow-hidden flex items-center justify-center p-2">
              <Image
                src={selectedCert.image}
                alt={selectedCert.title}
                fill
                sizes="600px"
                className="object-contain filter contrast-105"
              />
            </div>

            <div className="space-y-2 bg-slate-50 border border-slate-200 p-3 rounded-xs text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Certificate / Standard:</span>
                <span className="font-mono font-bold text-[#002855]">{selectedCert.code}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-200">
                <span className="text-slate-500 font-semibold block mb-0.5">Approved Scope:</span>
                <span className="text-slate-800 leading-relaxed">{selectedCert.scope}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Certified Facility:</span>
                <span className="font-semibold text-slate-800">
                  Amphenol Interconnect India, 105 Bhosari Industrial Area, Pune 411026
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Audited for Indian Aerospace &amp; Defense Tier-1 Supply</span>
              </span>
              <button
                onClick={() => setSelectedCert(null)}
                className="bg-[#002855] hover:bg-[#001D3D] text-white text-xs font-bold px-4 py-2 rounded-xs transition-colors cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
