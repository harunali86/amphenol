"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Package,
  Truck,
  FileText,
  ShieldCheck,
  Search,
  Bell,
  Download,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  Layers,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  Printer,
  Mail,
  PhoneCall,
  User,
  ArrowRight,
  Check
} from "lucide-react";

type ActiveTab = "dashboard" | "leads" | "customers" | "inventory" | "orders" | "invoices" | "security";

interface LeadItem {
  id: string;
  company: string;
  sector: "Defense" | "Automotive EV" | "Aerospace" | "Naval";
  gstin: string;
  contactPerson: string;
  contactTitle: string;
  email: string;
  phone: string;
  project: string;
  partsRequested: string;
  dealValue: string;
  stage: "New Inquiry" | "Technical Review" | "Formal Quotation" | "PO Awaited" | "Won & Closed";
  plant: string;
  date: string;
}

interface SkuItem {
  partNo: string;
  series: string;
  description: string;
  bhosariStock: number;
  chakanStock: number;
  safetyBuffer: number;
  unitPrice: string;
  status: "In Stock" | "Low Stock Alert" | "Make to Order";
}

interface OrderItem {
  orderId: string;
  poNumber: string;
  client: string;
  product: string;
  quantity: number;
  totalAmount: string;
  carrier: string;
  awbNumber: string;
  deliveryDate: string;
  dispatchStatus: "PO Verified" | "Assembly & QA" | "Dispatched via BlueDart" | "Delivered";
}

const INITIAL_LEADS: LeadItem[] = [
  {
    id: "RFQ-2026-081",
    company: "Mahindra & Mahindra EV Powertrain",
    sector: "Automotive EV",
    gstin: "27AAACM1234F1Z5",
    contactPerson: "Dr. Vikram Joshi",
    contactTitle: "VP - High Voltage R&D",
    email: "v.joshi@mahindra-ev.com",
    phone: "+91 98220 11928",
    project: "Direct TE HVP-HD1000 substitute for 800V EV Platform",
    partsRequested: "Amphenol RadSok 1000A Quick-Disconnect Header (2,400 pcs)",
    dealValue: "₹68,00,000",
    stage: "Formal Quotation",
    plant: "Chakan Plant 2",
    date: "Today, 11:30 AM"
  },
  {
    id: "RFQ-2026-082",
    company: "Bharat Electronics Ltd (BEL Bengaluru)",
    sector: "Defense",
    gstin: "29AAACB4294G1ZR",
    contactPerson: "R. Narayanan",
    contactTitle: "Chief Procurement Officer",
    email: "r.narayanan@bel.co.in",
    phone: "+91 80 2838 1200",
    project: "Air Defense Tactical Radar Front-End Antenna Harness",
    partsRequested: "MIL-DTL-38999 Series III Olive Drab Cadmium Shell 25 (450 pcs)",
    dealValue: "₹45,00,000",
    stage: "Technical Review",
    plant: "Bhosari Central",
    date: "Today, 10:15 AM"
  },
  {
    id: "RFQ-2026-083",
    company: "Ather Energy Pvt Ltd",
    sector: "Automotive EV",
    gstin: "29AACCA9910K1ZT",
    contactPerson: "Sandeep Rao",
    contactTitle: "Lead Battery Pack Harness Engineer",
    email: "sandeep.r@atherenergy.com",
    phone: "+91 97401 22849",
    project: "Gen-4 450X High-Rate Battery Pack Rapid Terminal",
    partsRequested: "Compact IP67 RadSok Terminal Connectors (12,000 pcs)",
    dealValue: "₹24,50,000",
    stage: "New Inquiry",
    plant: "Chakan Plant 2",
    date: "Yesterday"
  },
  {
    id: "RFQ-2026-084",
    company: "Mazagon Dock Shipbuilders Ltd",
    sector: "Naval",
    gstin: "27AAACM6682P1ZQ",
    contactPerson: "Capt. A. K. Sharma",
    contactTitle: "Project 75I Subsea Integration Officer",
    email: "aksharma@mazagondock.gov.in",
    phone: "+91 22 2376 0000",
    project: "Hull Penetration Hermetic Feedthroughs (300 Bar Pressure)",
    partsRequested: "AquaWeld Subsea Stainless 316L Deep-Immersion Plugs (18 pcs)",
    dealValue: "₹92,00,000",
    stage: "PO Awaited",
    plant: "Bhosari Central",
    date: "2 days ago"
  },
  {
    id: "RFQ-2026-085",
    company: "Hindustan Aeronautics Ltd (HAL Nashik)",
    sector: "Aerospace",
    gstin: "27AAACH0293J1Z8",
    contactPerson: "Col. Pradeep Sen",
    contactTitle: "Avionics Upgrades Program Director",
    email: "p.sen@hal-india.co.in",
    phone: "+91 253 277 1211",
    project: "Su-30 MKI Cockpit Electronic Warfare Radar Upgrade",
    partsRequested: "62IN Miniature Bayonet & Hermetic Receptacles (1,200 pcs)",
    dealValue: "₹1,15,00,000",
    stage: "Won & Closed",
    plant: "Bhosari Central",
    date: "3 days ago"
  },
  {
    id: "RFQ-2026-086",
    company: "DRDL Hyderabad (DRDO Missile Complex)",
    sector: "Defense",
    gstin: "36AAAGD0281F1Z1",
    contactPerson: "Dr. K. Swaminathan",
    contactTitle: "Head - Missile Guidance Division",
    email: "k.swami@drdl.res.in",
    phone: "+91 40 2458 3000",
    project: "Next-Gen Surface-to-Air Missile (QRSAM) Fin Actuator",
    partsRequested: "Micro-D Subminiature Mil-Spec Assemblies (800 pcs)",
    dealValue: "₹54,20,000",
    stage: "Technical Review",
    plant: "Bhosari Central",
    date: "4 days ago"
  }
];

