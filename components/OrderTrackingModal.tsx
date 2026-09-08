"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRfq } from "@/context/RfqContext";
import {
  X,
  Search,
  Truck,
  Plane,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  FileText,
  Copy,
  Check,
  Download,
  AlertCircle,
  Package,
  QrCode,
} from "lucide-react";

interface TrackingRecord {
  orderId: string;
  consignee: string;
  company: string;
  destination: string;
  gstin: string;
  awbNumber: string;
  carrier: string;
  estimatedDelivery: string;
  status: "In-Transit" | "Dispatched" | "Delivered" | "Inspection";
  stage: 1 | 2 | 3 | 4;
  grossWeight: string;
  cocNumber: string;
  items: { mpn: string; description: string; qty: number }[];
  milestones: {
    title: string;
    location: string;
    timestamp: string;
    completed: boolean;
    active: boolean;
    details: string;
  }[];
}

const MOCK_ORDERS: Record<string, TrackingRecord> = {
  "AMP-ORD-2026-9841": {
    orderId: "AMP-ORD-2026-9841",
    consignee: "Col. Rajesh Sharma (Retd.)",
    company: "Alpha Defence Electronics Ltd.",
    destination: "Peenya Industrial Area, Phase II, Bengaluru - 560100",
    gstin: "27AABCA9876C1Z4",
    awbNumber: "BLUEDART-EXP-8492041",
    carrier: "BlueDart Aviation Priority Air Express",
    estimatedDelivery: "Tomorrow by 11:30 AM (Guaranteed 24h SLA)",
    status: "In-Transit",
    stage: 3,
    grossWeight: "2.85 kg (ESD Mil-Spec Packaged)",
    cocNumber: "COC-MIL-2026-09841",
    items: [
      {
        mpn: "D38999/26WF35PN",
        description: "Tri-Start High Vibration Straight Plug, Shell 19",
        qty: 50,
      },
      {
        mpn: "62IN-56T14-19PN",
        description: "Miniature Circular Bayonet Coupling Plug, Shell 14",
        qty: 25,
      },
    ],
    milestones: [
      {
        title: "Order Authorized & GST e-Invoice Generated",
        location: "Amphenol Finance & Tax Cell, Bhosari Pune",
        timestamp: "08 Sep 2026, 09:15 AM",
        completed: true,
        active: false,
        details: "IRN: 8a4f91e0... Domestic CGST+SGST 18% Input Tax Credit recorded.",
      },
      {
        title: "AS9100D Cleanroom QA & Military Lot Clearance",
        location: "Pune Bhosari Plant • Shift 1 QA Bay 3",
        timestamp: "08 Sep 2026, 11:45 AM",
        completed: true,
        active: false,
        details: "Inspected by QC-MH-042. MIL-STD-1344 dielectric test passed 100%.",
      },
      {
        title: "Dispatched via BlueDart Aviation Express (AWB Generated)",
        location: "Pune Airport Air Cargo Terminal (PNQ Hub)",
        timestamp: "08 Sep 2026, 02:30 PM",
        completed: true,
        active: true,
        details: "Flight B737-F cargo manifest loaded. Transiting to BLR hub.",
      },
      {
        title: "Out for Final Delivery to Consignee Facility",
        location: "Bengaluru Peenya Logistics Hub (BLR-NORTH)",
        timestamp: "Expected: 09 Sep 2026, 10:00 AM",
        completed: false,
        active: false,
        details: "Dedicated defense courier escort assigned for high-reliability components.",
      },
    ],
  },
  "AMP-ORD-2026-4412": {
    orderId: "AMP-ORD-2026-4412",
    consignee: "Dr. K. S. Venkatesh",
    company: "Tata Advanced Systems Ltd. (TASL)",
    destination: "Hardware Park, Shamshabad, Hyderabad - 501218",
    gstin: "36AABCT1234F1ZP",
    awbNumber: "BLUEDART-EXP-9921408",
    carrier: "BlueDart Aviation Priority Air Express",
    estimatedDelivery: "09 Sep 2026 by 02:00 PM",
    status: "Dispatched",
    stage: 2,
    grossWeight: "4.10 kg",
    cocNumber: "COC-MIL-2026-04412",
    items: [
      {
        mpn: "HVSL1000062A170",
        description: "EV High Voltage 2-Way Powertrain Plug (250A / 1000V)",
        qty: 20,
      },
    ],
    milestones: [
      {
        title: "Order Authorized & GST e-Invoice Generated",
        location: "Bhosari Central Logistics Hub",
        timestamp: "08 Sep 2026, 08:30 AM",
        completed: true,
        active: false,
        details: "Defense Purchase Order verified against TASL master contract.",
      },
      {
        title: "AS9100D Cleanroom QA & Lot Clearance",
        location: "Pune Bhosari Plant • Shift 1 QA Bay 1",
        timestamp: "08 Sep 2026, 12:10 PM",
        completed: true,
        active: true,
        details: "High-voltage interlock loop (HVIL) insulation resistance test verified.",
      },
      {
        title: "BlueDart Air Dispatch",
        location: "Pune Airport (PNQ Hub)",
        timestamp: "Scheduled: 08 Sep 2026, 06:00 PM",
        completed: false,
        active: false,
        details: "Ready for air freight loading.",
      },
      {
        title: "Delivery to Consignee",
        location: "Hyderabad Shamshabad",
        timestamp: "Expected: 09 Sep 2026, 02:00 PM",
        completed: false,
        active: false,
        details: "Defense corridor shipment.",
      },
    ],
  },
};

