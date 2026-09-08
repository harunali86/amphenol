"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRfq } from "@/context/RfqContext";
import { CATALOG_PRODUCTS, Product } from "@/data/catalog";
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  RefreshCw,
  Sparkles,
  Download,
  Building2,
  FileCheck,
  Check,
  ExternalLink,
} from "lucide-react";

interface BomRow {
  id: string;
  line: number;
  customerMpn: string;
  customerBrand: string;
  reqQty: number;
  matchedProduct: Product | null;
  matchType: "Exact Mil-Spec" | "Form-Fit-Function" | "Direct Series" | "Unmatched";
  matchConfidence: number;
}

export function BomImporter() {
  const { addToRfq, setIsRfqOpen } = useRfq();
  const [bomRows, setBomRows] = useState<BomRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // Pre-configured Defense / Aerospace Avionics BOM sample
  const loadAerospaceSample = () => {
    setIsProcessing(true);
    setFileName("DEFENSE_AVIONICS_HARNESS_BOM_REV4.xlsx");
    setTimeout(() => {
      setBomRows([
        {
          id: "bom-1",
          line: 1,
          customerMpn: "DTS26W19-35PN",
          customerBrand: "TE Connectivity",
          reqQty: 50,
          matchedProduct: CATALOG_PRODUCTS[0], // D38999/26WF35PN
          matchType: "Exact Mil-Spec",
          matchConfidence: 100,
        },
        {
          id: "bom-2",
          line: 2,
          customerMpn: "DTS20W19-35SN",
          customerBrand: "TE Connectivity",
          reqQty: 50,
          matchedProduct: CATALOG_PRODUCTS[1], // D38999/20WF35SN
          matchType: "Exact Mil-Spec",
          matchConfidence: 100,
        },
        {
          id: "bom-3",
          line: 3,
          customerMpn: "AFD56-14-19PN",
          customerBrand: "Deutsch / TE",
          reqQty: 120,
          matchedProduct: CATALOG_PRODUCTS[2], // 62IN-56T14-19PN
          matchType: "Form-Fit-Function",
          matchConfidence: 100,
        },
        {
          id: "bom-4",
          line: 4,
          customerMpn: "MS3476W16-26P",
          customerBrand: "Aero-Electric",
          reqQty: 40,
          matchedProduct: CATALOG_PRODUCTS[3], // MS3476W16-26P
          matchType: "Exact Mil-Spec",
          matchConfidence: 100,
        },
        {
          id: "bom-5",
          line: 5,
          customerMpn: "DBA70H14-15PN",
          customerBrand: "TE Connectivity",
          reqQty: 25,
          matchedProduct: CATALOG_PRODUCTS[4], // M83723/76W1415N
          matchType: "Exact Mil-Spec",
          matchConfidence: 100,
        },
        {
          id: "bom-6",
          line: 6,
          customerMpn: "MWDM2L-9SSB",
          customerBrand: "Glenair",
          reqQty: 30,
          matchedProduct: CATALOG_PRODUCTS[6], // M83513/04-A09N Micro-D
          matchType: "Direct Series",
          matchConfidence: 98,
        },
      ]);
      setIsProcessing(false);
    }, 500);
  };

  // Pre-configured EV High Voltage Subsystem BOM sample
  const loadEvSample = () => {
    setIsProcessing(true);
    setFileName("BHARAT_EV_HEAVY_BUS_BATTERY_BOM.xlsx");
    setTimeout(() => {
      setBomRows([
        {
          id: "bom-ev-1",
          line: 1,
          customerMpn: "HVP-HD1000-2P",
          customerBrand: "TE Connectivity",
          reqQty: 40,
          matchedProduct: CATALOG_PRODUCTS[5], // HVSL1000062A170
          matchType: "Form-Fit-Function",
          matchConfidence: 99,
        },
        {
          id: "bom-ev-2",
          line: 2,
          customerMpn: "Radox-8MM-300A",
          customerBrand: "Huber+Suhner",
          reqQty: 80,
          matchedProduct: CATALOG_PRODUCTS[5],
          matchType: "Direct Series",
          matchConfidence: 96,
        },
      ]);
      setIsProcessing(false);
    }, 500);
  };

  // Total value of matched BOM
  const totalBomValue = bomRows.reduce((sum, row) => {
    if (!row.matchedProduct) return sum;
    const unit = row.matchedProduct.priceTiers[0].price;
    return sum + unit * row.reqQty;
  }, 0);

  // Transfer all matched items to RFQ
  const handleTransferAllToRfq = () => {
    bomRows.forEach((row) => {
      if (row.matchedProduct) {
        addToRfq(row.matchedProduct, row.reqQty, "bom", `From BOM: ${row.customerMpn}`);
      }
    });
    setIsRfqOpen(true);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border border-slate-300 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#002855]">
                Upload Required Products List (BOM Excel / CSV)
              </h2>
              <span className="bg-[#002855] text-white px-2.5 py-0.5 text-xs font-mono font-bold tracking-wider">
                BULK RFQ &amp; CROSS-REFERENCE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Upload your Bill of Materials (BOM) spreadsheet or required components list. The engine automatically checks Pune factory stock, provides instant tier pricing, and maps competitor parts (TE Connectivity, Deutsch, Souriau, Glenair) to direct Amphenol India QPL equivalents.
            </p>
          </div>

          {/* Quick Demo Pre-Loaders */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={loadAerospaceSample}
              className="flex items-center gap-1.5 border border-blue-300 bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#002855] hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Demo: Defense Avionics List (BOM)</span>
            </button>

            <button
              onClick={loadEvSample}
              className="flex items-center gap-1.5 border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Demo: EV Powertrain List (BOM)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Drop Zone (if no BOM loaded) */}
      {bomRows.length === 0 && (
        <div
          onClick={loadAerospaceSample}
          className="group cursor-pointer border-2 border-dashed border-slate-300 bg-white p-12 text-center transition-all hover:border-[#002855] hover:bg-slate-50"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center bg-blue-50 border border-blue-200 group-hover:scale-105 transition-transform">
            <UploadCloud className="h-7 w-7 text-[#002855]" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            Drag &amp; Drop Required Products List (.xlsx / .csv)
          </h3>
          <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Click here to simulate instant upload of an enterprise aerospace/defense wiring harness spreadsheet with TE, Souriau, and Deutsch part numbers.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#002855] hover:bg-[#001D3D] text-white px-5 py-2.5 text-xs font-bold shadow-xs">
            <span>Load Defense Harness Excel Sample</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      {/* Processing Spinner */}
      {isProcessing && (
        <div className="border border-slate-300 bg-white p-12 text-center shadow-xs">
          <RefreshCw className="mx-auto h-8 w-8 text-[#002855] animate-spin" />
          <p className="mt-3 text-sm font-bold text-slate-900">
            Cross-Referencing 15,000+ Amphenol Interconnect SKUs...
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing Mil-Spec form-fit-function compatibility &amp; Pune warehouse stock levels
          </p>
        </div>
      )}

      {/* Parsed & Cross-Referenced Results Table */}
      {bomRows.length > 0 && !isProcessing && (
        <div className="space-y-4">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="border border-slate-300 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Uploaded File</span>
              <p className="font-mono text-xs font-bold text-slate-900 truncate mt-1">
                {fileName}
              </p>
            </div>

            <div className="border border-slate-300 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Match Success Rate</span>
              <p className="font-mono text-base font-black text-emerald-700 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% Compatible
              </p>
            </div>

            <div className="border border-slate-300 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Line Items</span>
              <p className="font-mono text-base font-black text-[#002855] mt-1">
                {bomRows.reduce((s, r) => s + r.reqQty, 0)} Units ({bomRows.length} SKUs)
              </p>
            </div>

            <div className="border border-slate-300 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated BOM Total</span>
              <p className="font-mono text-base font-black text-[#002855] mt-1">
                ₹{totalBomValue.toLocaleString("en-IN")} + GST
              </p>
            </div>
          </div>

          {/* Results Table */}
          <div className="border border-slate-300 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    <th className="py-3 px-3 text-center">#</th>
                    <th className="py-3 px-3">Customer Competitor Part</th>
                    <th className="py-3 px-4">Cross-Matched Amphenol Part</th>
                    <th className="py-3 px-3">Compatibility</th>
                    <th className="py-3 px-3">Req Qty</th>
                    <th className="py-3 px-3">Pune Factory Stock</th>
                    <th className="py-3 px-3">Unit Price (@ MOQ)</th>
                    <th className="py-3 px-4 text-right">Ext. Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {bomRows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      {/* Line Number */}
                      <td className="py-3 px-3 font-mono text-slate-400 text-center font-bold">
                        {row.line}
                      </td>

                      {/* Customer Competitor Part */}
                      <td className="py-3 px-3">
                        <div className="font-mono text-xs font-black text-rose-700">
                          {row.customerMpn}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          Mfr: <strong className="text-slate-700">{row.customerBrand}</strong>
                        </div>
                      </td>

                      {/* Amphenol Match with Photo */}
                      <td className="py-3 px-4">
                        {row.matchedProduct ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 shrink-0 border border-slate-200 bg-slate-50 p-1 relative">
                              <Image
                                src={row.matchedProduct.image}
                                alt={row.matchedProduct.mpn}
                                fill
                                sizes="36px"
                                className="object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-mono text-xs font-black text-[#002855] flex items-center gap-1">
                                {row.matchedProduct.mpn}
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              </div>
                              <div className="text-[11px] text-slate-600 truncate max-w-[220px]">
                                {row.matchedProduct.series}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No match</span>
                        )}
                      </td>

                      {/* Compatibility Badge */}
                      <td className="py-3 px-3">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap">
                          {row.matchType} ({row.matchConfidence}%)
                        </span>
                      </td>

                      {/* Req Qty */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {row.reqQty}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-3">
                        {row.matchedProduct && (
                          <div>
                            <span className="font-mono font-bold text-emerald-700">
                              {row.matchedProduct.stock.toLocaleString()} pcs
                            </span>
                            <div className="text-[10px] text-slate-500">Pune Hub (24h)</div>
                          </div>
                        )}
                      </td>

                      {/* Unit Price */}
                      <td className="py-3 px-3 font-mono font-bold text-[#002855]">
                        ₹{row.matchedProduct?.priceTiers[0].price.toLocaleString("en-IN")}
                      </td>

                      {/* Ext Total */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ₹{((row.matchedProduct?.priceTiers[0].price || 0) * row.reqQty).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions Bar */}
            <div className="border-t border-slate-300 bg-slate-50 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600 font-medium">
                100% verified Amphenol India replacements with MIL-SPEC QPL certification.
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBomRows([])}
                  className="border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Clear BOM
                </button>

                <button
                  onClick={handleTransferAllToRfq}
                  className="flex items-center gap-1.5 bg-[#002855] hover:bg-[#001D3D] px-5 py-2 text-xs font-bold text-white shadow-xs active:scale-98 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Transfer All Matched Parts to RFQ Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