const INITIAL_SKUS: SkuItem[] = [
  {
    partNo: "D38999/20WJ35PN",
    series: "MIL-DTL-38999 Series III",
    description: "Wall Mount Receptacle, Shell 25, 128 Contacts, Olive Drab",
    bhosariStock: 1420,
    chakanStock: 350,
    safetyBuffer: 400,
    unitPrice: "₹4,200",
    status: "In Stock"
  },
  {
    partNo: "62IN-12E14-19S",
    series: "62IN Miniature Bayonet",
    description: "Jam Nut Receptacle, 19 Contacts, Solder Cup, Gold Plating",
    bhosariStock: 89,
    chakanStock: 20,
    safetyBuffer: 150,
    unitPrice: "₹2,850",
    status: "Low Stock Alert"
  },
  {
    partNo: "HVP-HD1000-02P",
    series: "EV Heavy Power",
    description: "800V DC 1000A Shielded High Voltage Header for Battery Disconnect",
    bhosariStock: 2400,
    chakanStock: 5800,
    safetyBuffer: 1000,
    unitPrice: "₹1,850",
    status: "In Stock"
  },
  {
    partNo: "AQWLD-40-56P",
    series: "AquaWeld Subsea",
    description: "3000m Subsea Immersion Plug, 316L Stainless Steel Shell",
    bhosariStock: 14,
    chakanStock: 0,
    safetyBuffer: 10,
    unitPrice: "₹48,000",
    status: "In Stock"
  },
  {
    partNo: "M28840/12-WB",
    series: "M28840 Naval Submarine",
    description: "Shipboard High Shock Circular Connector, Splined Backshell",
    bhosariStock: 0,
    chakanStock: 0,
    safetyBuffer: 25,
    unitPrice: "₹34,500",
    status: "Make to Order"
  }
];

const INITIAL_ORDERS: OrderItem[] = [
  {
    orderId: "ORD-2026-441",
    poNumber: "HAL/AVN/2026/8912",
    client: "Hindustan Aeronautics Ltd (HAL Nashik)",
    product: "62IN Miniature Hermetic Bayonet (Batch 2)",
    quantity: 480,
    totalAmount: "₹38,40,000",
    carrier: "BlueDart Defense Air Express",
    awbNumber: "BD-DEF-991204-IN",
    deliveryDate: "24-Sep-2026",
    dispatchStatus: "Dispatched via BlueDart"
  },
  {
    orderId: "ORD-2026-440",
    poNumber: "DRDO/ASL/PO-7712",
    client: "DRDO - ASL Hyderabad",
    product: "MIL-DTL-38999 Series III Jam-Nut Receptacles",
    quantity: 250,
    totalAmount: "₹52,80,000",
    carrier: "Govt Escorted Freight",
    awbNumber: "GEF-HYD-00412",
    deliveryDate: "28-Sep-2026",
    dispatchStatus: "Assembly & QA"
  },
  {
    orderId: "ORD-2026-439",
    poNumber: "TM-PUN/EV/55129",
    client: "Tata Motors EV Division (Pune)",
    product: "RadSok 500V Heavy Power Plug (Nexon EV Gen3)",
    quantity: 1200,
    totalAmount: "₹29,60,000",
    carrier: "Amphenol Pune Dedicated Fleet",
    awbNumber: "AP-PN-04",
    deliveryDate: "18-Sep-2026",
    dispatchStatus: "Delivered"
  }
];

