"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Factory,
  LayoutDashboard,
  Users,
  Truck,
  Package,
  FileText,
  ShieldCheck,
  Search,
  Bell,
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
  FileSpreadsheet,
  Cpu,
  BarChart3,
  BadgePercent,
  CheckSquare,
  Compass,
  ArrowRight,
  Printer,
  Kanban,
  Table as TableIcon,
  PhoneCall,
  Mail,
  FileCode,
  Calendar,
  ChevronRight,
  Sparkles,
  Zap,
  Boxes,
  Microscope,
  ClipboardCheck,
  Send
} from "lucide-react";

// Types
type SuiteMode = "crm" | "erp";
type CrmViewMode = "kanban" | "table";
type ErpSubTab = "bom" | "workorders" | "qc" | "logistics" | "gst";

interface DealCard {
  id: string;
  company: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  sector: "Defense" | "Automotive EV" | "Aerospace" | "Naval" | "Industrial";
  project: string;
  parts: string;
  value: string;
  valueNumeric: number;
  stage: "inquiry" | "tech_eval" | "quotation" | "negotiation" | "won";
  accountManager: string;
  daysInStage: number;
  activityNotes: string[];
  lastActivity: string;
}

interface RawMaterialBOM {
  code: string;
  name: string;
  category: "Alloy & Shells" | "Contacts & Plating" | "Elastomer Seals" | "Insulators";
  stock: number;
  unit: string;
  minThreshold: number;
  supplier: string;
  status: "Sufficient" | "Reorder Required";
  unitCost: string;
}

interface WorkOrder {
  orderId: string;
  batchCode: string;
  client: string;
  product: string;
  line: "Bhosari Circular Bay 1" | "Chakan EV Bay 2" | "Hermetic Vault 3";
  targetQty: number;
  completedQty: number;
  leadOperator: string;
  status: "In Tooling" | "Assembly Running" | "QA Testing" | "Ready for Packing";
  dueDays: number;
}

interface QcLabTest {
  testId: string;
  milStandard: string;
  testName: string;
  specThreshold: string;
  actualMeasured: string;
  testedBatch: string;
  certifiedBy: string;
  status: "PASS" | "IN_CHAMBER";
  date: string;
}

