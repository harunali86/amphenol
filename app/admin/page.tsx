"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Truck,
  Package,
  FileText,
  ShieldCheck,
  Search,
  Bell,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Shield,
  Layers,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  X,
  FileCheck2,
  HardDrive
} from "lucide-react";

type TabType = "dashboard" | "crm" | "orders" | "inventory" | "invoices" | "admin";

interface LeadItem {
  id: string;
  company: string;
  sector: "Defense" | "Automotive EV" | "Aerospace" | "Naval" | "Industrial";
  gstin: string;
  contact: string;
  email: string;
  project: string;
  parts: string;
  value: string;
  stage: "New Inquiry" | "Technical Review" | "Formal Quotation" | "PO Awaited" | "Won & Production";
  plant: string;
  date: string;
}

interface OrderItem {
  id: string;
  client: string;
  poNumber: string;
  items: string;
  qty: number;
  deliveryDate: string;
  carrier: string;
  tracking: string;
  status: "PO Verified" | "Design Cleared" | "Assembly & MIL-QA" | "Packing & Dispatch" | "Delivered";
  amount: string;
}

interface SkuItem {
  partNo: string;
  series: string;
  description: string;
  bhosariStock: number;
  chakanStock: number;
  safetyThreshold: number;
  status: "In Stock" | "Low Stock Alert" | "MTO (Make to Order)";
  leadTimeWeeks: number;
}