export default function CleanAdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [skus, setSkus] = useState<SkuItem[]>(INITIAL_SKUS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("ALL");
  const [selectedPlant, setSelectedPlant] = useState("Bhosari Central Plant (Pune)");

  // Modals
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Stage change
  const updateLeadStage = (leadId: string, newStage: LeadItem["stage"]) => {
    setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, stage: newStage } : l)));
  };

  // Stock quick adjustment
  const adjustStock = (partNo: string, delta: number) => {
    setSkus(prev =>
      prev.map(item => {
        if (item.partNo === partNo) {
          const updated = Math.max(0, item.bhosariStock + delta);
          return {
            ...item,
            bhosariStock: updated,
            status: updated <= item.safetyBuffer ? "Low Stock Alert" : "In Stock"
          };
        }
        return item;
      })
    );
  };

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === "ALL" || l.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. CLEAN LEFT SIDEBAR (DO PAHIYAA STYLE) */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-[#0c1322] border-r border-slate-800/90 flex flex-col justify-between shrink-0 fixed top-0 bottom-0 left-0 z-40 shadow-xl">
        <div>
          {/* Company Brand Header */}
          <div className="p-4 border-b border-slate-800/90">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                <span className="text-xl">A</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm tracking-wider flex items-center gap-1.5">
                  AMPHENOL
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-mono border border-blue-400/30">
                    INDIA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Pune Operations Central</p>
              </div>
            </Link>

            <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                System Online
              </span>
              <span className="text-slate-400 font-mono text-[10px]">ERP &amp; CRM v4.2</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            {/* Main Section */}
            <p className="px-3 pt-2 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Main Navigation
            </p>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Executive Dashboard</span>
            </button>

            {/* CRM Group */}
            <p className="px-3 pt-3 pb-1 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
              CRM (Sales &amp; Customers)
            </p>

            <button
              onClick={() => setActiveTab("leads")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "leads"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Leads &amp; Inquiries</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                ₹4.82 Cr
              </span>
            </button>

            <button
              onClick={() => setActiveTab("customers")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "customers"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Customer Accounts</span>
              </div>
              <span className="text-slate-400 text-[11px]">38 Key</span>
            </button>

            {/* ERP Group */}
            <p className="px-3 pt-3 pb-1 text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
              ERP (Factory &amp; Operations)
            </p>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "inventory"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 shrink-0" />
                <span>15k SKU Inventory</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                1 Alert
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Orders &amp; Dispatch</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                BlueDart
              </span>
            </button>

            <button
              onClick={() => setActiveTab("invoices")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "invoices"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>GST Tax Invoices</span>
            </button>

            {/* Governance */}
            <p className="px-3 pt-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Governance
            </p>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "security"
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Security &amp; Audit Log</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile & Return */}
        <div className="p-4 border-t border-slate-800/90 bg-[#090f1b]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
              RD
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-200 truncate">R. Deshmukh</div>
              <div className="text-[10px] text-slate-400 truncate">General Manager - Operations</div>
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
          >
            <span>← Back to Customer Storefront</span>
          </Link>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE (SPACIOUS, CLEAN & READABLE) */}
      {/* ========================================================================= */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-800/90 bg-[#0c1322]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Inquiries, Parts, HAL, DRDO, Tata Motors..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300">
              <span>Facility:</span>
              <select
                value={selectedPlant}
                onChange={e => setSelectedPlant(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
              >
                <option>Bhosari Central Plant (Pune)</option>
                <option>Chakan EV Connector Unit (Pune)</option>
                <option>Bengaluru Avionics R&D Lab</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-[11px] font-mono border border-blue-500/20">
              <Shield className="w-3 h-3" /> AWS Mumbai VPC • 2FA Enforced
            </span>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Tax Invoice</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 md:p-8 space-y-6">
          {/* ===================================================================== */}
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {/* ===================================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Pune Plant Operations Overview
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Centralized visibility of commercial leads, defense contracts, plant inventory, and dispatch SLA.
                  </p>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Monthly Report</span>
                </button>
              </div>

              {/* 4 Clean Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active RFQ Pipeline</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">₹4,82,50,000</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span>↑ +32.4%</span>
                    <span className="text-slate-400">surge in defense tenders</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Key Corporate Accounts</span>
                    <Building2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">38 Accounts</div>
                  <div className="text-[11px] text-slate-400">DRDO, HAL, Tata Motors, BEL, Mazagon</div>
                </div>

                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Plant Dispatch SLA</span>
                    <Truck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">99.4% On-Time</div>
                  <div className="text-[11px] text-indigo-400">BlueDart Defense Express integration</div>
                </div>

                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">15,000 SKUs Ledger</span>
                    <Package className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">14,890 Ready</div>
                  <div className="text-[11px] text-amber-400">1 Low stock reorder (62IN series)</div>
                </div>
              </div>

              {/* ========================================================== */}
              {/* CIRCULAR REPORTS & VISUAL GRAPHS SECTION */}
              {/* ========================================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* 1. CIRCULAR DONUT CHART: SECTOR REVENUE SHARE */}
                <div className="lg:col-span-5 p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Circular Pipeline Report (Revenue by Sector)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Consolidated share across active ₹4.82 Cr orders</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      FY 2026-27
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
                    {/* SVG Donut Chart with Center Total */}
                    <div className="relative w-40 h-40 shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {/* Background Ring */}
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#1e293b" strokeWidth="12" />
                        {/* Defense: 58% -> strokeDasharray="138 238" */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="12"
                          strokeDasharray="138 238"
                          strokeDashoffset="0"
                          className="transition-all duration-1000"
                        />
                        {/* Automotive EV: 24% -> strokeDasharray="57 238" */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="12"
                          strokeDasharray="57 238"
                          strokeDashoffset="-138"
                          className="transition-all duration-1000"
                        />
                        {/* Aerospace: 12% -> strokeDasharray="28 238" */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="12"
                          strokeDasharray="28 238"
                          strokeDashoffset="-195"
                          className="transition-all duration-1000"
                        />
                        {/* Naval: 6% -> strokeDasharray="15 238" */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="12"
                          strokeDasharray="15 238"
                          strokeDashoffset="-223"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      {/* Center Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total</span>
                        <span className="text-base font-mono font-bold text-white tracking-tight">₹4.82 Cr</span>
                        <span className="text-[9px] text-emerald-400">38 Accounts</span>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="space-y-2.5 w-full text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          <span className="text-slate-300">Defense (DRDO/HAL)</span>
                        </div>
                        <span className="font-mono font-bold text-white">58% <span className="text-slate-500 text-[10px]">(₹2.80 Cr)</span></span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          <span className="text-slate-300">Automotive EV</span>
                        </div>
                        <span className="font-mono font-bold text-white">24% <span className="text-slate-500 text-[10px]">(₹1.15 Cr)</span></span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                          <span className="text-slate-300">Aerospace Avionics</span>
                        </div>
                        <span className="font-mono font-bold text-white">12% <span className="text-slate-500 text-[10px]">(₹58 Lakh)</span></span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <span className="text-slate-300">Naval Submarine</span>
                        </div>
                        <span className="font-mono font-bold text-white">6% <span className="text-slate-500 text-[10px]">(₹29 Lakh)</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. CIRCULAR RADIAL GAUGES & MONTHLY VELOCITY TREND */}
                <div className="lg:col-span-7 p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Pune Plant Health &amp; Monthly Growth Trend</h3>
                      <p className="text-[11px] text-slate-400">Radial operational meters &amp; monthly order velocity</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      SLA: Optimal
                    </span>
                  </div>

                  {/* 3 Circular Radial Gauges */}
                  <div className="grid grid-cols-3 gap-3 py-1">
                    {/* Gauge 1: Dispatch SLA */}
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center text-center">
                      <div className="relative w-16 h-16">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="99.4, 100" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-white">
                          99.4%
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-200 mt-2">On-Time Dispatch</span>
                      <span className="text-[9px] text-emerald-400">BlueDart SLA</span>
                    </div>

                    {/* Gauge 2: CNC Machining Capacity */}
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center text-center">
                      <div className="relative w-16 h-16">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="92, 100" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-white">
                          92.0%
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-200 mt-2">Plant CNC Load</span>
                      <span className="text-[9px] text-blue-400">Bhosari Bays 1-3</span>
                    </div>

                    {/* Gauge 3: MIL-STD QA Pass */}
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center text-center">
                      <div className="relative w-16 h-16">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="99.8, 100" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-white">
                          99.8%
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-200 mt-2">QA Test Yield</span>
                      <span className="text-[9px] text-purple-400">AS9100D Labs</span>
                    </div>
                  </div>

                  {/* Monthly Trend Bar Visuals */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-2">
                      <span>Monthly Inbound RFQ Velocity (Apr - Sep 2026)</span>
                      <span className="font-mono text-emerald-400">Avg ₹80.4L / month</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2 items-end h-16 pt-2">
                      {[
                        { month: "Apr", val: "45%", amt: "₹52L" },
                        { month: "May", val: "60%", amt: "₹68L" },
                        { month: "Jun", val: "55%", amt: "₹61L" },
                        { month: "Jul", val: "75%", amt: "₹84L" },
                        { month: "Aug", val: "85%", amt: "₹96L" },
                        { month: "Sep", val: "100%", amt: "₹1.2Cr" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
                          <span className="text-[9px] font-mono text-slate-500 group-hover:text-white transition-colors">{item.amt}</span>
                          <div className="w-full bg-slate-800 rounded-t overflow-hidden h-full flex items-end">
                            <div
                              className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t group-hover:from-blue-500 group-hover:to-emerald-400 transition-all"
                              style={{ height: item.val }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================== */}
              {/* 3. FULL-WIDTH PROMINENT B2B ORDER VELOCITY ANALYTICS GRAPH */}
              {/* ========================================================== */}
              <div className="p-6 rounded-xl bg-[#0c1322] border border-slate-800 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span>B2B Order Velocity &amp; Monthly Revenue Trajectory</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Multi-month comparison of Inbound Defense RFQs vs Confirmed Plant Dispatches
                    </p>
                  </div>

                  {/* Chart Legend & Filter */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
                      <span className="text-slate-300 font-medium">Inbound RFQ Pipeline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                      <span className="text-slate-300 font-medium">Confirmed Dispatches</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-slate-900 text-blue-400 font-mono text-[11px] border border-slate-800">
                      FY26 Q1-Q2
                    </span>
                  </div>
                </div>

                {/* SVG High-Resolution Area Graph */}
                <div className="relative w-full h-64 sm:h-72 select-none pt-2">
                  <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible">
                    <defs>
                      {/* Gradient for Inbound RFQ Wave (Blue) */}
                      <linearGradient id="blueWave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                      {/* Gradient for Dispatches Wave (Emerald) */}
                      <linearGradient id="greenWave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Dashed Grid Lines & Y-Axis Labels */}
                    <g className="text-[10px] fill-slate-500 font-mono">
                      {/* ₹1.2 Cr Line */}
                      <line x1="60" y1="20" x2="780" y2="20" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
                      <text x="50" y="24" textAnchor="end">₹1.2 Cr</text>

                      {/* ₹90 Lakh Line */}
                      <line x1="60" y1="65" x2="780" y2="65" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
                      <text x="50" y="69" textAnchor="end">₹90 L</text>

                      {/* ₹60 Lakh Line */}
                      <line x1="60" y1="110" x2="780" y2="110" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
                      <text x="50" y="114" textAnchor="end">₹60 L</text>

                      {/* ₹30 Lakh Line */}
                      <line x1="60" y1="155" x2="780" y2="155" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
                      <text x="50" y="159" textAnchor="end">₹30 L</text>

                      {/* Base Line */}
                      <line x1="60" y1="200" x2="780" y2="200" stroke="#334155" strokeWidth="1.5" />
                      <text x="50" y="204" textAnchor="end">₹0</text>
                    </g>

                    {/* Area 1: Inbound RFQ Wave (Blue Area) */}
                    {/* Points: Apr(80, 122), May(220, 98), Jun(360, 108), Jul(500, 74), Aug(640, 56), Sep(760, 20) */}
                    <path
                      d="M 80 122 Q 150 110, 220 98 T 360 108 T 500 74 T 640 56 T 760 20 L 760 200 L 80 200 Z"
                      fill="url(#blueWave)"
                    />
                    {/* Stroke Line for Inbound RFQs */}
                    <path
                      d="M 80 122 Q 150 110, 220 98 T 360 108 T 500 74 T 640 56 T 760 20"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Area 2: Completed Dispatches (Emerald Area) */}
                    {/* Points: Apr(80, 148), May(220, 126), Jun(360, 134), Jul(500, 102), Aug(640, 80), Sep(760, 52) */}
                    <path
                      d="M 80 148 Q 150 137, 220 126 T 360 134 T 500 102 T 640 80 T 760 52 L 760 200 L 80 200 Z"
                      fill="url(#greenWave)"
                    />
                    {/* Stroke Line for Dispatches */}
                    <path
                      d="M 80 148 Q 150 137, 220 126 T 360 134 T 500 102 T 640 80 T 760 52"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="2 0"
                    />

                    {/* Milestone Glowing Dots & Labels on Inbound Line */}
                    {/* Apr Dot */}
                    <circle cx="80" cy="122" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                    {/* May Dot */}
                    <circle cx="220" cy="98" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                    {/* Jun Dot */}
                    <circle cx="360" cy="108" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                    {/* Jul Dot (Tata EV Surge) */}
                    <circle cx="500" cy="74" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2.5" />
                    {/* Aug Dot (DRDO Batch) */}
                    <circle cx="640" cy="56" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2.5" />
                    {/* Sep Dot (Mega Peak HAL ₹1.2 Cr) */}
                    <circle cx="760" cy="20" r="7" fill="#60a5fa" stroke="#ffffff" strokeWidth="3" className="animate-pulse" />

                    {/* Value Floating Badges */}
                    <g className="text-[10px] font-mono font-bold fill-white">
                      <rect x="62" y="96" width="36" height="18" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                      <text x="80" y="109" textAnchor="middle">₹52L</text>

                      <rect x="202" y="72" width="36" height="18" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                      <text x="220" y="85" textAnchor="middle">₹68L</text>

                      <rect x="342" y="82" width="36" height="18" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                      <text x="360" y="95" textAnchor="middle">₹61L</text>

                      <rect x="480" y="48" width="40" height="18" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                      <text x="500" y="61" textAnchor="middle">₹84L</text>

                      <rect x="620" y="30" width="40" height="18" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                      <text x="640" y="43" textAnchor="middle">₹96L</text>

                      {/* Peak Badge */}
                      <rect x="732" y="-6" width="56" height="20" rx="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="760" y="8" textAnchor="middle" fill="#ffffff">₹1.20 Cr</text>
                    </g>

                    {/* X-Axis Month Labels */}
                    <g className="text-xs font-semibold fill-slate-300">
                      <text x="80" y="224" textAnchor="middle">Apr 2026</text>
                      <text x="220" y="224" textAnchor="middle">May 2026</text>
                      <text x="360" y="224" textAnchor="middle">Jun 2026</text>
                      <text x="500" y="224" textAnchor="middle">Jul 2026 (Tata EV)</text>
                      <text x="640" y="224" textAnchor="middle">Aug 2026 (DRDO)</text>
                      <text x="760" y="224" textAnchor="middle" fill="#60a5fa" className="font-bold">Sep (HAL Peak)</text>
                    </g>
                  </svg>
                </div>

                {/* Graph Footer Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">Quarterly Peak Inflow</span>
                    <div className="font-mono font-bold text-white text-sm mt-0.5">₹1.20 Crore (Sep)</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">6-Month Inbound Growth</span>
                    <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">+130.7% Surge</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">B2B Conversion Rate</span>
                    <div className="font-mono font-bold text-blue-400 text-sm mt-0.5">78.4% Won Tenders</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase">Factory Dispatch Rate</span>
                    <div className="font-mono font-bold text-indigo-300 text-sm mt-0.5">99.4% On-Schedule</div>
                  </div>
                </div>
              </div>

              {/* Clean Recent Leads Table */}
              <div className="rounded-xl bg-[#0c1322] border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Recent Strategic Defense &amp; EV Inquiries</h3>
                    <p className="text-xs text-slate-400">Inbound requests requiring commercial proposals</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("leads")}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <span>View All Inquiries</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">RFQ Number</th>
                        <th className="py-3 px-4">Client Organization</th>
                        <th className="py-3 px-4">Sector</th>
                        <th className="py-3 px-4">Target Application</th>
                        <th className="py-3 px-4">Estimated Value</th>
                        <th className="py-3 px-4">Current Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {leads.slice(0, 4).map(lead => (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{lead.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{lead.company}</div>
                            <div className="text-[11px] text-slate-400">{lead.contactPerson}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                              {lead.sector}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{lead.project}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">{lead.dealValue}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                lead.stage === "Won & Closed"
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

          {/* ===================================================================== */}
          {/* TAB 2: LEADS & INQUIRIES (CRM) */}
          {/* ===================================================================== */}
          {activeTab === "leads" && (
            <div className="space-y-5">
              {/* Header & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    B2B Leads &amp; RFQ Pipeline (CRM)
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage tier-1 commercial inquiries, update proposal status, and view customer dossiers.
                  </p>
                </div>

                {/* Sector Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                  {["ALL", "Defense", "Automotive EV", "Aerospace", "Naval"].map(sec => (
                    <button
                      key={sec}
                      onClick={() => setSectorFilter(sec)}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        sectorFilter === sec ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comprehensive Full-Width Table */}
              <div className="rounded-xl bg-[#0c1322] border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">RFQ ID &amp; Client</th>
                        <th className="py-3 px-4">Authorized Contact</th>
                        <th className="py-3 px-4">Sector</th>
                        <th className="py-3 px-4">Connector Solution</th>
                        <th className="py-3 px-4">Deal Value</th>
                        <th className="py-3 px-4">Milestone Stage</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-mono text-blue-400 font-bold">{lead.id}</div>
                            <div className="font-semibold text-white text-sm">{lead.company}</div>
                            <div className="text-[10px] text-slate-400">GSTIN: {lead.gstin}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            <div className="font-medium text-slate-200">{lead.contactPerson}</div>
                            <div className="text-[11px] text-slate-400">{lead.contactTitle}</div>
                            <div className="text-[11px] text-blue-400">{lead.email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                              {lead.sector}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="text-slate-200 font-medium truncate">{lead.project}</div>
                            <div className="text-[11px] text-blue-300 truncate">{lead.partsRequested}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                            {lead.dealValue}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={lead.stage}
                              onChange={e => updateLeadStage(lead.id, e.target.value as LeadItem["stage"])}
                              className="bg-slate-900 border border-slate-700 text-blue-300 font-medium rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="New Inquiry">New Inquiry</option>
                              <option value="Technical Review">Technical Review</option>
                              <option value="Formal Quotation">Formal Quotation</option>
                              <option value="PO Awaited">PO Awaited</option>
                              <option value="Won & Closed">Won &amp; Closed</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/30 transition-colors"
                            >
                              View Details
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

          {/* ===================================================================== */}
          {/* TAB 3: CUSTOMER ACCOUNTS */}
          {/* ===================================================================== */}
          {activeTab === "customers" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Strategic Corporate Accounts Directory
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Tier-1 defense laboratories, naval shipbuilders, and automotive EV manufacturers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads.map(lead => (
                  <div
                    key={lead.id}
                    className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3 hover:border-slate-700 transition-colors shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                          {lead.sector}
                        </span>
                        <h3 className="text-sm font-bold text-white mt-2">{lead.company}</h3>
                        <p className="text-[11px] text-slate-400 font-mono">GST: {lead.gstin}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-xs space-y-1 text-slate-300">
                      <div>
                        <span className="text-slate-400">Authorized Lead:</span> {lead.contactPerson} ({lead.contactTitle})
                      </div>
                      <div className="text-blue-400">{lead.email}</div>
                      <div>{lead.phone}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Total Contract Value:</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">{lead.dealValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: 15K SKU INVENTORY (ERP) */}
          {/* ===================================================================== */}
          {activeTab === "inventory" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    15,000 SKUs Plant Inventory Matrix (ERP)
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-warehouse stock balancing between Bhosari Central Plant and Chakan Assembly facility.
                  </p>
                </div>
                <button
                  onClick={() => alert("Simulating instant synchronization with factory SAP B1 ledger.")}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Sync SAP / Excel</span>
                </button>
              </div>

              <div className="rounded-xl bg-[#0c1322] border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Military Part Number</th>
                        <th className="py-3 px-4">Series &amp; Description</th>
                        <th className="py-3 px-4">Bhosari Plant Stock</th>
                        <th className="py-3 px-4">Chakan Plant Stock</th>
                        <th className="py-3 px-4">Safety Buffer</th>
                        <th className="py-3 px-4">Unit Price</th>
                        <th className="py-3 px-4">Stock Status</th>
                        <th className="py-3 px-4 text-right">Quick Stock In/Out</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {skus.map(sku => (
                        <tr key={sku.partNo} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-400 text-sm">
                            {sku.partNo}
                          </td>
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="font-semibold text-white">{sku.series}</div>
                            <div className="text-[11px] text-slate-400 truncate">{sku.description}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {sku.bhosariStock} pcs
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {sku.chakanStock} pcs
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">
                            {sku.safetyBuffer} pcs
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                            {sku.unitPrice}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                sku.status === "In Stock"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : sku.status === "Low Stock Alert"
                                  ? "bg-red-500/20 text-red-300 border-red-500/30 font-bold"
                                  : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              }`}
                            >
                              {sku.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => adjustStock(sku.partNo, 50)}
                              className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-mono text-xs border border-emerald-500/30"
                              title="Add 50 pcs into warehouse"
                            >
                              +50 IN
                            </button>
                            <button
                              onClick={() => adjustStock(sku.partNo, -50)}
                              className="px-2 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 font-mono text-xs border border-red-500/30"
                              title="Dispatch 50 pcs"
                            >
                              -50 OUT
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

          {/* ===================================================================== */}
          {/* TAB 5: ORDERS & DISPATCH (ERP) */}
          {/* ===================================================================== */}
          {activeTab === "orders" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Defense &amp; OEM Order Dispatch Logistics (ERP)
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Integrated BlueDart Defense Express AWB tracking and government escorted logistics.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">
                  BlueDart Air EDI Connected
                </span>
              </div>

              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.orderId}
                    className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="font-mono text-blue-400 font-bold">{order.orderId}</span>
                        <span className="mx-2 text-slate-600">•</span>
                        <span className="font-bold text-white">{order.client}</span>
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          PO: {order.poNumber}
                        </span>
                      </div>
                      <div className="font-mono text-base font-bold text-white">{order.totalAmount}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Product Batch:</span>
                        <div className="font-semibold text-slate-200 mt-0.5">{order.product}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Carrier:</span>
                        <div className="text-slate-200 mt-0.5">{order.carrier}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Tracking AWB:</span>
                        <div className="font-mono text-blue-400 font-bold mt-0.5">{order.awbNumber}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Delivery Target:</span>
                        <div className="text-emerald-400 font-semibold mt-0.5">{order.deliveryDate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 6: GST TAX INVOICES (ERP) */}
          {/* ===================================================================== */}
          {activeTab === "invoices" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Domestic GST Invoicing &amp; Accounts Ledger (ERP)
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Auto-calculating 18% GST (9% CGST + 9% SGST / 18% IGST) for Indian corporate billing.
                  </p>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Tax Invoice</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">FY 2026-27 Domestic Billed</span>
                  <div className="text-2xl font-bold text-white">₹14,28,40,000</div>
                  <div className="text-[11px] text-emerald-400">100% GSTR-1 Reconciled</div>
                </div>

                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Total GST Collected (18%)</span>
                  <div className="text-2xl font-bold text-blue-400">₹2,57,11,200</div>
                  <div className="text-[11px] text-slate-400">CGST: ₹1.28 Cr | SGST: ₹1.28 Cr</div>
                </div>

                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Payment Reconciliation</span>
                  <div className="text-2xl font-bold text-emerald-400">100% Cleared</div>
                  <div className="text-[11px] text-slate-400">NEFT / RTGS auto-matched</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white">Recent Tax Invoices &amp; E-Way Bills</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-blue-400 font-bold">INV-2026-0901 • HAL Nashik</div>
                      <div className="text-slate-400">PO: HAL/AVN/8912 • E-Way Bill #281900129381</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">₹38,40,000 + 18% GST</div>
                      <span className="text-[10px] text-emerald-400">Payment Received</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-blue-400 font-bold">INV-2026-0902 • Tata Motors EV</div>
                      <div className="text-slate-400">PO: TM-PUN/EV/55129 • E-Way Bill #281900129382</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">₹29,60,000 + 18% GST</div>
                      <span className="text-[10px] text-emerald-400">Payment Received</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 7: SECURITY & AUDIT LOG */}
          {/* ===================================================================== */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Security Governance &amp; Immutable Audit Trail
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Defense-grade cryptographic logs, AWS Mumbai VPC telemetry, and role-based access control.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3 text-xs">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Security Infrastructure
                  </h3>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Hosting Environment</span>
                    <span className="text-white font-mono">Dedicated AWS Mumbai (ap-south-1)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">2FA Enforcement</span>
                    <span className="text-emerald-400 font-semibold">Active &amp; Mandatory</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Database Encryption</span>
                    <span className="text-white font-mono">AES-256 at rest, TLS 1.3 in transit</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3 text-xs">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    Live System Telemetry
                  </h3>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">API Latency</span>
                    <span className="text-emerald-400 font-mono">24ms (Edge Cache Hit)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Annual Uptime SLA</span>
                    <span className="text-emerald-400 font-mono">99.98%</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Disaster Recovery RPO / RTO</span>
                    <span className="text-blue-400 font-mono">RPO: 5 min | RTO: 15 min</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. DETAIL MODAL: CLIENT INQUIRY DOSSIER (CRM) */}
      {/* ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0c1322] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {selectedLead.id} • {selectedLead.sector}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedLead.company}</h3>
                <p className="text-xs text-slate-400">{selectedLead.project}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Authorized Officer:</span>
                <span className="font-semibold text-white">
                  {selectedLead.contactPerson} ({selectedLead.contactTitle})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Official Email:</span>
                <span className="text-blue-400">{selectedLead.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="text-slate-200">{selectedLead.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GSTIN:</span>
                <span className="font-mono text-slate-300">{selectedLead.gstin}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                <span className="text-slate-400">Estimated Tender Value:</span>
                <span className="font-mono font-bold text-emerald-400">{selectedLead.dealValue}</span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-slate-400 font-semibold">Requested Connector Specification:</span>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200">
                {selectedLead.partsRequested}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("Formal commercial quotation proposal generated for " + selectedLead.company);
                  setSelectedLead(null);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Official Quote PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: GST TAX INVOICE PREVIEW */}
      {/* ========================================================================= */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c1322] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Official GST Tax Invoice Preview (Domestic Factory Sale)
                </h3>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <div>
                  <div className="font-bold text-white text-sm">AMPHENOL INTERCONNECT INDIA PVT. LTD.</div>
                  <div className="text-slate-400 text-[11px]">Plot No. 105, MIDC, Bhosari, Pune - 411026</div>
                  <div className="text-blue-400 text-[11px]">GSTIN: 27AAACA1234F1Z1 • State: Maharashtra (27)</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400">Invoice: INV-2026-0914</div>
                  <div className="text-slate-400">Date: 17-Sep-2026</div>
                </div>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <div>
                  <span className="text-slate-400">Billed To (Customer):</span>
                  <div className="font-bold text-white">Mahindra &amp; Mahindra EV Powertrain</div>
                  <div className="text-slate-400">GSTIN: 27AAACM1234F1Z5</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Place of Supply:</span>
                  <div className="text-white">Pune, Maharashtra (Intra-State)</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-slate-300">
                  <span>Product: RadSok 1000A EV Connectors (HSN: 85366990)</span>
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
                  <span>Total Amount Payable (Incl. 18% GST):</span>
                  <span className="text-base">₹68,00,000.00</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Tax Invoice PDF downloaded to local storage.");
                  setShowInvoiceModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