export function OrderTrackingModal() {
  const { isTrackingOpen, setIsTrackingOpen, trackingOrderId, setTrackingOrderId } = useRfq();
  const [searchInput, setSearchInput] = useState(trackingOrderId || "AMP-ORD-2026-9841");
  const [copiedAwb, setCopiedAwb] = useState(false);

  if (!isTrackingOpen) return null;

  // Active record based on search or fallback default
  const activeRecord =
    MOCK_ORDERS[searchInput.trim().toUpperCase()] ||
    MOCK_ORDERS[trackingOrderId] ||
    MOCK_ORDERS["AMP-ORD-2026-9841"];

  const handleCopyAwb = () => {
    if (activeRecord) {
      navigator.clipboard.writeText(activeRecord.awbNumber);
      setCopiedAwb(true);
      setTimeout(() => setCopiedAwb(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-sm border border-blue-900/40 bg-white shadow-2xl overflow-hidden my-auto">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#00183b] text-white">
          <div className="flex items-center gap-3">
            <div className="relative w-28 h-7">
              <Image
                src="/images/amphenol-rf-site.svg"
                alt="Amphenol Interconnect"
                fill
                className="object-contain object-left"
              />
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>Pune Plant Live Dispatch &amp; Shipment Tracer</span>
                <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[10px] font-mono font-bold px-2 py-0.2 rounded-2xs">
                  REAL-TIME GPS
                </span>
              </h2>
              <p className="text-[10px] text-slate-300">
                Direct Indian Manufacturing Hub (Bhosari, Pune) • BlueDart Air Aviation Tracking
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackingOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-xs transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. AMP-ORD-2026-9841)"
                className="w-full bg-white border border-slate-300 pl-9 pr-3 py-1.5 text-xs font-mono font-bold text-slate-800 rounded-xs focus:outline-hidden focus:border-[#002855]"
              />
            </div>
            <button
              onClick={() => {
                const formatted = searchInput.trim().toUpperCase();
                setTrackingOrderId(formatted);
              }}
              className="bg-[#002855] hover:bg-[#001D3D] text-white px-3.5 py-1.5 text-xs font-semibold rounded-xs cursor-pointer shadow-xs whitespace-nowrap"
            >
              Track
            </button>
          </div>

          {/* Quick Demo Order Chips */}
          <div className="flex items-center gap-2 text-xs w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Sample Orders:
            </span>
            <button
              onClick={() => {
                setSearchInput("AMP-ORD-2026-9841");
                setTrackingOrderId("AMP-ORD-2026-9841");
              }}
              className="text-[11px] font-mono px-2 py-0.5 border border-slate-300 bg-white hover:bg-slate-50 text-[#002855] font-semibold rounded-2xs cursor-pointer"
            >
              AMP-ORD-2026-9841
            </button>
            <button
              onClick={() => {
                setSearchInput("AMP-ORD-2026-4412");
                setTrackingOrderId("AMP-ORD-2026-4412");
              }}
              className="text-[11px] font-mono px-2 py-0.5 border border-slate-300 bg-white hover:bg-slate-50 text-[#002855] font-semibold rounded-2xs cursor-pointer"
            >
              AMP-ORD-2026-4412
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50 text-slate-900 space-y-5">
          {/* MAIN STATUS OVERVIEW CARD */}
          <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-base font-black text-[#002855]">
                    {activeRecord.orderId}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-2xs uppercase">
                    {activeRecord.status}
                  </span>
                  <span className="bg-blue-50 text-[#002855] border border-blue-200 text-[10px] font-mono px-2 py-0.5 rounded-2xs">
                    Air Cargo Priority
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Consignee: <strong className="text-slate-800">{activeRecord.company}</strong> ({activeRecord.consignee})
                </div>
              </div>

              <div className="text-left md:text-right bg-slate-50 p-3 border border-slate-200 rounded-xs md:bg-transparent md:p-0 md:border-0">
                <div className="text-[11px] text-slate-500 uppercase font-semibold">
                  Guaranteed Estimated Delivery
                </div>
                <div className="text-sm font-bold text-emerald-700 flex items-center md:justify-end gap-1.5 mt-0.5">
                  <Clock className="h-4 w-4" />
                  <span>{activeRecord.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* AWB & LOGISTICS META GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
              <div className="border border-slate-200 p-2.5 rounded-xs bg-slate-50">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                  Air Waybill (AWB)
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono font-bold text-slate-900 truncate">
                    {activeRecord.awbNumber}
                  </span>
                  <button
                    onClick={handleCopyAwb}
                    className="text-slate-500 hover:text-slate-800 p-1 cursor-pointer"
                    title="Copy AWB"
                  >
                    {copiedAwb ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 p-2.5 rounded-xs bg-slate-50">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                  Carrier / Air Cargo
                </span>
                <span className="font-semibold text-slate-900 mt-1 block truncate">
                  {activeRecord.carrier}
                </span>
              </div>

              <div className="border border-slate-200 p-2.5 rounded-xs bg-slate-50">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                  Gross Weight / Pack
                </span>
                <span className="font-semibold text-slate-900 mt-1 block truncate">
                  {activeRecord.grossWeight}
                </span>
              </div>

              <div className="border border-slate-200 p-2.5 rounded-xs bg-slate-50">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                  CoC QA Certificate
                </span>
                <span className="font-mono font-bold text-slate-900 mt-1 block truncate">
                  {activeRecord.cocNumber}
                </span>
              </div>
            </div>
          </div>

          {/* 4-STAGE INTERACTIVE TRACKING TIMELINE */}
          <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#002855] mb-4 flex items-center gap-2">
              <Plane className="h-4 w-4" />
              <span>Pune Manufacturing Hub → Destination Dispatch Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {activeRecord.milestones.map((ms, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] border-2 bg-white ${
                      ms.completed
                        ? "border-emerald-600 text-emerald-600"
                        : ms.active
                        ? "border-blue-600 text-blue-600 ring-4 ring-blue-100"
                        : "border-slate-300 text-slate-300"
                    }`}
                  >
                    {ms.completed ? (
                      <Check className="h-3 w-3 text-emerald-600 stroke-3" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-300" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold ${
                          ms.active ? "text-blue-900" : ms.completed ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {ms.title}
                      </h4>
                      <span className="font-mono text-[11px] text-slate-500">{ms.timestamp}</span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{ms.location}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 border border-slate-200 p-2 rounded-xs font-mono">
                      {ms.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DISPATCHED ITEMS & DESTINATION HUB DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Scheduled Hardware Parts in Container */}
            <div className="bg-white border border-slate-300 rounded-xs p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                  <Package className="h-4 w-4" />
                  Shipment Content ({activeRecord.items.length} SKUs)
                </span>
                <span className="text-[10px] text-emerald-700 font-bold font-mono">
                  100% Tested
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {activeRecord.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-2 border border-slate-200 bg-slate-50 rounded-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono font-bold text-[#002855]">{it.mpn}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">
                        {it.description}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-800 text-right">
                      {it.qty} pcs
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Consignee & Factory Plant Verification */}
            <div className="bg-white border border-slate-300 rounded-xs p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    Delivery Destination Particulars
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">GST Verified</span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Consignee Address:</span>
                    <strong className="text-slate-900">{activeRecord.destination}</strong>
                  </div>
                  <div className="flex items-center gap-4 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Buyer GSTIN:</span>
                      <span className="font-mono font-bold text-slate-900">{activeRecord.gstin}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Origin Plant:</span>
                      <span className="font-semibold text-slate-900">Pune Bhosari Hub (Plant 2)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => alert(`Downloading Official Tax Invoice for ${activeRecord.orderId}`)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 text-xs font-semibold rounded-xs border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-600" />
                  <span>Tax Invoice PDF</span>
                </button>
                <button
                  onClick={() => alert(`Certificate of Conformance (CoC) ${activeRecord.cocNumber} Verified`)}
                  className="flex-1 bg-[#002855] hover:bg-[#001D3D] text-white py-2 text-xs font-semibold rounded-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-200" />
                  <span>QPL CoC Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="border-t border-slate-200 bg-slate-100 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Direct Plant Warranty • BlueDart Air Priority Escort Protection</span>
          </div>

          <button
            onClick={() => setIsTrackingOpen(false)}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-1.5 rounded-xs transition-colors cursor-pointer"
          >
            Close Tracer
          </button>
        </div>
      </div>
    </div>
  );
}