// Initial Data
const INITIAL_DEALS: DealCard[] = [
  {
    id: "DEAL-2026-01",
    company: "Mahindra & Mahindra EV Powertrain",
    contactName: "Dr. Vikram Joshi",
    contactTitle: "VP - High Voltage Architecture",
    email: "v.joshi@mahindra-ev.com",
    phone: "+91 98220 11928",
    sector: "Automotive EV",
    project: "800V DC Busbar Interconnect for Born Electric SUV Platform",
    parts: "Amphenol RadSok 1000A Quick-Disconnect Header (Qty: 2,400)",
    value: "₹68,00,000",
    valueNumeric: 6800000,
    stage: "quotation",
    accountManager: "Rajesh Shinde (EV Business Head)",
    daysInStage: 2,
    lastActivity: "Formal commercial quote sent with 18% GST and 4-week delivery",
    activityNotes: [
      "17-Sep: Formal quote sent via portal with GST breakup (Proposal #Q-8821).",
      "14-Sep: CAD STEP models approved by Mahindra harness engineering team.",
      "10-Sep: Initial engineering requirement logged from website configurator."
    ]
  },
  {
    id: "DEAL-2026-02",
    company: "Bharat Electronics Ltd (BEL Bengaluru)",
    contactName: "R. Narayanan",
    contactTitle: "Chief Procurement Officer - Radar Systems",
    email: "r.narayanan@bel.co.in",
    phone: "+91 80 2838 1200",
    sector: "Defense",
    project: "Air Defense Tactical Radar Front-End Antenna Harness",
    parts: "MIL-DTL-38999 Series III Olive Drab Cadmium Shell 25 (Qty: 450)",
    value: "₹45,00,000",
    valueNumeric: 4500000,
    stage: "tech_eval",
    accountManager: "Col. S. Deshpande (Retd. - Defense KAM)",
    daysInStage: 4,
    lastActivity: "Mil-Spec pin arrangement mating diagram under technical review",
    activityNotes: [
      "16-Sep: QA sent salt spray test certificate MIL-STD-810H for Olive Drab finish.",
      "13-Sep: RFQ submitted for 128-contact high-density insert arrangement."
    ]
  },
  {
    id: "DEAL-2026-03",
    company: "Mazagon Dock Shipbuilders Ltd",
    contactName: "Capt. A. K. Sharma",
    contactTitle: "Project 75I Subsea Integration Officer",
    email: "aksharma@mazagondock.gov.in",
    phone: "+91 22 2376 0000",
    sector: "Naval",
    project: "Hull Penetration Hermetic Feedthroughs (300 Bar Subsea Pressure)",
    parts: "AquaWeld Subsea Stainless 316L Deep-Immersion Plugs (Qty: 18)",
    value: "₹92,00,000",
    valueNumeric: 9200000,
    stage: "negotiation",
    accountManager: "Col. S. Deshpande (Retd. - Defense KAM)",
    daysInStage: 6,
    lastActivity: "Final price negotiation with Indian Navy naval design bureau",
    activityNotes: [
      "17-Sep: Final tender commercial negotiation round 2 completed.",
      "12-Sep: Helium mass spectrometer leak test report (<1x10^-9 cc/s) submitted.",
      "05-Sep: Naval technical evaluation committee cleared sample tests."
    ]
  },
  {
    id: "DEAL-2026-04",
    company: "Ather Energy Pvt Ltd",
    contactName: "Sandeep Rao",
    contactTitle: "Lead Battery Pack Harness Engineer",
    email: "sandeep.r@atherenergy.com",
    phone: "+91 97401 22849",
    sector: "Automotive EV",
    project: "Gen-4 450X High-Rate Battery Pack Rapid Terminal",
    parts: "Compact IP67 RadSok Terminal Connectors (Qty: 12,000)",
    value: "₹24,50,000",
    valueNumeric: 2450000,
    stage: "inquiry",
    accountManager: "Rajesh Shinde (EV Business Head)",
    daysInStage: 1,
    lastActivity: "New inbound lead from website AI Interconnect Advisor",
    activityNotes: [
      "17-Sep: Lead auto-synced from AI Copilot assistant with IP67 requirement.",
      "17-Sep: Sample dispatch scheduled from Bhosari warehouse."
    ]
  },
  {
    id: "DEAL-2026-05",
    company: "Hindustan Aeronautics Ltd (HAL Nashik)",
    contactName: "Col. Pradeep Sen",
    contactTitle: "Avionics Upgrades Program Director",
    email: "p.sen@hal-india.co.in",
    phone: "+91 253 277 1211",
    sector: "Aerospace",
    project: "Su-30 MKI Cockpit Electronic Warfare Radar Upgrade Batch 4",
    parts: "62IN Miniature Bayonet & Hermetic Receptacles (Qty: 1,200)",
    value: "₹1,15,00,000",
    valueNumeric: 11500000,
    stage: "won",
    accountManager: "Col. S. Deshpande (Retd. - Defense KAM)",
    daysInStage: 12,
    lastActivity: "PO received: HAL/AVN/2026/8912 • Moved to Factory ERP Line 1",
    activityNotes: [
      "15-Sep: Official Purchase Order received (PO #HAL/AVN/2026/8912).",
      "15-Sep: Transferred into Plant ERP for production work order WO-441.",
      "08-Sep: Commercial proposal approved by HAL finance board."
    ]
  },
  {
    id: "DEAL-2026-06",
    company: "DRDL Hyderabad (DRDO Missile Complex)",
    contactName: "Dr. K. Swaminathan",
    contactTitle: "Head - Missile Guidance & Control Fin Actuators",
    email: "k.swami@drdl.res.in",
    phone: "+91 40 2458 3000",
    sector: "Defense",
    project: "Surface-to-Air QRSAM Canister Launch Harness",
    parts: "Micro-D Subminiature Mil-Spec Assemblies (Qty: 800)",
    value: "₹54,20,000",
    valueNumeric: 5420000,
    stage: "tech_eval",
    accountManager: "Col. S. Deshpande (Retd. - Defense KAM)",
    daysInStage: 3,
    lastActivity: "Environmental shock & vibration profile under simulation test",
    activityNotes: [
      "16-Sep: 50G high-shock testing test report shared with DRDO scientists.",
      "11-Sep: Technical drawings signed under defense non-disclosure protocol."
    ]
  }
];

