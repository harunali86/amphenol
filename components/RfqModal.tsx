"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRfq } from "@/context/RfqContext";
import {
  X,
  Trash2,
  Download,
  Building2,
  FileCheck,
  CheckCircle2,
  Send,
  Printer,
  Sparkles,
  ShieldCheck,
  Check,
  Copy,
  ArrowLeft,
  ArrowRight,
  FileText,
  Mail,
  CreditCard,
} from "lucide-react";
import confetti from "canvas-confetti";

function numberToIndianWords(num: number): string {
  if (num === 0) return "Zero";
  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
    "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n: number): string => {
    let str = "";
    if (n > 9999999) return "Over One Crore";
    if (Math.floor(n / 100000) > 0) {
      str += inWords(Math.floor(n / 100000)) + "Lakh ";
      n %= 100000;
    }
    if (Math.floor(n / 1000) > 0) {
      str += inWords(Math.floor(n / 1000)) + "Thousand ";
      n %= 1000;
    }
    if (Math.floor(n / 100) > 0) {
      str += inWords(Math.floor(n / 100)) + "Hundred ";
      n %= 100;
    }
    if (n > 0) {
      if (str !== "") str += "and ";
      if (n < 20) str += a[n];
      else {
        str += b[Math.floor(n / 10)] + " ";
        if (n % 10 > 0) str += a[n % 10];
      }
    }
    return str;
  };

  return `Indian Rupees ${inWords(Math.round(num)).trim()} Only`;
}

