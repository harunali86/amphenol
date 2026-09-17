"use client";

import React, { useState } from "react";
import { useRfq } from "@/context/RfqContext";
import {
  ShieldCheck,
  X,
  Package,
  Boxes,
  Receipt,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Search,
  Server,
  Database,
  Lock,
  Download,
  Check,
  RefreshCw,
} from "lucide-react";

type AdminRole = "admin" | "orders" | "inventory" | "accounts" | "crm";

interface OrderItem {
  id: string;
  client: string;
  segment: "Defense" | "EV Powertrain" | "Aerospace" | "Naval";
  items: string;
  value: number;
  status: "Processing" | "Quality Inspection" | "Dispatched" | "Delivered";
  courier: string;
  tracking: string;
  date: string;
}

interface LeadItem {
  id: string;
  company: string;
  gstin: string;
  contact: string;
  project: string;
  estimatedValue: number;
  stage: "New Inquiry" | "Technical Review" | "Formal Quotation" | "PO Awaited";
  timestamp: string;
}

export function AdminCrmModal() {
  const { isAdminOpen, setIsAdminOpen, triggerCrmToast } = useRfq();
  const [activeRole, setActiveRole] = useState<AdminRole>("crm");
  const [syncedCatalog, setSyncedCatalog] = useState(false);

  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: "AMP-ORD-2026-9841",
      client: "DRDO RCI Hyderabad",
      segment: "Defense",
      items: "D38999/26WF35PN (150 Units) + Backshells",
      value: 1840000,
      status: "Dispatched",
      courier: "BlueDart Defense Express",
      tracking: "BLU-IN-89210492",
      date: "Today, 10:45 AM",
    },
    {
      id: "AMP-ORD-2026-9842",
      client: "Tata Motors Passenger Electric (Pune)",
      segment: "EV Powertrain",
      items: "HVSL1000062A170 250A Battery Plugs (500 Units)",
      value: 4250000,
      status: "Quality Inspection",
      courier: "DHL Supply Chain",
      tracking: "DHL-IND-991244",
      date: "Today, 09:15 AM",
    },
    {
      id: "AMP-ORD-2026-9843",
      client: "Hindustan Aeronautics Ltd (HAL Nashik)",
      segment: "Aerospace",
      items: "TFOCA-II Tactical Fiber (80 Units)",
      value: 2980000,
      status: "Processing",
      courier: "Pending Courier Allocation",
      tracking: "PENDING",
      date: "Yesterday",
    },
    {
      id: "AMP-ORD-2026-9844",
      client: "Indian Navy Western Naval Command (Mumbai)",
      segment: "Naval",
      items: "M28840 Submarine Shock Connectors (60 Units)",
      value: 3420000,
      status: "Processing",
      courier: "Naval Logistics Transport",
      tracking: "NAV-LOG-5510",
      date: "Yesterday",
    },
  ]);

  const [leads, setLeads] = useState<LeadItem[]>([
    {
      id: "LEAD-2026-081",
      company: "Mahindra & Mahindra EV Powertrain",
      gstin: "27AAACM1234F1Z5",
      contact: "Dr. Vikram Joshi (VP - High Voltage R&D)",
      project: "Direct TE HVP-HD1000 substitute for 800V EV Architecture",
      estimatedValue: 6800000,
      stage: "Formal Quotation",
      timestamp: "12 mins ago",
    },
    {
      id: "LEAD-2026-082",
      company: "Bharat Electronics Ltd (BEL Bengaluru)",
      gstin: "29AAACB2948G1ZK",
      contact: "R. Narayanan (Chief Procurement Officer)",
      project: "MIL-DTL-38999 Series III Olive Drab Cadmium tender",
      estimatedValue: 4500000,
      stage: "Technical Review",
      timestamp: "45 mins ago",
    },
    {
      id: "LEAD-2026-083",
      company: "Ather Energy Pvt Ltd",
      gstin: "29AABCA9918K1ZM",
      contact: "Sandeep Rao (Lead Battery Harness Engineer)",
      project: "Compact IP67 RadSok Battery Terminal Connectors",
      estimatedValue: 2450000,
      stage: "New Inquiry",
      timestamp: "2 hours ago",
    },
    {
      id: "LEAD-2026-084",
      company: "Mazagon Dock Shipbuilders Ltd",
      gstin: "27AAACM0482P1ZQ",
      contact: "Capt. A. K. Sharma (Project 75I Subsea Systems)",
      project: "AquaWeld 3000m Subsea Immersion Connectors (300 bar)",
      estimatedValue: 9200000,
      stage: "PO Awaited",
      timestamp: "Yesterday",
    },
  ]);

  const handleUpdateOrderStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          const nextStatus: Record<string, OrderItem["status"]> = {
            Processing: "Quality Inspection",
            "Quality Inspection": "Dispatched",
            Dispatched: "Delivered",
            Delivered: "Processing",
          };
          const newStatus = nextStatus[order.status] || "Processing";
          triggerCrmToast(`Order ${id} updated to: ${newStatus}`);
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  const handleSyncCatalog = () => {
    setSyncedCatalog(true);
    triggerCrmToast("Bulk Sync: 15,000 SKUs validated & reconciled in Bhosari ledger");
    setTimeout(() => setSyncedCatalog(false), 3000);
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        onClick={() => setIsAdminOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Window */}
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-4 sm:px-6 py-3.5 sm:py-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/40">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Amphenol Enterprise Command Center
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  <Lock className="h-2.5 w-2.5" /> 2FA SECURED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Bhosari Pune Plant Central Operations • Dedicated AWS Mumbai VPC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-blue-300 hidden md:inline">
              Role: <strong className="text-white uppercase">{activeRole}</strong>
            </span>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Role Selector Navigation Bar (SOW §2.8 Roles) */}
        <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/80 px-4 sm:px-6 scrollbar-none">
          <div className="flex space-x-2 py-2.5 text-xs font-semibold">
            <button
              onClick={() => setActiveRole("crm")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all shrink-0 ${
                activeRole === "crm"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Sales CRM &amp; RFQ Pipeline
              <span className="rounded-full bg-blue-400/20 px-1.5 py-0.2 text-[10px] font-bold text-blue-200">
                ₹4.82 Cr
              </span>
            </button>

            <button
              onClick={() => setActiveRole("orders")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all shrink-0 ${
                activeRole === "orders"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Package className="h-4 w-4" />
              Order Dispatch Fulfillment
              <span className="rounded-full bg-amber-400/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                4 Active
              </span>
            </button>

            <button
              onClick={() => setActiveRole("inventory")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all shrink-0 ${
                activeRole === "inventory"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Boxes className="h-4 w-4" />
              Inventory &amp; 15k SKUs Ledger
            </button>

            <button
              onClick={() => setActiveRole("accounts")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all shrink-0 ${
                activeRole === "accounts"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Receipt className="h-4 w-4" />
              Accounts &amp; GST Invoicing
            </button>

            <button
              onClick={() => setActiveRole("admin")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all shrink-0 ${
                activeRole === "admin"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Super Admin &amp; AWS VPC
            </button>
          </div>
        </div>

        {/* Modal Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: SALES CRM & LEADS PIPELINE */}
          {activeRole === "crm" && (
            <div className="space-y-5">
              {/* CRM Key Metrics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Active RFQ Pipeline
                  </div>
                  <div className="mt-1 text-2xl font-black text-white">₹4,82,50,000</div>
                  <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="h-3 w-3" /> +32% from defense tenders
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Qualified Inbound Leads
                  </div>
                  <div className="mt-1 text-2xl font-black text-blue-400">38 Accounts</div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    HAL, DRDO, Tata, BEL, ISRO
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    AI Copilot Conversions
                  </div>
                  <div className="mt-1 text-2xl font-black text-emerald-400">64.2%</div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    Direct RFQ trigger from AI
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Avg Lead Cycle Time
                  </div>
                  <div className="mt-1 text-2xl font-black text-amber-400">4.2 Days</div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    Industry standard: 18 days
                  </div>
                </div>
              </div>

              {/* Inbound Leads Table */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Live Inbound B2B Inquiries &amp; Quotation Requests
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Auto-synchronized with Bhosari Sales Desk
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
                      <tr>
                        <th className="p-3">Lead ID &amp; Company</th>
                        <th className="p-3">Corporate Contact</th>
                        <th className="p-3">Project / Target Application</th>
                        <th className="p-3">Estimated Value</th>
                        <th className="p-3">Pipeline Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3">
                            <div className="font-mono text-[11px] text-blue-400 font-bold">
                              {lead.id}
                            </div>
                            <div className="font-semibold text-white">{lead.company}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              GST: {lead.gstin}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-slate-300 font-medium">{lead.contact}</div>
                            <div className="text-[10px] text-slate-500">{lead.timestamp}</div>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="text-slate-300 line-clamp-2">{lead.project}</div>
                          </td>
                          <td className="p-3 font-mono font-bold text-white">
                            ₹{lead.estimatedValue.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                lead.stage === "PO Awaited"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : lead.stage === "Formal Quotation"
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
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

          {/* TAB 2: ORDER FULFILLMENT & DISPATCH */}
          {activeRole === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    5-Stage Order Fulfillment Pipeline
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage direct plant dispatches for defense contractors and tier-1 OEMs
                  </p>
                </div>
                <div className="text-[11px] text-slate-400">
                  Click status to advance lifecycle step
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Client &amp; Segment</th>
                      <th className="p-3">Mil-Spec Line Items</th>
                      <th className="p-3">Invoice Value</th>
                      <th className="p-3">Courier Logistics</th>
                      <th className="p-3">Action Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-400">{o.id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{o.client}</div>
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-blue-300">
                            {o.segment}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs text-slate-300">{o.items}</td>
                        <td className="p-3 font-mono font-bold text-white">
                          ₹{o.value.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3">
                          <div className="text-slate-200 font-medium">{o.courier}</div>
                          <div className="font-mono text-[10px] text-slate-500">
                            AWB: {o.tracking}
                          </div>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id)}
                            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                              o.status === "Dispatched"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                                : o.status === "Quality Inspection"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30"
                                : "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                            }`}
                          >
                            <Truck className="h-3 w-3" />
                            {o.status} (Click)
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY & 15,000 SKUs */}
          {activeRole === "inventory" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Bhosari Central Warehouse Inventory Sync Engine
                  </h3>
                  <p className="text-xs text-slate-400">
                    15,000 Product SKUs indexed with automated low-stock threshold alerting
                  </p>
                </div>
                <button
                  onClick={handleSyncCatalog}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                >
                  <RefreshCw className={`h-4 w-4 ${syncedCatalog ? "animate-spin" : ""}`} />
                  Sync 15,000 SKUs Ledger
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs font-semibold text-slate-400">Total Active SKUs</div>
                  <div className="mt-1 text-2xl font-black text-white">15,042</div>
                  <div className="text-[11px] text-emerald-400 mt-1">100% QPL defense certified</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs font-semibold text-slate-400">Warehouse Allocation</div>
                  <div className="mt-1 text-2xl font-black text-blue-400">Pune Central: 78%</div>
                  <div className="text-[11px] text-slate-400 mt-1">Bengaluru Hub: 22%</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs font-semibold text-slate-400">Low Stock Triggers</div>
                  <div className="mt-1 text-2xl font-black text-amber-400">3 Series</div>
                  <div className="text-[11px] text-amber-400 mt-1">Hermetic Glass &amp; TFOCA Fiber</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNTS & GST */}
          {activeRole === "accounts" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="text-sm font-bold text-white">
                  Indian GST Tax Compliance &amp; HSN Ledger (Chapter 8536)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated B2B invoicing with live GSTIN verification and CGST+SGST / IGST calculation
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3">Invoice Number</th>
                      <th className="p-3">Entity &amp; State</th>
                      <th className="p-3">Taxable Value</th>
                      <th className="p-3">GST Component</th>
                      <th className="p-3">Payment Mode</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono text-blue-400 font-bold">INV-2026-0914</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">DRDO Hyderabad</div>
                        <div className="text-[10px] text-slate-400">Telangana (IGST 18%)</div>
                      </td>
                      <td className="p-3 font-mono font-bold">₹15,59,322</td>
                      <td className="p-3 font-mono text-emerald-400">₹2,80,678</td>
                      <td className="p-3">
                        <span className="rounded bg-blue-500/20 text-blue-300 px-2 py-0.5 text-[10px] font-bold">
                          RTGS Confirmed
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300 hover:bg-slate-700">
                          <Download className="h-3 w-3" /> PDF
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono text-blue-400 font-bold">INV-2026-0915</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">Tata Motors Ltd</div>
                        <div className="text-[10px] text-slate-400">Maharashtra (CGST+SGST 9%+9%)</div>
                      </td>
                      <td className="p-3 font-mono font-bold">₹36,01,694</td>
                      <td className="p-3 font-mono text-emerald-400">₹6,48,306</td>
                      <td className="p-3">
                        <span className="rounded bg-blue-500/20 text-blue-300 px-2 py-0.5 text-[10px] font-bold">
                          NEFT Verified
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300 hover:bg-slate-700">
                          <Download className="h-3 w-3" /> PDF
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SUPER ADMIN & AWS INFRASTRUCTURE */}
          {activeRole === "admin" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                    <Server className="h-4 w-4" /> AWS Fargate Cluster
                  </div>
                  <div className="text-xl font-bold text-white">Mumbai (ap-south-1)</div>
                  <div className="text-[11px] text-slate-400">
                    Auto-scaling container group • 99.99% SLO SLA
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                    <Database className="h-4 w-4" /> Multi-AZ RDS PostgreSQL
                  </div>
                  <div className="text-xl font-bold text-white">12ms Sub-Second</div>
                  <div className="text-[11px] text-slate-400">
                    5-Minute RPO • Automated Daily Snapshots
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                    <ShieldCheck className="h-4 w-4" /> AWS WAF Security Shield
                  </div>
                  <div className="text-xl font-bold text-white">0 Breaches Active</div>
                  <div className="text-[11px] text-slate-400">
                    Rate-limiting &amp; bot DDoS defense enabled
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-800 bg-slate-950 px-4 sm:px-6 py-3 text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Interactive Demo Sandbox Mode • SOW §2.8 Role-Based Access</span>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
          >
            Back to Customer Storefront
          </button>
        </div>
      </div>
    </div>
  );
}