const RAW_MATERIALS: RawMaterialBOM[] = [
  {
    code: "RAW-AL-6061",
    name: "Aluminum 6061-T6 Bar Stock (Connector Shells)",
    category: "Alloy & Shells",
    stock: 1420,
    unit: "Kg",
    minThreshold: 400,
    supplier: "Hindalco Aerospace Alloys",
    status: "Sufficient",
    unitCost: "₹480 / Kg"
  },
  {
    code: "RAW-CU-BE",
    name: "C17200 Beryllium Copper Rods (Mil-Spec Pins)",
    category: "Contacts & Plating",
    stock: 84000,
    unit: "Pins",
    minThreshold: 25000,
    supplier: "Materion High Performance Metals",
    status: "Sufficient",
    unitCost: "₹18.50 / Pin"
  },
  {
    code: "RAW-AU-SALT",
    name: "Potassium Gold Cyanide Bath (50 Micro-inch Plating)",
    category: "Contacts & Plating",
    stock: 8,
    unit: "Litres",
    minThreshold: 15,
    supplier: "Tanaka Precious Metals India",
    status: "Reorder Required",
    unitCost: "₹1,45,000 / L"
  },
  {
    code: "RAW-VITON-OR",
    name: "Fluorocarbon Viton O-Rings (-55°C to +200°C Seal)",
    category: "Elastomer Seals",
    stock: 12500,
    unit: "Pcs",
    minThreshold: 3000,
    supplier: "Parker Hannifin India",
    status: "Sufficient",
    unitCost: "₹42 / Pc"
  },
  {
    code: "RAW-PPS-RESIN",
    name: "Polyphenylene Sulfide (PPS) Insulator Resin",
    category: "Insulators",
    stock: 650,
    unit: "Kg",
    minThreshold: 200,
    supplier: "Toray Plastics",
    status: "Sufficient",
    unitCost: "₹920 / Kg"
  }
];

const WORK_ORDERS: WorkOrder[] = [
  {
    orderId: "WO-2026-881",
    batchCode: "BATCH-62IN-HAL",
    client: "Hindustan Aeronautics Ltd (HAL Nashik)",
    product: "62IN-12E14-19S Miniature Hermetic Receptacles",
    line: "Bhosari Circular Bay 1",
    targetQty: 480,
    completedQty: 390,
    leadOperator: "Mahesh Patil (Master Machinist)",
    status: "Assembly Running",
    dueDays: 5
  },
  {
    orderId: "WO-2026-882",
    batchCode: "BATCH-38999-DRDO",
    client: "DRDO - ASL Hyderabad",
    product: "MIL-DTL-38999 Series III Jam-Nut Receptacles",
    line: "Bhosari Circular Bay 1",
    targetQty: 250,
    completedQty: 250,
    leadOperator: "Sunil Kadam (CNC Specialist)",
    status: "QA Testing",
    dueDays: 2
  },
  {
    orderId: "WO-2026-883",
    batchCode: "BATCH-RADSOK-TATA",
    client: "Tata Motors EV Division",
    product: "RadSok 500V Heavy Power Connectors (Nexon EV)",
    line: "Chakan EV Bay 2",
    targetQty: 1200,
    completedQty: 1200,
    leadOperator: "Vikas Shinde (Robotics Automation)",
    status: "Ready for Packing",
    dueDays: 1
  },
  {
    orderId: "WO-2026-884",
    batchCode: "BATCH-AQWLD-NAVY",
    client: "Mazagon Dock Shipbuilders Ltd",
    product: "AquaWeld Subsea 316L Immersion Plugs (300 Bar)",
    line: "Hermetic Vault 3",
    targetQty: 18,
    completedQty: 6,
    leadOperator: "Dr. Arvind Gokhale (Metallurgist)",
    status: "In Tooling",
    dueDays: 14
  }
];

const QC_TESTS: QcLabTest[] = [
  {
    testId: "QC-2026-901",
    milStandard: "MIL-STD-810H Method 509.7",
    testName: "500-Hour 5% Neutral Salt Spray Corrosion Test",
    specThreshold: "No base metal corrosion visible after 500 hrs",
    actualMeasured: "Passed: 528 hrs continuous exposure, 0 pits",
    testedBatch: "BATCH-38999-DRDO (10 Samples)",
    certifiedBy: "G. R. Nair (Chief QA Inspector, AS9100D)",
    status: "PASS",
    date: "17-Sep-2026"
  },
  {
    testId: "QC-2026-902",
    milStandard: "MIL-STD-1344A Method 3003",
    testName: "Dielectric Withstanding Voltage (DWV @ 1800V AC)",
    specThreshold: "Leakage current < 2.0 mA @ 1800V AC 60s",
    actualMeasured: "0.18 mA recorded across all adjacent pins",
    testedBatch: "BATCH-62IN-HAL (25 Samples)",
    certifiedBy: "Anita Kulkarni (High-Voltage Metrology)",
    status: "PASS",
    date: "16-Sep-2026"
  },
  {
    testId: "QC-2026-903",
    milStandard: "MIL-STD-202 Method 112",
    testName: "Helium Mass Spectrometer Hermetic Leak Rate",
    specThreshold: "Helium leak rate < 1.0 x 10^-8 atm cc/s",
    actualMeasured: "3.4 x 10^-10 atm cc/s (Superior Seal)",
    testedBatch: "BATCH-AQWLD-NAVY (3 Samples)",
    certifiedBy: "Dr. Arvind Gokhale (Hermetics Specialist)",
    status: "PASS",
    date: "15-Sep-2026"
  },
  {
    testId: "QC-2026-904",
    milStandard: "MIL-STD-810H Method 514.8",
    testName: "Random Vibration & 50G Mechanical Shock Test",
    specThreshold: "No electrical discontinuity > 1.0 microsecond",
    actualMeasured: "Testing in progress (Tri-axial shaker chamber)",
    testedBatch: "BATCH-MICRO-D-DRDL",
    certifiedBy: "Vibration Test Lab (Bhosari Unit)",
    status: "IN_CHAMBER",
    date: "Active Live Test"
  }
];