export function RfqModal() {
  const {
    items,
    removeFromRfq,
    updateQuantity,
    clearRfq,
    totalQuantity,
    subtotal,
    isRfqOpen,
    setIsRfqOpen,
    startDirectCheckout,
  } = useRfq();

  const [companyName, setCompanyName] = useState("Bharat Aerospace Dynamics Ltd.");
  const [buyerContact, setBuyerContact] = useState("Col. V. K. Sharma (Retd.) / AGM Materials");
  const [buyerEmail, setBuyerEmail] = useState("procurement@bharat-aerodynamics.in");
  const [gstin, setGstin] = useState("27AAACA1234F1Z5");
  const [shippingPincode, setShippingPincode] = useState("411026");
  const [poReference, setPoReference] = useState("BADL/DEF-HARNESS/2026/041");
  const [isQuotationGenerated, setIsQuotationGenerated] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isRfqOpen) return null;

  // Determine GST Tax Breakdown
  // State code 27 is Maharashtra (Amphenol Pune is in MH) -> CGST 9% + SGST 9%
  // Any other state code -> IGST 18%
  const stateCode = gstin.trim().substring(0, 2);
  const isIntraState = stateCode === "27";
  const cgst = isIntraState ? Math.round(subtotal * 0.09) : 0;
  const sgst = isIntraState ? Math.round(subtotal * 0.09) : 0;
  const igst = !isIntraState ? Math.round(subtotal * 0.18) : 0;
  const totalGst = cgst + sgst + igst;
  const finalTotal = subtotal + totalGst;

  const quoteRef = "AMP/PUN/2026/RFQ-8491";
  const quoteDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const validUntilDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleGenerateQuote = () => {
    setIsQuotationGenerated(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePrint = () => {
    const printElem = document.getElementById("official-quotation-document");
    if (!printElem) {
      window.print();
      return;
    }

    // Sanitize quotation reference for filename
    const safeDocTitle = "Quotation_" + quoteRef.split("/").join("_");

    // Create an isolated hidden iframe so browser print engine renders ONLY the quotation
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-9999px";
    iframe.style.left = "-9999px";
    iframe.style.width = "210mm";
    iframe.style.height = "297mm";
    iframe.style.border = "none";
    iframe.setAttribute("title", safeDocTitle);
    document.body.appendChild(iframe);

    const priDoc = iframe.contentWindow?.document;
    if (!priDoc) {
      window.print();
      return;
    }

    // Extract all stylesheet tags from current application
    let stylesHtml = "";
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
      stylesHtml += node.outerHTML;
    });

    priDoc.open();
    priDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${safeDocTitle}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <base href="${typeof window !== 'undefined' ? window.location.origin : ''}/" />
          ${stylesHtml}
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              background: #ffffff !important;
              color: #0f172a !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: auto !important;
              overflow: visible !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
              font-size: 11px;
            }
            #official-quotation-document {
              max-width: 100% !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 10px 14px !important;
              border: none !important;
              box-shadow: none !important;
              display: block !important;
              visibility: visible !important;
              background: #ffffff !important;
            }
            .flex { display: flex !important; }
            .flex-col { flex-direction: column !important; }
            .items-center { align-items: center !important; }
            .items-start { align-items: flex-start !important; }
            .items-baseline { align-items: baseline !important; }
            .justify-between { justify-content: space-between !important; }
            .grid { display: grid !important; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .gap-2 { gap: 8px !important; }
            .gap-4 { gap: 14px !important; }
            .w-full { width: 100% !important; }
            .text-right { text-align: right !important; }
            .text-center { text-align: center !important; }
            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; }
            .font-bold { font-weight: 700 !important; }
            .font-black { font-weight: 900 !important; }
            .uppercase { text-transform: uppercase !important; }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin-top: 8px !important;
              margin-bottom: 8px !important;
            }
            th, td {
              page-break-inside: avoid !important;
              padding: 6px 8px !important;
            }
            th {
              background-color: #f1f5f9 !important;
              color: #334155 !important;
              border: 1px solid #cbd5e1 !important;
              font-size: 10px !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
            }
            td {
              border: 1px solid #e2e8f0 !important;
            }
            img {
              max-height: 36px;
              width: auto;
              object-fit: contain;
            }
            .no-print {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div id="official-quotation-document">
            ${printElem.innerHTML}
          </div>
        </body>
      </html>
    `);
    priDoc.close();

    let hasPrinted = false;
    const triggerPrint = () => {
      if (hasPrinted) return;
      hasPrinted = true;
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Iframe print error, falling back to window.print", err);
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      }
    };

    if (iframe.contentWindow) {
      iframe.contentWindow.onload = triggerPrint;
    }
    setTimeout(triggerPrint, 350);
  };

  const handleCopyQuoteSummary = () => {
    const lines = [
      `============================================================`,
      `OFFICIAL QUOTATION — AMPHENOL INTERCONNECT INDIA PVT. LTD.`,
      `Quotation Ref: ${quoteRef} | Date: ${quoteDate}`,
      `Plant: Plot 105, Bhosari Industrial Area, Pune 411026, MH, India`,
      `CIN: U31909PN1996PTC101423 | GSTIN: 27AAACA1234F1Z5`,
      `============================================================`,
      `Prepared For: ${companyName}`,
      `Buyer GSTIN: ${gstin} | Contact: ${buyerContact}`,
      `Customer PO Ref: ${poReference}`,
      `------------------------------------------------------------`,
      `ITEMIZED SCHEDULE:`,
      ...items.map(
        (it, i) =>
          `${i + 1}. MPN: ${it.product.mpn} | Qty: ${it.quantity} pcs | Unit: ₹${it.unitPrice.toLocaleString("en-IN")} | HSN: 8536.69.90 | Subtotal: ₹${(it.unitPrice * it.quantity).toLocaleString("en-IN")}`
      ),
      `------------------------------------------------------------`,
      `Taxable Subtotal: ₹${subtotal.toLocaleString("en-IN")}`,
      isIntraState
        ? `CGST (9.0%): ₹${cgst.toLocaleString("en-IN")}\nSGST (9.0%): ₹${sgst.toLocaleString("en-IN")}`
        : `IGST (18.0%): ₹${igst.toLocaleString("en-IN")}`,
      `Grand Total (INR): ₹${finalTotal.toLocaleString("en-IN")}`,
      `In Words: ${numberToIndianWords(finalTotal)}`,
      `------------------------------------------------------------`,
      `Payment: 100% Against Proforma / 30 Days Net | Basis: Ex-Works Pune`,
      `Validity: 30 Days (${validUntilDate})`,
      `Remittance: HDFC Bank Pune Industrial Branch (IFSC: HDFC0000039)`,
      `============================================================`,
    ].join("\n");

    navigator.clipboard.writeText(lines);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-fadeIn overflow-y-auto rfq-modal-backdrop">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-sm border border-blue-900/40 bg-white shadow-2xl overflow-hidden my-auto rfq-modal-window">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#001D3D] text-white px-3 sm:px-6 py-3 sm:py-3.5 no-print">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xs bg-blue-600/40 border border-blue-400/40 text-amber-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                <span>{isQuotationGenerated ? "Official Corporate GST Quotation" : "B2B RFQ Basket & Order Schedule"}</span>
                {isQuotationGenerated && (
                  <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-2 py-0.2 rounded-2xs">
                    Ready to Print
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-300">
                Amphenol Interconnect India Logistics Hub • Pune Bhosari Plant
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRfqOpen(false)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-slate-50 rfq-modal-body">
          {items.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-white border border-slate-200 rounded-xs p-8">
              <FileCheck className="mx-auto h-12 w-12 text-slate-300 stroke-1 mb-2" />
              <p className="text-base font-bold text-slate-800">
                Your RFQ basket is currently empty
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Add parts from the Immediate Dispatch Inventory, Parametric Catalog, 3D Configurator, or BOM Importer.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsRfqOpen(false)}
                  className="bg-[#002855] hover:bg-[#001D3D] text-white px-4 py-2 text-xs font-bold rounded-xs cursor-pointer"
                >
                  Explore Product Inventory
                </button>
                <button
                  onClick={() => {
                    setIsRfqOpen(false);
                    startDirectCheckout();
                  }}
                  className="bg-[#002855] hover:bg-[#001D3D] text-white px-4 py-2 text-xs font-semibold rounded-xs cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                >
                  <CreditCard className="h-3.5 w-3.5 text-blue-200" />
                  <span>Direct Plant Checkout</span>
                </button>
              </div>
            </div>
          ) : !isQuotationGenerated ? (
            /* STEP 1: RFQ ITEMS TABLE & BUYER INFO EDIT */
            <div className="space-y-6">
              {/* DIRECT BUY & INSTANT CHECKOUT CLEAN B2B CALLOUT */}
              <div className="bg-slate-100 border border-slate-300 rounded-xs p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-[#002855] text-white">
                    <CreditCard className="h-4 w-4 text-blue-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#002855]">
                        Instant Direct Purchase &amp; Invoicing
                      </span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-mono font-bold px-1.5 py-0.2 rounded-2xs">
                        24h Dispatch
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Skip quotation cycle. Pay via Corporate Card, UPI, NetBanking, or Defense Net-30 PO with instant GST input tax credit.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsRfqOpen(false);
                    startDirectCheckout();
                  }}
                  className="shrink-0 w-full sm:w-auto bg-[#002855] hover:bg-[#001D3D] text-white text-xs font-semibold px-4 py-2 rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CreditCard className="h-3.5 w-3.5 text-blue-200" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-3.5 w-3.5 text-blue-300" />
                </button>
              </div>

              {/* Part Items Table */}
              <div className="bg-white border border-slate-200 shadow-xs rounded-xs overflow-hidden">
                <div className="bg-slate-100/90 px-3 sm:px-4 py-2.5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                    Scheduled Items ({items.length} Line Items • {totalQuantity} Units Total)
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Pune Central Logistics Hub
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                        <th className="py-2.5 px-4">Part Number &amp; Series</th>
                        <th className="py-2.5 px-3">HSN Code</th>
                        <th className="py-2.5 px-3">Batch Qty</th>
                        <th className="py-2.5 px-3">Plant Unit Rate</th>
                        <th className="py-2.5 px-4 text-right">Taxable Amount</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70">
                          {/* Part Details */}
                          <td className="py-3 px-4">
                            <div className="font-mono text-xs font-bold text-[#002855]">
                              {item.product.mpn}
                            </div>
                            <div className="text-[11px] text-slate-600 line-clamp-1">
                              {item.product.title}
                            </div>
                            {item.notes && (
                              <div className="text-[10px] text-amber-700 font-medium">
                                Note: {item.notes}
                              </div>
                            )}
                          </td>

                          {/* HSN */}
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                            8536.69.90
                          </td>

                          {/* Quantity */}
                          <td className="py-3 px-3">
                            <div className="inline-flex items-center border border-slate-300 bg-white rounded-2xs overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(item.product.moq || 1, item.quantity - (item.product.moq || 1)))}
                                className="px-2 py-0.5 text-slate-500 hover:bg-slate-100 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 font-mono font-bold text-xs text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + (item.product.moq || 1))}
                                className="px-2 py-0.5 text-slate-500 hover:bg-slate-100 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Unit Rate */}
                          <td className="py-3 px-3 font-mono text-xs text-slate-800">
                            ₹{item.unitPrice.toLocaleString("en-IN")}
                          </td>

                          {/* Subtotal */}
                          <td className="py-3 px-4 text-right font-mono font-bold text-sm text-slate-900">
                            ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                          </td>

                          {/* Remove */}
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => removeFromRfq(item.id)}
                              title="Remove item"
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Buyer Billing & Tax Info Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-slate-200 p-4 rounded-xs shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Building2 className="h-4 w-4 text-[#002855]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Buyer Corporate Billing Particulars
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Company Name / Legal Entity
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full border border-slate-300 px-2.5 py-1.5 rounded-xs font-medium text-slate-900 focus:border-[#002855] focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                          Buyer GSTIN
                        </label>
                        <input
                          type="text"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase())}
                          className="w-full border border-slate-300 px-2.5 py-1.5 rounded-xs font-mono font-bold text-slate-900 focus:border-[#002855] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                          Delivery Pincode
                        </label>
                        <input
                          type="text"
                          value={shippingPincode}
                          onChange={(e) => setShippingPincode(e.target.value)}
                          className="w-full border border-slate-300 px-2.5 py-1.5 rounded-xs font-mono text-slate-900 focus:border-[#002855] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                          Contact / Designation
                        </label>
                        <input
                          type="text"
                          value={buyerContact}
                          onChange={(e) => setBuyerContact(e.target.value)}
                          className="w-full border border-slate-300 px-2.5 py-1.5 rounded-xs text-slate-900 focus:border-[#002855] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                          Internal PO Reference
                        </label>
                        <input
                          type="text"
                          value={poReference}
                          onChange={(e) => setPoReference(e.target.value)}
                          className="w-full border border-slate-300 px-2.5 py-1.5 rounded-xs font-mono text-slate-900 focus:border-[#002855] focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Assessment Summary */}
                <div className="bg-white border border-slate-200 p-4 rounded-xs shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Indian GST Calculation &amp; Commercial Summary
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-2xs">
                      100% Domestic ITC
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Assessable Value (Subtotal):</span>
                      <strong className="font-mono text-slate-900">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    {isIntraState ? (
                      <>
                        <div className="flex justify-between text-slate-600">
                          <span>Central GST (CGST @ 9.0%):</span>
                          <span className="font-mono text-slate-900">₹{cgst.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>State GST (SGST @ 9.0% - Maharashtra):</span>
                          <span className="font-mono text-slate-900">₹{sgst.toLocaleString("en-IN")}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between text-slate-600">
                        <span>Integrated GST (IGST @ 18.0%):</span>
                        <span className="font-mono text-slate-900">₹{igst.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline text-slate-900">
                      <div>
                        <span className="text-sm font-black text-[#002855]">Grand Total (Payable):</span>
                        <span className="block text-[10px] text-slate-500 font-normal">
                          Includes 18% GST • Ex-Works Pune
                        </span>
                      </div>
                      <span className="font-mono text-xl font-black text-[#002855]">
                        ₹{finalTotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 border border-slate-200 rounded-2xs text-[11px] text-slate-600 font-mono">
                      {numberToIndianWords(finalTotal)}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateQuote}
                    className="w-full bg-[#002855] hover:bg-[#001D3D] text-white text-xs font-bold py-2.5 rounded-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <FileCheck className="h-4 w-4 text-emerald-400" />
                    <span>Generate Official Corporate GST Quotation</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: OFFICIAL CORPORATE QUOTATION DOCUMENT (PRINT-READY) */
            <div className="space-y-4">
              {/* Action Bar Above Document (Hidden on Print) */}
              <div className="bg-blue-900/10 border border-blue-400/30 p-3 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">
                    Official Quotation Ref: <strong className="font-mono text-[#002855]">{quoteRef}</strong> (Valid for 30 Days)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyQuoteSummary}
                    className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-3 py-1.5 text-xs font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedText ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold rounded-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print / Save PDF (A4)</span>
                  </button>
                </div>
              </div>

              {/* The Actual Corporate Printable Document */}
              <div
                id="official-quotation-document"
                className="bg-white p-4 sm:p-6 md:p-10 border border-slate-300 shadow-md text-slate-900 font-sans space-y-5 sm:space-y-6 max-w-4xl mx-auto"
              >
                {/* 1. Official Letterhead */}
                <div className="border-b-2 border-[#002855] pb-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="relative w-36 h-8">
                          <Image
                            src="/images/amphenol-rf-site.svg"
                            alt="Amphenol Interconnect"
                            fill
                            className="object-contain object-left"
                          />
                        </div>
                      </div>
                      <h1 className="text-sm font-black uppercase tracking-wider text-[#002855]">
                        Amphenol Interconnect India Pvt. Ltd.
                      </h1>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        Plot No. 105, Bhosari Industrial Area, Pune – 411 026, Maharashtra, India
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">
                        CIN: U31909PN1996PTC101423 • GSTIN: 27AAACA1234F1Z5 • PAN: AAACA1234F
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Tel: +91 20 2712 0363 • Email: sales.pune@amphenol-in.com • Web: www.amphenol-in.com
                      </p>
                    </div>

                    <div className="text-right sm:self-start bg-slate-50 border border-slate-200 p-3 rounded-xs min-w-[200px]">
                      <span className="inline-block bg-[#002855] text-white text-[10px] font-mono font-black uppercase px-2 py-0.5 mb-1.5">
                        FORMAL B2B TAX QUOTATION
                      </span>
                      <div className="font-mono text-xs font-black text-slate-900">
                        {quoteRef}
                      </div>
                      <div className="text-[10px] text-slate-600 mt-0.5">
                        <strong>Date:</strong> {quoteDate}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        <strong>Valid Till:</strong> {validUntilDate}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold mt-1">
                        Dispatch: Ships in 24 Hrs
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Customer & Dispatch Particulars */}
                <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-3.5 bg-slate-50/70 rounded-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Billed &amp; Consigned To:
                    </span>
                    <strong className="text-slate-900 font-bold text-sm block">
                      {companyName}
                    </strong>
                    <div className="text-slate-700 mt-0.5">
                      <strong>GSTIN:</strong> <span className="font-mono font-bold">{gstin}</span>
                    </div>
                    <div className="text-slate-600">
                      <strong>Attn:</strong> {buyerContact}
                    </div>
                    <div className="text-slate-600 font-mono text-[11px]">
                      Email: {buyerEmail}
                    </div>
                    <div className="text-slate-600">
                      <strong>Delivery Destination:</strong> Pincode {shippingPincode} (India)
                    </div>
                  </div>

                  <div className="border-l border-slate-200 pl-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Commercial Terms &amp; Conditions:
                    </span>
                    <div>
                      <strong>Customer PO Ref:</strong> <span className="font-mono">{poReference}</span>
                    </div>
                    <div>
                      <strong>Price Basis:</strong> Ex-Works Bhosari Central Logistics Hub
                    </div>
                    <div>
                      <strong>Payment Terms:</strong> 100% against Proforma / Net 30 Days
                    </div>
                    <div>
                      <strong>Inspection &amp; Test:</strong> AS9100D &amp; MIL-STD-790 Certificate of Conformance (CoC) included
                    </div>
                    <div>
                      <strong>Freight / Transit:</strong> Extra at actuals via BlueDart / SafeExpress
                    </div>
                  </div>
                </div>

                {/* 3. Itemized Products Schedule Table */}
                <div>
                  <table className="w-full text-left text-xs border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 text-[10px] font-bold uppercase">
                        <th className="py-2 px-2.5 text-center border-r border-slate-300 w-8">#</th>
                        <th className="py-2 px-3 border-r border-slate-300">Military / Factory Part Number (MPN)</th>
                        <th className="py-2 px-3 border-r border-slate-300">Technical Description &amp; Series</th>
                        <th className="py-2 px-2.5 text-center border-r border-slate-300">HSN Code</th>
                        <th className="py-2 px-2.5 text-center border-r border-slate-300">Qty</th>
                        <th className="py-2 px-3 text-right border-r border-slate-300">Rate (INR)</th>
                        <th className="py-2 px-3 text-right">Taxable Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-2.5 text-center font-mono text-slate-500 border-r border-slate-200">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-200">
                            <span className="font-mono font-bold text-[#002855] text-xs block">
                              {it.product.mpn}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {it.product.series} • Shell {it.product.shellSize || "Standard"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-slate-700 text-[11px]">
                            <div>{it.product.title}</div>
                            <div className="text-[10px] text-slate-500">
                              {it.product.pinCount} Contacts • {it.product.currentRating} • {it.product.shellPlating}
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono text-[11px] text-slate-600 border-r border-slate-200">
                            8536.69.90
                          </td>
                          <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                            {it.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-800 border-r border-slate-200">
                            ₹{it.unitPrice.toLocaleString("en-IN")}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{(it.unitPrice * it.quantity).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 4. Tax Assessment & In-Words Particulars */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                  <div className="md:col-span-7 space-y-3">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xs text-xs space-y-1.5">
                      <strong className="text-[10px] uppercase font-bold text-slate-500 block">
                        Tax Invoice &amp; Statutory Declarations:
                      </strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        1. All goods supplied under this quotation are manufactured under AS9100D Rev D and MIL-STD-790 quality standards at Bhosari, Pune.
                      </p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        2. Certified that the particulars given above are true and correct, and the amount indicated represents the price actually charged.
                      </p>
                      <p className="text-[11px] text-emerald-700 font-bold">
                        3. 100% Domestic Input Tax Credit (ITC) available to buyer under Section 16 of CGST Act.
                      </p>
                    </div>

                    <div className="border border-slate-200 p-3 rounded-xs text-xs">
                      <strong className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                        Bank Remittance Details (for RTGS / NEFT / IMPS):
                      </strong>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700">
                        <div><strong>Account Name:</strong> Amphenol Interconnect India</div>
                        <div><strong>Bank:</strong> HDFC Bank Ltd.</div>
                        <div><strong>Account No:</strong> 00390310004812 (Current)</div>
                        <div><strong>IFSC Code:</strong> HDFC0000039 (Industrial Pune)</div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    <div className="border border-slate-300 bg-slate-50 p-4 rounded-xs text-xs space-y-2 font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>Taxable Value:</span>
                        <strong className="text-slate-900">₹{subtotal.toLocaleString("en-IN")}</strong>
                      </div>

                      {isIntraState ? (
                        <>
                          <div className="flex justify-between text-slate-600">
                            <span>CGST @ 9.0%:</span>
                            <span className="text-slate-900">₹{cgst.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>SGST @ 9.0%:</span>
                            <span className="text-slate-900">₹{sgst.toLocaleString("en-IN")}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between text-slate-600">
                          <span>IGST @ 18.0%:</span>
                          <span className="text-slate-900">₹{igst.toLocaleString("en-IN")}</span>
                        </div>
                      )}

                      <div className="border-t-2 border-slate-300 pt-2 flex justify-between items-baseline text-slate-900">
                        <span className="font-bold text-sm text-[#002855]">Total Invoice (INR):</span>
                        <span className="text-lg font-black text-[#002855]">
                          ₹{finalTotal.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="border-t border-slate-200 pt-1.5 text-[10px] text-slate-600 font-sans italic">
                        Amount in Words: <br />
                        <strong className="text-slate-900 font-semibold">{numberToIndianWords(finalTotal)}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Signatory & Official Factory Stamp */}
                <div className="border-t border-slate-300 pt-5 flex justify-between items-end text-xs">
                  <div>
                    <div className="inline-block border-2 border-dashed border-blue-600/40 p-2.5 rounded-xs text-center bg-blue-50/40">
                      <div className="font-mono text-[9px] font-bold text-blue-800 uppercase tracking-wider">
                        AS9100D &amp; MIL-STD-790 CERTIFIED
                      </div>
                      <div className="text-[10px] font-bold text-slate-800">
                        Pune Central Quality Assurance Cell
                      </div>
                      <div className="text-[9px] text-slate-500">
                        Amphenol Interconnect India Pvt. Ltd.
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-800 uppercase text-[11px]">
                      For Amphenol Interconnect India Pvt. Ltd.
                    </div>
                    <div className="h-10 flex items-center justify-end">
                      <span className="font-serif italic text-blue-900 text-sm font-semibold tracking-wide">
                        K. Ramachandran
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-900">
                      Authorized Commercial Signatory
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Factory Operations &amp; Logistics Hub, Pune
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="border-t border-slate-200 bg-slate-100 px-6 py-3.5 flex items-center justify-between no-print">
          <button
            onClick={() => {
              if (isQuotationGenerated) setIsQuotationGenerated(false);
              else clearRfq();
            }}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
          >
            {isQuotationGenerated ? (
              <>
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Edit Items</span>
              </>
            ) : (
              <span>Clear Entire RFQ</span>
            )}
          </button>

          <div className="flex items-center gap-3">
            {isQuotationGenerated ? (
              <button
                onClick={handlePrint}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-xs font-bold rounded-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Printer className="h-4 w-4" />
                <span>Print Official Quotation / Save PDF (A4)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsRfqOpen(false);
                    startDirectCheckout();
                  }}
                  disabled={items.length === 0}
                  className="bg-[#002855] hover:bg-[#001D3D] disabled:opacity-50 text-white px-5 py-2 text-xs font-semibold rounded-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <CreditCard className="h-3.5 w-3.5 text-blue-200" />
                  <span>Proceed to Checkout</span>
                </button>

                <button
                  onClick={handleGenerateQuote}
                  disabled={items.length === 0}
                  className="bg-[#002855] hover:bg-[#001D3D] disabled:opacity-50 text-white px-5 py-2 text-xs font-bold rounded-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <FileCheck className="h-4 w-4 text-emerald-400" />
                  <span>Formal GST Quotation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