const INITIAL_LEADS: LeadItem[] = [
  {
    id: "RFQ-2026-081",
    company: "Mahindra & Mahindra EV Powertrain",
    sector: "Automotive EV",
    gstin: "27AAACM1234F1Z5",
    contact: "Dr. Vikram Joshi (VP - High Voltage R&D)",
    email: "v.joshi@mahindra-ev.com",
    project: "Direct TE HVP-HD1000 substitute for 800V EV Architecture",
    parts: "Amphenol RadSok 1000A EV Plugs",
    value: "₹68,00,000",
    stage: "Formal Quotation",
    plant: "Chakan Plant 2",
    date: "12 mins ago"
  },
  {
    id: "RFQ-2026-082",
    company: "Bharat Electronics Ltd (BEL Bengaluru)",
    sector: "Defense",
    gstin: "29AAACB4294G1ZR",
    contact: "R. Narayanan (Chief Procurement Officer)",
    email: "r.narayanan@bel.co.in",
    project: "Air Defense Radar Sub-assembly Harness",
    parts: "MIL-DTL-38999 Series III Olive Drab Cadmium",
    value: "₹45,00,000",
    stage: "Technical Review",
    plant: "Bhosari Central",
    date: "45 mins ago"
  },
  {
    id: "RFQ-2026-083",
    company: "Ather Energy Pvt Ltd",
    sector: "Automotive EV",
    gstin: "29AACCA9910K1ZT",
    contact: "Sandeep Rao (Lead Harness Engineer)",
    email: "sandeep.r@atherenergy.com",
    project: "Gen-4 450X High-Rate Battery Pack Interconnect",
    parts: "Compact IP67 RadSok Terminal Connectors",
    value: "₹24,50,000",
    stage: "New Inquiry",
    plant: "Chakan Plant 2",
    date: "2 hours ago"
  },
  {
    id: "RFQ-2026-084",
    company: "Mazagon Dock Shipbuilders Ltd",
    sector: "Naval",
    gstin: "27AAACM6682P1ZQ",
    contact: "Capt. A. K. Sharma (Project 75I Subsea Systems)",
    email: "aksharma@mazagondock.gov.in",
    project: "Hull Penetration Hermetic Feedthroughs (300 Bar)",
    parts: "AquaWeld Subsea Deep-Immersion Connectors",
    value: "₹92,00,000",
    stage: "PO Awaited",
    plant: "Bhosari Central",
    date: "Yesterday"
  },
  {
    id: "RFQ-2026-085",
    company: "Hindustan Aeronautics Ltd (HAL Nashik)",
    sector: "Aerospace",
    gstin: "27AAACH0293J1Z8",
    contact: "Col. Pradeep Sen (Avionics Integration Head)",
    email: "p.sen@hal-india.co.in",
    project: "Su-30 MKI Cockpit Avionics Upgrade Batch 4",
    parts: "62IN Miniature Bayonet & Hermetic Receptacles",
    value: "₹1,15,00,000",
    stage: "Won & Production",
    plant: "Bhosari Central",
    date: "2 days ago"
  },
  {
    id: "RFQ-2026-086",
    company: "Defence Research & Development Lab (DRDL)",
    sector: "Defense",
    gstin: "36AAAGD0281F1Z1",
    contact: "Dr. K. Swaminathan (Missile Guidance Division)",
    email: "k.swami@drdl.res.in",
    project: "Next-Gen Surface-to-Air Missile (QRSAM) Fin Actuator",
    parts: "Micro-D Subminiature Mil-Spec Assemblies",
    value: "₹54,20,000",
    stage: "Technical Review",
    plant: "Bhosari Central",
    date: "3 days ago"
  }
];

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ORD-2026-441",
    client: "Hindustan Aeronautics Ltd (HAL)",
    poNumber: "HAL/AVN/2026/8912",
    items: "62IN-12E14-19S Hermetic Bayonet (Batch 2)",
    qty: 480,
    deliveryDate: "24-Sep-2026",
    carrier: "BlueDart Defense Express",
    tracking: "BD-DEF-991204-IN",
    status: "Packing & Dispatch",
    amount: "₹38,40,000"
  },
  {
    id: "ORD-2026-440",
    client: "DRDO - ASL Hyderabad",
    poNumber: "DRDO/ASL/PO-7712",
    items: "MIL-DTL-38999 Series III Jam-Nut Receptacles",
    qty: 250,
    deliveryDate: "28-Sep-2026",
    carrier: "Govt Escorted Freight",
    tracking: "GEF-HYD-00412",
    status: "Assembly & MIL-QA",
    amount: "₹52,80,000"
  },
  {
    id: "ORD-2026-439",
    client: "Tata Motors EV Division (Pune)",
    poNumber: "TM-PUN/EV/55129",
    items: "RadSok 500V Heavy Power Plug (Nexon EV Gen3)",
    qty: 1200,
    deliveryDate: "18-Sep-2026",
    carrier: "Amphenol Pune Dedicated Fleet",
    tracking: "AP-PN-04",
    status: "Delivered",
    amount: "₹29,60,000"
  },
  {
    id: "ORD-2026-438",
    client: "Bharat Electronics Ltd (BEL)",
    poNumber: "BEL/BG/RADAR/2026/02",
    items: "Micro-D 21-Pin Gold Plated Socket Connectors",
    qty: 600,
    deliveryDate: "02-Oct-2026",
    carrier: "BlueDart Air Aviation",
    tracking: "BD-AIR-782190",
    status: "Design Cleared",
    amount: "₹18,50,000"
  }
];