export default function EnterpriseBestStandardPage() {
  // Primary Switch: Sales CRM vs Factory ERP
  const [suiteMode, setSuiteMode] = useState<SuiteMode>("crm");

  // CRM Sub-Views
  const [crmView, setCrmView] = useState<CrmViewMode>("kanban");
  const [deals, setDeals] = useState<DealCard[]>(INITIAL_DEALS);
  const [selectedDealForDossier, setSelectedDealForDossier] = useState<DealCard | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [quoteTargetDeal, setQuoteTargetDeal] = useState<DealCard | null>(null);

  // ERP Sub-Tabs
  const [erpTab, setErpTab] = useState<ErpSubTab>("bom");
  const [rawMaterials, setRawMaterials] = useState<RawMaterialBOM[]>(RAW_MATERIALS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(WORK_ORDERS);
  const [qcTests] = useState<QcLabTest[]>(QC_TESTS);
  const [showGstModal, setShowGstModal] = useState(false);

  // Search & Facility
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("Bhosari Central Plant (Pune)");

  // Deal Stage Mover
  const moveDealStage = (dealId: string, nextStage: DealCard["stage"]) => {
    setDeals(prev =>
      prev.map(d => (d.id === dealId ? { ...d, stage: nextStage, daysInStage: 0 } : d))
    );
    if (selectedDealForDossier?.id === dealId) {
      setSelectedDealForDossier(prev => (prev ? { ...prev, stage: nextStage } : null));
    }
  };

  // Stock Adjustment for ERP BOM
  const adjustRawStock = (code: string, delta: number) => {
    setRawMaterials(prev =>
      prev.map(item => {
        if (item.code === code) {
          const updated = Math.max(0, item.stock + delta);
          return {
            ...item,
            stock: updated,
            status: updated <= item.minThreshold ? "Reorder Required" : "Sufficient"
          };
        }
        return item;
      })
    );
  };

  // Stage Definitions for CRM Kanban
  const STAGES = [
    { key: "inquiry", label: "1. Inbound Inquiries", color: "border-slate-500", bg: "bg-slate-500/10" },
    { key: "tech_eval", label: "2. Technical Spec Review", color: "border-blue-500", bg: "bg-blue-500/10" },
    { key: "quotation", label: "3. Formal Quotation Sent", color: "border-indigo-500", bg: "bg-indigo-500/10" },
    { key: "negotiation", label: "4. Tender / PO Negotiation", color: "border-amber-500", bg: "bg-amber-500/10" },
    { key: "won", label: "5. Won & Sent to Factory ERP", color: "border-emerald-500", bg: "bg-emerald-500/10" }
  ] as const;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. MASTER ENTERPRISE HEADER WITH DUAL-SUITE SWITCHER */}
      {/* ========================================================================= */}
      <header className="bg-[#0b1220] border-b border-slate-800/90 sticky top-0 z-40 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Left: Brand & Plant Indicator */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <span className="text-lg">A</span>
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm tracking-wider flex items-center gap-1.5">
                AMPHENOL
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-mono border border-blue-400/30">
                  INDIA
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Pune Interconnect Central Hub</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Bhosari &amp; Chakan Operations</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-400">AWS VPC Mumbai • 2FA Active</span>
          </div>
        </div>

        {/* Center: THE DUAL SUITE SWITCHER (GOLD STANDARD) */}
        <div className="bg-slate-950/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1 shadow-inner">
          <button
            onClick={() => setSuiteMode("crm")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              suiteMode === "crm"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>1. B2B Sales CRM Suite</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-400/20 text-blue-200 font-mono">
              ₹4.82 Cr
            </span>
          </button>

          <button
            onClick={() => setSuiteMode("erp")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              suiteMode === "erp"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>2. Factory Operations ERP Suite</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-400/20 text-indigo-200 font-mono">
              15k SKUs
            </span>
          </button>
        </div>

        {/* Right: User Profile & Storefront Return */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-right text-xs">
            <div>
              <div className="font-semibold text-slate-200">R. Deshmukh</div>
              <div className="text-[10px] text-slate-400">
                {suiteMode === "crm" ? "VP - B2B Defense Commercial" : "Plant Operations Director"}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-300">
              RD
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
          >
            <span>← Storefront</span>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUITE WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-[1920px] w-full mx-auto space-y-6">
        {/* ======================================================================= */}
        {/* A. SUITE 1: B2B SALES CRM (SALESFORCE / HUBSPOT STYLE) */}
        {/* ======================================================================= */}
        {suiteMode === "crm" && (
          <div className="space-y-6">
            {/* CRM Sub-Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0c1322] p-4 rounded-xl border border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-400/30">
                    SUITE 1: SALES CRM
                  </span>
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    B2B Tender &amp; RFQ Deal Pipeline
                  </h1>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Drag and move defense &amp; EV deals through sales milestones. Click any deal to inspect customer dossier.
                </p>
              </div>

              {/* View Switcher: Kanban vs Table + Action */}
              <div className="flex items-center gap-3">
                <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setCrmView("kanban")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                      crmView === "kanban" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Kanban className="w-3.5 h-3.5" />
                    <span>Visual Kanban</span>
                  </button>
                  <button
                    onClick={() => setCrmView("table")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                      crmView === "table" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Table View</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setQuoteTargetDeal(deals[0]);
                    setShowProposalModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Build Commercial Proposal</span>
                </button>
              </div>
            </div>

            {/* 4 CRM KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Active Deal Pipeline
                </span>
                <div className="text-2xl font-bold text-white mt-1">₹4,82,50,000</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <span>↑ +32.4%</span>
                  <span className="text-slate-400">DRDO &amp; HAL defense surges</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Tender Win Ratio
                </span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">78.4% Win Rate</div>
                <div className="text-[11px] text-slate-400 mt-1">Highest on MIL-DTL-38999 Series III</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Average Deal Cycle
                </span>
                <div className="text-2xl font-bold text-indigo-400 mt-1">4.2 Days</div>
                <div className="text-[11px] text-slate-400 mt-1">Industry defense average: 18 days</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Strategic Key Accounts
                </span>
                <div className="text-2xl font-bold text-blue-400 mt-1">38 Enterprise Accounts</div>
                <div className="text-[11px] text-slate-400 mt-1">DRDO, HAL, Tata Motors, BEL, Mazagon</div>
              </div>
            </div>

            {/* CRM VIEW 1: VISUAL KANBAN BOARD */}
            {crmView === "kanban" && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
                {STAGES.map(col => {
                  const colDeals = deals.filter(d => d.stage === col.key);
                  const colTotal = colDeals.reduce((acc, curr) => acc + curr.valueNumeric, 0);

                  return (
                    <div
                      key={col.key}
                      className="bg-[#0b111e] rounded-xl border border-slate-800 flex flex-col min-w-[280px]"
                    >
                      {/* Column Header */}
                      <div className={`p-3 border-b border-slate-800/80 ${col.bg} rounded-t-xl`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200 tracking-wide">{col.label}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-mono font-bold">
                            {colDeals.length}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-1">
                          Vol: ₹{(colTotal / 100000).toFixed(1)} Lakhs
                        </div>
                      </div>

                      {/* Cards Container */}
                      <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[600px]">
                        {colDeals.length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-600 border border-dashed border-slate-800/80 rounded-lg">
                            No deals in this stage
                          </div>
                        ) : (
                          colDeals.map(deal => (
                            <div
                              key={deal.id}
                              onClick={() => setSelectedDealForDossier(deal)}
                              className="p-3.5 rounded-lg bg-[#0f172a] border border-slate-800 hover:border-blue-500/80 cursor-pointer transition-all shadow-sm space-y-2.5 hover:shadow-md group"
                            >
                              <div className="flex items-start justify-between">
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  {deal.id}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                  {deal.sector}
                                </span>
                              </div>

                              <div>
                                <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                                  {deal.company}
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                                  {deal.project}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                                <span className="font-mono font-bold text-emerald-400">{deal.value}</span>
                                <span className="text-[10px] text-slate-400">{deal.daysInStage}d in stage</span>
                              </div>

                              {/* Stage Mover Action Buttons */}
                              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60">
                                <span>KAM: {deal.accountManager.split(" ")[0]}</span>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    const stageOrder = ["inquiry", "tech_eval", "quotation", "negotiation", "won"] as const;
                                    const currentIdx = stageOrder.indexOf(deal.stage);
                                    if (currentIdx < stageOrder.length - 1) {
                                      moveDealStage(deal.id, stageOrder[currentIdx + 1]);
                                    }
                                  }}
                                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5 hover:underline"
                                >
                                  <span>Advance Stage</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CRM VIEW 2: TABLE VIEW */}
            {crmView === "table" && (
              <div className="rounded-xl bg-[#0c1322] border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Deal ID &amp; Customer</th>
                        <th className="py-3 px-4">Contact Officer</th>
                        <th className="py-3 px-4">Sector</th>
                        <th className="py-3 px-4">Connector Solution</th>
                        <th className="py-3 px-4">Commercial Value</th>
                        <th className="py-3 px-4">Current Milestone</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {deals.map(deal => (
                        <tr key={deal.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-mono text-blue-400 font-bold">{deal.id}</div>
                            <div className="font-semibold text-white">{deal.company}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <div>{deal.contactName}</div>
                            <div className="text-[10px] text-slate-400">{deal.contactTitle}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                              {deal.sector}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{deal.parts}</td>
                          <td className="py-3 px-4 font-mono font-bold text-white text-sm">{deal.value}</td>
                          <td className="py-3 px-4">
                            <select
                              value={deal.stage}
                              onChange={e => moveDealStage(deal.id, e.target.value as DealCard["stage"])}
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-blue-300 font-medium focus:outline-none"
                            >
                              <option value="inquiry">1. Inbound Inquiry</option>
                              <option value="tech_eval">2. Technical Review</option>
                              <option value="quotation">3. Formal Quotation</option>
                              <option value="negotiation">4. Negotiation</option>
                              <option value="won">5. Won &amp; Factory</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedDealForDossier(deal)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-medium border border-slate-700"
                            >
                              View Dossier
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* B. SUITE 2: FACTORY OPERATIONS ERP (SAP B1 / ODOO STYLE) */}
        {/* ======================================================================= */}
        {suiteMode === "erp" && (
          <div className="space-y-6">
            {/* ERP Sub-Header Bar & Module Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0c1322] p-4 rounded-xl border border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-400/30">
                    SUITE 2: FACTORY ERP
                  </span>
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Pune Factory Manufacturing, BOM &amp; Quality Operations
                  </h1>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Manage raw materials, CNC machining bays, MIL-STD testing reports, and defense courier gate passes.
                </p>
              </div>

              {/* ERP Module Sub-Tab Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setErpTab("bom")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    erpTab === "bom" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>BOM &amp; Raw Materials</span>
                </button>

                <button
                  onClick={() => setErpTab("workorders")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    erpTab === "workorders" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Assembly Work Orders</span>
                </button>

                <button
                  onClick={() => setErpTab("qc")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    erpTab === "qc" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Microscope className="w-3.5 h-3.5" />
                  <span>MIL-STD QA Lab</span>
                </button>

                <button
                  onClick={() => setErpTab("logistics")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    erpTab === "logistics" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>BlueDart Gate Pass</span>
                </button>

                <button
                  onClick={() => setErpTab("gst")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    erpTab === "gst" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>GST Billing Ledger</span>
                </button>
              </div>
            </div>

            {/* ERP TAB 1: BOM & RAW MATERIALS */}
            {erpTab === "bom" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Direct factory procurement ledger: Beryllium Copper, Aerospace Aluminum, and Gold Plating Salts.
                  </span>
                  <span className="font-mono text-indigo-400">ERP Sync Status: 100% Calibrated</span>
                </div>

                <div className="rounded-xl bg-[#0c1322] border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-4">Material Code &amp; Name</th>
                          <th className="py-3 px-4">BOM Category</th>
                          <th className="py-3 px-4">Current Stock</th>
                          <th className="py-3 px-4">Safety Buffer</th>
                          <th className="py-3 px-4">Certified Supplier</th>
                          <th className="py-3 px-4">Stock Status</th>
                          <th className="py-3 px-4 text-right">Interactive Factory Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {rawMaterials.map(mat => (
                          <tr key={mat.code} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-mono text-indigo-400 font-bold">{mat.code}</div>
                              <div className="font-medium text-slate-100">{mat.name}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                                {mat.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                              {mat.stock} {mat.unit}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-400 text-xs">
                              {mat.minThreshold} {mat.unit}
                            </td>
                            <td className="py-3 px-4 text-slate-300 text-xs">{mat.supplier}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  mat.status === "Sufficient"
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                    : "bg-red-500/20 text-red-300 border-red-500/30"
                                }`}
                              >
                                {mat.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1.5">
                              <button
                                onClick={() => adjustRawStock(mat.code, 100)}
                                className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-mono text-[11px] border border-emerald-500/30"
                                title="Add stock shipment into warehouse"
                              >
                                +100 IN
                              </button>
                              <button
                                onClick={() => adjustRawStock(mat.code, -100)}
                                className="px-2 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 font-mono text-[11px] border border-red-500/30"
                                title="Deduct stock issued to shop floor"
                              >
                                -100 OUT
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

            {/* ERP TAB 2: ASSEMBLY WORK ORDERS */}
            {erpTab === "workorders" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workOrders.map(wo => (
                  <div key={wo.orderId} className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-4">
                    <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-indigo-400 font-bold">{wo.orderId}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {wo.batchCode}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{wo.client}</h4>
                        <p className="text-xs text-slate-300">{wo.product}</p>
                      </div>

                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {wo.line}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Assembly Progress:</span>
                        <span className="font-mono font-bold text-white">
                          {wo.completedQty} / {wo.targetQty} Units ({Math.round((wo.completedQty / wo.targetQty) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
                          style={{ width: `${(wo.completedQty / wo.targetQty) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Operator: {wo.leadOperator}</span>
                      <span className="text-emerald-400 font-semibold">Delivery Target: In {wo.dueDays} Days</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ERP TAB 3: MIL-STD QA TESTING LAB */}
            {erpTab === "qc" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 via-slate-900 to-indigo-900/20 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Amphenol Pune Defense Metrology &amp; QA Testing Laboratory
                      </h3>
                      <p className="text-xs text-slate-400">
                        Certified under AS9100D, ISO 9001:2015, and Indian Ministry of Defence QPL.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                    CALIBRATION VALID
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {qcTests.map(test => (
                    <div key={test.testId} className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-400">{test.testId}</span>
                          <h4 className="text-sm font-bold text-white mt-0.5">{test.testName}</h4>
                          <span className="text-[10px] font-mono text-indigo-300">{test.milStandard}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            test.status === "PASS"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {test.status}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1 font-mono">
                        <div className="flex justify-between text-slate-400">
                          <span>Specification:</span>
                          <span className="text-slate-200">{test.specThreshold}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Actual Measured:</span>
                          <span className="text-emerald-400 font-bold">{test.actualMeasured}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Batch Tested:</span>
                          <span className="text-slate-300">{test.testedBatch}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 flex justify-between">
                        <span>Inspector: {test.certifiedBy}</span>
                        <span>{test.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ERP TAB 4: BLUEDART LOGISTICS & GATE PASS */}
            {erpTab === "logistics" && (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-[#0c1322] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        BlueDart Defense Air Express &amp; Plant Security Gate Pass
                      </h3>
                      <p className="text-xs text-slate-400">
                        Authorized military logistics for high-priority shipments to HAL, DRDO, and Indian Navy bases.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-mono text-xs border border-blue-500/30">
                      BlueDart EDI Connected
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-white text-sm">
                          GATE PASS #GP-2026-0914 • Hindustan Aeronautics Ltd (HAL)
                        </div>
                        <span className="text-emerald-400 font-mono font-bold">DISPATCHED</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-slate-400">
                        <div>Carrier: BlueDart Defense Aviation</div>
                        <div>AWB: <span className="text-blue-400 font-mono">BD-DEF-991204-IN</span></div>
                        <div>PO Ref: HAL/AVN/2026/8912</div>
                        <div>Destination: HAL Nashik Division</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-white text-sm">
                          GATE PASS #GP-2026-0915 • DRDO - ASL Hyderabad
                        </div>
                        <span className="text-amber-400 font-mono font-bold">IN PACKING</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-slate-400">
                        <div>Carrier: Govt Escorted Freight</div>
                        <div>AWB: <span className="text-blue-400 font-mono">GEF-HYD-00412</span></div>
                        <div>PO Ref: DRDO/ASL/PO-7712</div>
                        <div>Destination: ASL Kanchanbagh Hyderabad</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ERP TAB 5: GST BILLING & INVOICES */}
            {erpTab === "gst" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Domestic GST Tax Invoice &amp; E-Way Bill Ledger</h3>
                    <p className="text-xs text-slate-400">Automated 18% GST split (9% CGST + 9% SGST / 18% IGST).</p>
                  </div>
                  <button
                    onClick={() => setShowGstModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Tax Invoice</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                    <span className="text-xs text-slate-400 uppercase">FY 2026-27 Domestic Billed</span>
                    <div className="text-2xl font-bold text-white mt-1">₹14,28,40,000</div>
                    <div className="text-[11px] text-emerald-400 mt-1">GSTR-1 Reconciled</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                    <span className="text-xs text-slate-400 uppercase">GST Collected (18%)</span>
                    <div className="text-2xl font-bold text-indigo-400 mt-1">₹2,57,11,200</div>
                    <div className="text-[11px] text-slate-400 mt-1">CGST: ₹1.28 Cr | SGST: ₹1.28 Cr</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0c1322] border border-slate-800">
                    <span className="text-xs text-slate-400 uppercase">Payment SLA</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">100% Cleared</div>
                    <div className="text-[11px] text-slate-400 mt-1">Direct NEFT/RTGS matching</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. SLIDE-OVER DRAWER: CUSTOMER 360° DOSSIER (REAL CRM STANDARD) */}
      {/* ========================================================================= */}
      {selectedDealForDossier && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-[#0c1322] border-l border-slate-800 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {selectedDealForDossier.id} • {selectedDealForDossier.sector}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedDealForDossier.company}</h3>
                  <p className="text-xs text-slate-400">{selectedDealForDossier.project}</p>
                </div>
                <button
                  onClick={() => setSelectedDealForDossier(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Commercial Summary */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Opportunity Value:</span>
                  <span className="text-base font-mono font-bold text-emerald-400">
                    {selectedDealForDossier.value}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Milestone Stage:</span>
                  <span className="capitalize font-semibold text-blue-400">
                    {selectedDealForDossier.stage.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Key Account Manager:</span>
                  <span className="text-slate-200">{selectedDealForDossier.accountManager}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Authorized Corporate Contact</span>
                </h4>
                <div className="text-slate-200 font-semibold">{selectedDealForDossier.contactName}</div>
                <div className="text-[11px] text-slate-400">{selectedDealForDossier.contactTitle}</div>
                <div className="flex items-center gap-2 text-blue-400 pt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedDealForDossier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{selectedDealForDossier.phone}</span>
                </div>
              </div>

              {/* Product Requirement */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Connector Configuration</span>
                </h4>
                <p className="text-slate-300">{selectedDealForDossier.parts}</p>
              </div>

              {/* Activity History & Meeting Notes */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>CRM Interaction Log</span>
                </h4>
                <div className="space-y-2">
                  {selectedDealForDossier.activityNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  setQuoteTargetDeal(selectedDealForDossier);
                  setShowProposalModal(true);
                }}
                className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Build Formal Proposal</span>
              </button>
              <button
                onClick={() => setSelectedDealForDossier(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: FORMAL COMMERCIAL PROPOSAL BUILDER (CPQ) */}
      {/* ========================================================================= */}
      {showProposalModal && quoteTargetDeal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c1322] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Commercial Proposal &amp; Quotation Engine (CPQ)
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowProposalModal(false);
                  setQuoteTargetDeal(null);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <div>
                  <div className="font-bold text-white text-sm">AMPHENOL INTERCONNECT INDIA PVT. LTD.</div>
                  <div className="text-slate-400 text-[11px]">Bhosari MIDC Industrial Area, Pune - 411026</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 font-bold">Proposal Ref: PROP-2026-Q3</div>
                  <div className="text-slate-400">Validity: 30 Days</div>
                </div>
              </div>

              <div>
                <span className="text-slate-400">Prepared For:</span>
                <div className="font-bold text-white text-sm">{quoteTargetDeal.company}</div>
                <div className="text-slate-300">{quoteTargetDeal.contactName} ({quoteTargetDeal.contactTitle})</div>
                <div className="text-slate-400">{quoteTargetDeal.email} • {quoteTargetDeal.phone}</div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Target Project:</span>
                  <span className="text-white font-semibold">{quoteTargetDeal.project}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Connector Configuration:</span>
                  <span className="text-blue-400">{quoteTargetDeal.parts}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Delivery Terms:</span>
                  <span>F.O.R. Destination (Bhosari Plant Dispatch)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-2">
                  <span>Total Proposed Value (Incl. 18% GST):</span>
                  <span className="text-emerald-400 text-base">{quoteTargetDeal.value}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowProposalModal(false);
                  setQuoteTargetDeal(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Formal quotation proposal generated and sent to " + quoteTargetDeal.email);
                  setShowProposalModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Formal Proposal PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: GST TAX INVOICE PREVIEW */}
      {/* ========================================================================= */}
      {showGstModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c1322] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Official GST Tax Invoice Preview (Plant ERP Tool)
                </h3>
              </div>
              <button
                onClick={() => setShowGstModal(false)}
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
                  <span className="text-slate-400">Billed To (Corporate Customer):</span>
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
                  <span>Total Payable (Inclusive of 18% GST):</span>
                  <span className="text-base">₹68,00,000.00</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowGstModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Tax Invoice PDF downloaded to local device.");
                  setShowGstModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