const INITIAL_SKUS: SkuItem[] = [
  {
    partNo: "D38999/20WJ35PN",
    series: "MIL-DTL-38999 Series III",
    description: "Wall Mount Receptacle, Shell 25, 128#22D Contacts, Olive Drab",
    bhosariStock: 1420,
    chakanStock: 350,
    safetyThreshold: 400,
    status: "In Stock",
    leadTimeWeeks: 1
  },
  {
    partNo: "62IN-12E14-19S",
    series: "62IN Miniature Bayonet",
    description: "Jam Nut Receptacle, 19 Contacts, Solder Cup, Gold Plating",
    bhosariStock: 89,
    chakanStock: 20,
    safetyThreshold: 150,
    status: "Low Stock Alert",
    leadTimeWeeks: 3
  },
  {
    partNo: "AQWLD-40-56P",
    series: "AquaWeld Subsea",
    description: "3000m Subsea Immersion Plug, 316L Stainless Steel Shell",
    bhosariStock: 14,
    chakanStock: 0,
    safetyThreshold: 10,
    status: "In Stock",
    leadTimeWeeks: 4
  },
  {
    partNo: "HVP-HD1000-02P",
    series: "EV Heavy Power",
    description: "800V DC 1000A Shielded High Voltage Header for Battery Disconnect",
    bhosariStock: 2400,
    chakanStock: 5800,
    safetyThreshold: 1000,
    status: "In Stock",
    leadTimeWeeks: 1
  },
  {
    partNo: "M28840/12-WB",
    series: "M28840 Naval Submarine",
    description: "Shipboard High Shock Circular Connector, Splined Backshell",
    bhosariStock: 0,
    chakanStock: 0,
    safetyThreshold: 25,
    status: "MTO (Make to Order)",
    leadTimeWeeks: 6
  }
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [skus, setSkus] = useState<SkuItem[]>(INITIAL_SKUS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("Bhosari Central Plant (Pune)");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  const updateLeadStage = (id: string, newStage: LeadItem["stage"]) => {
    setLeads(prev => prev.map(item => (item.id === id ? { ...item, stage: newStage } : item)));
  };

  const updateOrderStatus = (id: string, newStatus: OrderItem["status"]) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-72 bg-[#0c1322] border-r border-slate-800/80 flex flex-col justify-between shrink-0 fixed top-0 bottom-0 left-0 z-40">
        <div>
          {/* Company Brand Header */}
          <div className="p-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
                <span className="text-xl">A</span>
              </div>
              <div>
                <div className="font-bold text-slate-100 tracking-wider text-sm flex items-center gap-1.5">
                  AMPHENOL
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono border border-blue-500/30">
                    INDIA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Pune Interconnect Operations</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ERP System Online
              </span>
              <span className="text-slate-400 font-mono text-[10px]">v4.2.8 Enterprise</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <p className="px-3 pt-3 pb-1.5 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
              Management Modules
            </p>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold"
                  : "text-slate-200 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("crm")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "crm"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold"
                  : "text-slate-200 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>B2B Sales CRM & Pipeline</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono border border-blue-400/30">
                ₹4.82 Cr
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold"
                  : "text-slate-200 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Defense & OEM Logistics</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-400/30">
                4 Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "inventory"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold"
                  : "text-slate-200 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 shrink-0" />
                <span>15k SKUs Inventory</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-400/30">
                1 Alert
              </span>
            </button>

            <button
              onClick={() => setActiveTab("invoices")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "invoices"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold"
                  : "text-slate-200 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>GST Billing & Invoicing</span>
            </button>

            <p className="px-3 pt-4 pb-1.5 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
              Governance & Security
            </p>

            <button
              onClick={() => setActiveTab("admin")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "admin"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold"
                  : "text-slate-200 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Super Admin & Audit Log</span>
            </button>
          </nav>
        </div>

        {/* Bottom User & Plant Card */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090f1b]">
          <div className="mb-3 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Active Plant:</span>
            <span className="text-blue-400 font-medium">Bhosari Facility</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200">
              RD
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-200 truncate">R. Deshmukh</div>
              <div className="text-[10px] text-slate-400 truncate">GM Commercial Operations</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/60">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700"
            >
              <span>← Back to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 ml-72 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0c1322]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search RFQ, Part #, DRDO, HAL, Tata Motors..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300">
              <span>Facility:</span>
              <select
                value={selectedPlant}
                onChange={e => setSelectedPlant(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
              >
                <option>Bhosari Central Plant (Pune)</option>
                <option>Chakan EV Connector Unit (Pune)</option>
                <option>Bengaluru Avionics R&D Lab</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[11px] font-mono border border-blue-500/20">
              <Shield className="w-3 h-3" /> AWS Mumbai VPC • 2FA Enforced
            </span>

            <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5"></span>
            </button>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate GST Invoice</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 md:p-8 space-y-6">
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Pune Plant Executive Operations
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time consolidated view of Mil-Spec inquiries, defense contracts, plant inventory, and dispatch SLA.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:bg-slate-800 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    Export Monthly Report
                  </button>
                </div>
              </div>

              {/* 4 High Density Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Active RFQ Pipeline</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">₹4,82,50,000</div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span>↑ +32.4%</span>
                    <span className="text-slate-400">vs previous quarter (DRDO/HAL surge)</span>
                  </div>
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                </div>

                <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Qualified B2B Accounts</span>
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">38 Key Accounts</div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-400">
                    <span>14 Defense</span>
                    <span className="text-slate-400">• 16 Automotive EV • 8 Aerospace</span>
                  </div>
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                </div>

                <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Plant Dispatch SLA</span>
                    <Truck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">99.4% On-Time</div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-indigo-400">
                    <span>4 Orders Dispatched Today</span>
                    <span className="text-slate-400">• Avg turnaround 4.2 days</span>
                  </div>
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                </div>

                <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">15,000 SKUs Ledger</span>
                    <Package className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">14,890 Ready</div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-400">
                    <span>1 Low Stock Reorder</span>
                    <span className="text-slate-400">• 62IN Bayonet Batch</span>
                  </div>
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
                </div>
              </div>

              {/* Live Strategic Accounts Table */}
              <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wide">
                      Active Defense & Automotive Contract Pipeline
                    </h2>
                    <p className="text-[11px] text-slate-400">Auto-synchronized with Bhosari Plant Sales Desk</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("crm")}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    View All Leads in CRM →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3">Lead / RFQ ID</th>
                        <th className="py-2.5 px-3">Corporate Client</th>
                        <th className="py-2.5 px-3">Sector</th>
                        <th className="py-2.5 px-3">Target Application</th>
                        <th className="py-2.5 px-3">Contract Value</th>
                        <th className="py-2.5 px-3">Current Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {leads.slice(0, 4).map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-mono text-blue-400 font-semibold">{lead.id}</td>
                          <td className="py-3 px-3 font-medium text-slate-200">
                            <div>{lead.company}</div>
                            <div className="text-[10px] text-slate-400">{lead.contact}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                              {lead.sector}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-300 max-w-xs truncate">{lead.project}</td>
                          <td className="py-3 px-3 font-bold text-slate-100 font-mono">{lead.value}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                lead.stage === "Won & Production"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : lead.stage === "Formal Quotation"
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                              }`}
                            >
                              {lead.stage}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: B2B SALES CRM */}
          {activeTab === "crm" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    B2B Sales CRM & Tender Pipeline
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage tier-1 defense quotes, automotive EV custom harnesses, and conversion stages.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Total Value:</span>
                  <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-sm border border-blue-500/30">
                    ₹4,82,50,000 (6 Active Inquiries)
                  </span>
                </div>
              </div>

              {/* Leads Table */}
              <div className="rounded-xl bg-[#0c1322] border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-200">All Inbound RFQ Records</span>
                  </div>
                  <span className="text-xs text-slate-400">Click stage badge to update live in pipeline</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Lead ID & Company</th>
                        <th className="py-3 px-4">Authorized Contact</th>
                        <th className="py-3 px-4">Project & Connector Series</th>
                        <th className="py-3 px-4">Estimated Value</th>
                        <th className="py-3 px-4">Assigned Facility</th>
                        <th className="py-3 px-4">Pipeline Stage (Interactive)</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-mono text-blue-400 font-bold">{lead.id}</div>
                            <div className="font-medium text-slate-100">{lead.company}</div>
                            <div className="text-[10px] text-slate-400">GST: {lead.gstin}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-200 font-medium">{lead.contact}</div>
                            <div className="text-[11px] text-slate-400">{lead.email}</div>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <div className="text-slate-200 font-medium truncate">{lead.project}</div>
                            <div className="text-[10px] text-blue-400">{lead.parts}</div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-white text-sm">{lead.value}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                              {lead.plant}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={lead.stage}
                              onChange={e => updateLeadStage(lead.id, e.target.value as LeadItem["stage"])}
                              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-blue-300 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="New Inquiry">New Inquiry</option>
                              <option value="Technical Review">Technical Review</option>
                              <option value="Formal Quotation">Formal Quotation</option>
                              <option value="PO Awaited">PO Awaited</option>
                              <option value="Won & Production">Won & Production</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setShowInvoiceModal(true);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-medium border border-slate-700"
                            >
                              View RFQ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDER LOGISTICS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Defense & OEM Order Dispatch Logistics
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Track MIL-STD QA inspections, packing, and courier gate passes for Tier-1 defense shipments.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">
                    ● BlueDart Defense Gate Pass Integrated
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {orders.map(order => (
                  <div key={order.id} className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-400 font-bold">{order.id}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-white">{order.client}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            PO: {order.poNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          {order.items} • <span className="font-semibold text-white">Qty: {order.qty} pcs</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold text-white font-mono">{order.amount}</div>
                        <div className="text-[11px] text-slate-400">Target Delivery: {order.deliveryDate}</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-400">Carrier:</span> {order.carrier}
                        </div>
                        <div>
                          <span className="text-slate-400">Tracking AWB:</span>{" "}
                          <span className="font-mono text-blue-400">{order.tracking}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Update Status:</span>
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as OrderItem["status"])}
                          className="bg-slate-900 border border-slate-700 text-emerald-400 font-medium rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
                        >
                          <option value="PO Verified">PO Verified</option>
                          <option value="Design Cleared">Design Cleared</option>
                          <option value="Assembly & MIL-QA">Assembly & MIL-QA</option>
                          <option value="Packing & Dispatch">Packing & Dispatch</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 15K SKU INVENTORY */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    15,000 SKUs Plant Inventory Ledger
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-warehouse stock balancing between Bhosari Central and Chakan Assembly plants.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    Sync with SAP / Excel
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-[#0c1322] border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Military Part Number</th>
                      <th className="py-3 px-4">Series & Description</th>
                      <th className="py-3 px-4">Bhosari Plant Stock</th>
                      <th className="py-3 px-4">Chakan Plant Stock</th>
                      <th className="py-3 px-4">Safety Buffer</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Lead Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {skus.map(sku => (
                      <tr key={sku.partNo} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-400">{sku.partNo}</td>
                        <td className="py-3 px-4 max-w-sm">
                          <div className="font-semibold text-slate-100">{sku.series}</div>
                          <div className="text-[11px] text-slate-400 truncate">{sku.description}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-white">{sku.bhosariStock} pcs</td>
                        <td className="py-3 px-4 font-mono font-semibold text-white">{sku.chakanStock} pcs</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{sku.safetyThreshold} pcs</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              sku.status === "In Stock"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : sku.status === "Low Stock Alert"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            }`}
                          >
                            {sku.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono">{sku.leadTimeWeeks} Weeks</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: GST BILLING & INVOICING */}
          {activeTab === "invoices" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Domestic GST Invoicing & Billing Ledger
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Auto-calculating 18% IGST / CGST-SGST for Indian Defense & OEM procurement.
                  </p>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Create Tax Invoice
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">FY 2026-27 Domestic Billed</span>
                  <div className="text-2xl font-bold text-white mt-1">₹14,28,40,000</div>
                  <div className="text-[11px] text-emerald-400 mt-1">100% GST Compliant (GSTR-1 Filed)</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Total GST Collected (18%)</span>
                  <div className="text-2xl font-bold text-blue-400 mt-1">₹2,57,11,200</div>
                  <div className="text-[11px] text-slate-400 mt-1">CGST: ₹1.28 Cr | SGST: ₹1.28 Cr</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Outstanding Payment Cycle</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">14.2 Days</div>
                  <div className="text-[11px] text-slate-400 mt-1">Standard Defense credit: 30 days</div>
                </div>
              </div>

              <div className="rounded-xl bg-[#0c1322] border border-slate-800 p-5">
                <h3 className="text-sm font-bold text-white mb-3">Recent Tax Invoices & E-Way Bills</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <div>
                      <div className="font-mono text-blue-400 font-bold">INV-2026-0901 • HAL Nashik</div>
                      <div className="text-slate-400">PO: HAL/AVN/8912 • E-Way Bill #281900129381</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">₹38,40,000 + 18% GST</div>
                      <span className="text-[10px] text-emerald-400">Payment Received via NEFT</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <div>
                      <div className="font-mono text-blue-400 font-bold">INV-2026-0902 • Tata Motors EV</div>
                      <div className="text-slate-400">PO: TM-PUN/EV/55129 • E-Way Bill #281900129382</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">₹29,60,000 + 18% GST</div>
                      <span className="text-[10px] text-emerald-400">Payment Received via RTGS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SUPER ADMIN & AUDIT LOG */}
          {activeTab === "admin" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Super Admin, Security & Audit Logs
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Defense-grade cryptographic logs, AWS Mumbai VPC telemetry, and access governance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Security Governance Status
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Hosting Environment</span>
                      <span className="text-white font-mono">Dedicated AWS Mumbai (ap-south-1)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">2FA Policy</span>
                      <span className="text-emerald-400 font-medium">MANDATORY (FIDO2 / TOTP)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Database Encryption</span>
                      <span className="text-white font-mono">AES-256 at rest, TLS 1.3 in transit</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Disaster Recovery RPO / RTO</span>
                      <span className="text-blue-400 font-mono">RPO: 5 min | RTO: 15 min</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Live System Telemetry
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Core API Latency</span>
                      <span className="text-emerald-400 font-mono">24ms (Edge Cache Hit 98.4%)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Uptime SLA (365 days)</span>
                      <span className="text-emerald-400 font-mono">99.98%</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Active Staff Sessions</span>
                      <span className="text-white font-mono">4 Officers logged in</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">AI Interconnect Intelligence</span>
                      <span className="text-blue-400 font-mono">Active (64.2% RFQ Assist)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-3">Immutable Audit Trail</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">
                      [12:54:12 IST] User <strong className="text-blue-400">R. Deshmukh</strong> updated Lead{" "}
                      <strong>RFQ-2026-081</strong> stage to <span className="text-blue-300">Formal Quotation</span>
                    </span>
                    <span className="text-[10px] text-slate-400">IP 115.114.88.2 (Pune Plant)</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">
                      [11:32:04 IST] Order <strong className="text-emerald-400">ORD-2026-441 (HAL)</strong> passed MIL-STD QA test certificate
                    </span>
                    <span className="text-[10px] text-slate-400">IP 115.114.88.5 (QA Lab)</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">
                      [10:15:40 IST] Inventory sync: <strong className="text-amber-400">62IN-12E14-19S</strong> dropped below safety buffer (89 pcs)
                    </span>
                    <span className="text-[10px] text-slate-400">Automated Alert</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. GST INVOICE MODAL PREVIEW */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c1322] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Official GST Tax Invoice Preview (Domestic Sale)
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedLead(null);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <div>
                  <div className="font-bold text-white text-sm">AMPHENOL INTERCONNECT INDIA PVT. LTD.</div>
                  <div className="text-slate-400 text-[11px]">Plot No. 105, MIDC Industrial Area, Bhosari, Pune - 411026</div>
                  <div className="text-blue-400 text-[11px]">GSTIN: 27AAACA1234F1Z1 • State: Maharashtra (Code: 27)</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400">Invoice: INV-2026-0914</div>
                  <div className="text-slate-400">Date: 17-Sep-2026</div>
                </div>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <div>
                  <span className="text-slate-400">Billed To (Corporate Customer):</span>
                  <div className="font-bold text-white">
                    {selectedLead ? selectedLead.company : "Mahindra & Mahindra EV Powertrain"}
                  </div>
                  <div className="text-slate-400">GSTIN: {selectedLead ? selectedLead.gstin : "27AAACM1234F1Z5"}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Place of Supply:</span>
                  <div className="text-white">Pune, Maharashtra (Intra-State)</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-slate-300">
                  <span>Product: {selectedLead ? selectedLead.parts : "RadSok 1000A EV Connectors (HSN: 85366990)"}</span>
                  <span className="font-bold text-white">₹57,62,711.86</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Central GST (CGST @ 9%):</span>
                  <span>₹5,18,644.07</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>State GST (SGST @ 9%):</span>
                  <span>₹5,18,644.07</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-400 border-t border-slate-800 pt-2">
                  <span>Total Payable (Inclusive of 18% GST):</span>
                  <span className="text-base">{selectedLead ? selectedLead.value : "₹68,00,000.00"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedLead(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Tax Invoice PDF downloaded to local device.");
                  setShowInvoiceModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Tax Invoice PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
