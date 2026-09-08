"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { useRfq } from "@/context/RfqContext";
import { CATALOG_PRODUCTS } from "@/data/catalog";
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Plane,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Download,
  Copy,
  Check,
  Sparkles,
  Clock,
  ChevronRight,
  AlertCircle,
  FileText,
  BadgeCheck,
  MapPin,
} from "lucide-react";

export function DirectCheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutProduct,
    items,
    clearRfq,
    openTracking,
  } = useRfq();

  // Active step in checkout: 1 = Shipping, 2 = Logistics, 3 = Payment, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [companyName, setCompanyName] = useState("Alpha Defence Electronics Ltd.");
  const [gstin, setGstin] = useState("27AABCA9876C1Z4");
  const [buyerName, setBuyerName] = useState("Col. Rajesh Sharma (Retd.)");
  const [buyerEmail, setBuyerEmail] = useState("r.sharma@alphadefence.in");
  const [buyerPhone, setBuyerPhone] = useState("+91 98230 45678");
  const [address, setAddress] = useState("Plot 42, Electronic City Phase II");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("560100");

  // Logistics selection
  const [shippingMethod, setShippingMethod] = useState<"air" | "surface">("air");

  // Payment method
  const [paymentMode, setPaymentMode] = useState<"upi" | "card" | "netbanking" | "po">("upi");
  const [upiId, setUpiId] = useState("rajesh.sharma@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("•••");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank (Corporate)");
  const [poNumber, setPoNumber] = useState("PO/ADE/2026/MIL-9481");

  // Simulation processing states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderId, setOrderId] = useState("AMP-ORD-2026-9841");
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Line items to checkout: either single direct product or all RFQ cart items
  const checkoutItems = useMemo(() => {
    if (checkoutProduct) {
      return [
        {
          id: `direct-${checkoutProduct.product.id}`,
          product: checkoutProduct.product,
          quantity: checkoutProduct.quantity,
          unitPrice: checkoutProduct.product.priceTiers[0].price,
          addedAt: new Date().toISOString(),
        },
      ];
    }
    if (items.length > 0) {
      return items;
    }
    // Fallback: If opened directly with empty cart, provide immediate demo product batch
    const sample = CATALOG_PRODUCTS[0];
    return [
      {
        id: `sample-${sample.id}`,
        product: sample,
        quantity: 5,
        unitPrice: sample.priceTiers[0].price,
        addedAt: new Date().toISOString(),
      },
    ];
  }, [checkoutProduct, items]);

  // Pricing calculations
  const subtotal = useMemo(() => {
    return checkoutItems.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
  }, [checkoutItems]);

  const isIntraState = state.toLowerCase().includes("maharashtra") || gstin.startsWith("27");
  const cgst = isIntraState ? Math.round(subtotal * 0.09) : 0;
  const sgst = isIntraState ? Math.round(subtotal * 0.09) : 0;
  const igst = !isIntraState ? Math.round(subtotal * 0.18) : 0;
  const gstTotal = cgst + sgst + igst;

  const shippingCost = shippingMethod === "air" ? (subtotal > 50000 ? 0 : 450) : 250;
  const grandTotal = subtotal + gstTotal + shippingCost;

  if (!isCheckoutOpen) return null;

  // Execute payment simulation
  const handleExecutePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const generatedOrd = `AMP-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(generatedOrd);
      setIsProcessingPayment(false);
      setStep(4);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#002855", "#10B981", "#F59E0B", "#38BDF8"],
        });
      } catch {
        // Fallback
      }

      // If checking out entire cart, clear it
      if (!checkoutProduct) {
        clearRfq();
      }
    }, 1200);
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col rounded-sm border border-blue-900/40 bg-white shadow-2xl overflow-hidden my-auto">
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
                <span>Direct Plant Checkout</span>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-mono font-black px-1.5 py-0.2 rounded-2xs">
                  24H DISPATCH
                </span>
              </h2>
              <p className="text-[10px] text-slate-300">
                Bhosari Logistics Hub • Instant Tax Invoice • AS9100D Certified
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-xs transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEPPER PROGRESS BAR */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold">
            <button
              onClick={() => step > 1 && setStep(1)}
              className={`flex items-center gap-1.5 cursor-pointer ${
                step === 1
                  ? "text-[#002855]"
                  : step > 1
                  ? "text-emerald-700"
                  : "text-slate-400"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 1
                    ? "bg-[#002855] text-white"
                    : step > 1
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </span>
              <span>1. Delivery &amp; GSTIN</span>
            </button>

            <ChevronRight className="h-4 w-4 text-slate-300" />

            <button
              onClick={() => step > 2 && setStep(2)}
              className={`flex items-center gap-1.5 cursor-pointer ${
                step === 2
                  ? "text-[#002855]"
                  : step > 2
                  ? "text-emerald-700"
                  : "text-slate-400"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 2
                    ? "bg-[#002855] text-white"
                    : step > 2
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {step > 2 ? "✓" : "2"}
              </span>
              <span>2. Express Logistics</span>
            </button>

            <ChevronRight className="h-4 w-4 text-slate-300" />

            <button
              onClick={() => step > 3 && setStep(3)}
              className={`flex items-center gap-1.5 cursor-pointer ${
                step === 3
                  ? "text-[#002855]"
                  : step > 3
                  ? "text-emerald-700"
                  : "text-slate-400"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 3
                    ? "bg-[#002855] text-white"
                    : step > 3
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {step > 3 ? "✓" : "3"}
              </span>
              <span>3. Payment Gateway</span>
            </button>

            <ChevronRight className="h-4 w-4 text-slate-300" />

            <div
              className={`flex items-center gap-1.5 ${
                step === 4 ? "text-emerald-700 font-bold" : "text-slate-400"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 4 ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-600"
                }`}
              >
                4
              </span>
              <span>4. Order Placed</span>
            </div>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50 text-slate-900">
          {/* ============================================================ */}
          {/* STEP 1: DELIVERY DESTINATION & GSTIN PARTICULARS */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: B2B Shipping & Tax Form */}
              <div className="md:col-span-7 space-y-4">
                <div className="bg-white p-5 border border-slate-300 rounded-xs space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-[#002855]" />
                      Corporate Invoicing &amp; Delivery Destination
                    </h3>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">
                      ✓ GST ITC Eligible
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Company / Legal Entity Name *
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs rounded-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Buyer GSTIN (15-Digit) *
                        </label>
                        <input
                          type="text"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase())}
                          placeholder="27AABCA9876C1Z4"
                          className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs rounded-xs font-mono font-bold focus:bg-white focus:border-[#002855] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Tax Jurisdiction
                        </label>
                        <div className="px-3 py-2 bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                          {isIntraState ? "Intra-State (CGST 9% + SGST 9%)" : "Inter-State (IGST 18%)"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Contact Engineer / Buyer *
                        </label>
                        <input
                          type="text"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs rounded-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Phone (for Dispatch SMS) *
                        </label>
                        <input
                          type="text"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs rounded-xs font-mono focus:bg-white focus:border-[#002855] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Official Procurement Email (for Invoice PDF) *
                      </label>
                      <input
                        type="email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs rounded-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Shipping Facility Address *
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs rounded-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs rounded-xs focus:bg-white focus:border-[#002855] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs rounded-xs focus:bg-white focus:border-[#002855] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs rounded-xs font-mono font-bold focus:bg-white focus:border-[#002855] focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Items Summary Card */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-white p-5 border border-slate-300 rounded-xs shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#002855] pb-2 border-b border-slate-200">
                    Order Items ({checkoutItems.length} Products)
                  </h3>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 my-3">
                    {checkoutItems.map((it) => (
                      <div key={it.id} className="py-2.5 flex items-start gap-3">
                        <div className="w-10 h-10 shrink-0 border border-slate-200 bg-slate-50 p-1 relative rounded-2xs">
                          <Image
                            src={it.product.image}
                            alt={it.product.mpn}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-mono font-bold text-xs text-[#002855] truncate">
                            {it.product.mpn}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {it.product.title}
                          </div>
                          <div className="text-[11px] font-mono text-slate-700 mt-0.5">
                            {it.quantity} pcs × ₹{it.unitPrice.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-xs text-slate-900 text-right">
                          ₹{(it.unitPrice * it.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Total breakdown */}
                  <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Taxable Value:</span>
                      <strong className="text-slate-900">₹{subtotal.toLocaleString("en-IN")}</strong>
                    </div>
                    {isIntraState ? (
                      <>
                        <div className="flex justify-between text-slate-600">
                          <span>CGST (9.0%):</span>
                          <span>₹{cgst.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>SGST (9.0%):</span>
                          <span>₹{sgst.toLocaleString("en-IN")}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between text-slate-600">
                        <span>IGST (18.0%):</span>
                        <span>₹{igst.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-slate-300 pt-2 flex justify-between items-baseline text-slate-900">
                      <span className="font-bold text-[#002855]">Total Payable:</span>
                      <span className="text-base font-black text-[#002855]">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="mt-4 w-full bg-[#002855] hover:bg-[#001D3D] text-white py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Continue to Shipping Logistics</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: SHIPPING TIER & FACTORY DISPATCH */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="bg-white p-5 border border-slate-300 rounded-xs shadow-xs space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#002855]">
                    Select Factory Logistics &amp; Transit Method
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Orders ship directly from Bhosari Central Logistics Hub (Pune) with AS9100D Certificate of Conformance.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Air Express BlueDart */}
                  <label
                    onClick={() => setShippingMethod("air")}
                    className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                      shippingMethod === "air"
                        ? "border-[#002855] bg-blue-50/60 ring-1 ring-[#002855]"
                        : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[#002855]">
                          <Plane className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              BlueDart Aviation — Priority Next-Day Air Express
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-2xs font-mono">
                              RECOMMENDED
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                            Guaranteed dispatch within 24 hours from Bhosari plant. Tamper-evident ESD moisture-barrier packing.
                          </p>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">
                            Estimated Delivery: <strong>Tomorrow by 6:00 PM</strong> to {pincode}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-black text-[#002855]">
                          {subtotal > 50000 ? "FREE" : "₹450"}
                        </span>
                        {subtotal > 50000 && (
                          <span className="block text-[9px] text-emerald-700 font-bold">
                            Order &gt; ₹50k Waiver
                          </span>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Surface Logistics */}
                  <label
                    onClick={() => setShippingMethod("surface")}
                    className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                      shippingMethod === "surface"
                        ? "border-[#002855] bg-blue-50/60 ring-1 ring-[#002855]"
                        : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900">
                            SafeExpress Heavy Surface Freight
                          </span>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                            Secured heavy carton transit across national highways. Best for bulk reels and heavy connector backshells.
                          </p>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">
                            Estimated Delivery: <strong>2–3 Business Days</strong>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-black text-slate-900">
                          ₹250
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Dispatch Guarantee Banner */}
                <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xs text-xs text-emerald-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>AS9100D Certificate of Conformance (CoC)</strong> and factory lot traceability report included in box.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Delivery Address</span>
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    className="bg-[#002855] hover:bg-[#001D3D] text-white px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Proceed to Payment Gateway</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: PAYMENT GATEWAY (UPI, CARDS, NETBANKING, PO) */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="bg-white p-5 border border-slate-300 rounded-xs shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-emerald-600" />
                      Encrypted B2B Payment Gateway
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      256-Bit SSL Secured • RBI Compliant • Immediate Factory Order Release
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Total Amount:</span>
                    <span className="font-mono text-base font-black text-[#002855]">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Payment Mode Selector Tabs */}
                <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("upi")}
                    className={`py-2 px-1 text-center rounded-2xs border transition-all cursor-pointer ${
                      paymentMode === "upi"
                        ? "bg-[#002855] text-white border-[#002855] shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block text-[11px]">UPI / QR</span>
                    <span className="text-[9px] font-normal opacity-80">Instant Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode("card")}
                    className={`py-2 px-1 text-center rounded-2xs border transition-all cursor-pointer ${
                      paymentMode === "card"
                        ? "bg-[#002855] text-white border-[#002855] shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block text-[11px]">Card / RuPay</span>
                    <span className="text-[9px] font-normal opacity-80">Corporate / Visa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode("netbanking")}
                    className={`py-2 px-1 text-center rounded-2xs border transition-all cursor-pointer ${
                      paymentMode === "netbanking"
                        ? "bg-[#002855] text-white border-[#002855] shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block text-[11px]">NetBanking</span>
                    <span className="text-[9px] font-normal opacity-80">NEFT / RTGS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode("po")}
                    className={`py-2 px-1 text-center rounded-2xs border transition-all cursor-pointer ${
                      paymentMode === "po"
                        ? "bg-[#002855] text-white border-[#002855] shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block text-[11px]">Defense PO</span>
                    <span className="text-[9px] font-normal opacity-80">Net 30 Credit</span>
                  </button>
                </div>

                {/* TAB 1: UPI / QR CODE */}
                {paymentMode === "upi" && (
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Simulated QR Code */}
                      <div className="bg-white p-2 border border-slate-300 rounded-xs shadow-xs text-center shrink-0">
                        <div className="w-28 h-28 bg-slate-900 relative p-2 flex flex-col justify-between text-white font-mono text-[9px]">
                          <div className="flex justify-between">
                            <div className="w-6 h-6 border-2 border-white" />
                            <div className="w-6 h-6 border-2 border-white" />
                          </div>
                          <div className="text-center font-bold text-[10px] text-amber-300">
                            ₹{grandTotal.toLocaleString("en-IN")}
                          </div>
                          <div className="flex justify-between">
                            <div className="w-6 h-6 border-2 border-white" />
                            <div className="text-[8px]">UPI QR</div>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 block">Scan with any UPI App</span>
                      </div>

                      <div className="flex-1 space-y-2 text-xs">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          Or Enter Corporate UPI ID / VPA:
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="flex-1 border border-slate-300 bg-white px-3 py-2 text-xs rounded-xs font-mono font-medium focus:outline-hidden focus:border-[#002855]"
                          />
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-2 rounded-xs font-mono">
                            Verified ✓
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1">
                          <span>Supported:</span>
                          <span className="font-bold text-slate-700">Google Pay</span>
                          <span>•</span>
                          <span className="font-bold text-slate-700">PhonePe</span>
                          <span>•</span>
                          <span className="font-bold text-slate-700">Paytm</span>
                          <span>•</span>
                          <span className="font-bold text-slate-700">BHIM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CREDIT / DEBIT CARDS */}
                {paymentMode === "card" && (
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Card Number (Corporate RuPay / Visa / Mastercard)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-xs font-mono font-bold focus:outline-hidden focus:border-[#002855]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-xs font-mono focus:outline-hidden focus:border-[#002855]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          CVV / Security Code
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-xs font-mono focus:outline-hidden focus:border-[#002855]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: NETBANKING */}
                {paymentMode === "netbanking" && (
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Select Corporate Banking Portal
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-xs font-bold focus:outline-hidden focus:border-[#002855]"
                      >
                        <option value="HDFC Bank (Corporate)">HDFC Bank Ltd. (Corporate)</option>
                        <option value="State Bank of India (INB)">State Bank of India (CINB)</option>
                        <option value="ICICI Bank (Corporate)">ICICI Bank Corporate Connect</option>
                        <option value="Axis Bank Corporate">Axis Bank Ltd.</option>
                      </select>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xs text-[11px] text-blue-900">
                      <strong>Instant Settlement:</strong> Order is automatically approved upon bank portal confirmation.
                    </div>
                  </div>
                )}

                {/* TAB 4: DEFENSE PO / NET 30 */}
                {paymentMode === "po" && (
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Approved Purchase Order (PO) Reference Number *
                      </label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        placeholder="PO/DRDO/2026/0914"
                        className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-xs font-mono font-bold focus:outline-hidden focus:border-[#002855]"
                      />
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xs text-[11px] text-amber-900 leading-relaxed">
                      <strong>Pre-Approved Defense Credit:</strong> Applicable for verified entities with active CAGE/NCAGE codes (DRDO, ISRO, HAL, BEL, Bharat Dynamics, Solar Industries). Invoice payable within Net 30 Days.
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Shipping</span>
                  </button>

                  <button
                    onClick={handleExecutePayment}
                    disabled={isProcessingPayment}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-6 py-2.5 text-xs font-bold rounded-xs flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying with Payment Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        <span>Pay &amp; Confirm Factory Order (₹{grandTotal.toLocaleString("en-IN")})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: ORDER CONFIRMED & LIVE TRACKER */}
          {/* ============================================================ */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto space-y-5 animate-scaleIn">
              {/* Success Banner */}
              <div className="bg-white p-6 border-2 border-emerald-500 text-center rounded-xs shadow-md space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <BadgeCheck className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-black uppercase text-[#002855]">
                  Factory Order Confirmed &amp; Scheduled for Dispatch!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{companyName}</strong>. Your payment has been authorized and the order has been routed to the Bhosari, Pune assemble-to-order cell.
                </p>

                {/* Order ID Pill */}
                <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 px-3.5 py-1.5 rounded-xs font-mono text-xs">
                  <span className="text-slate-500">Order ID:</span>
                  <strong className="text-[#002855] text-sm">{orderId}</strong>
                  <button
                    onClick={handleCopyOrderId}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                    title="Copy Order ID"
                  >
                    {copiedOrderId ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Manufacturing & Dispatch Timeline */}
              <div className="bg-white p-5 border border-slate-300 rounded-xs shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#002855]">
                  Pune Plant Fulfillment &amp; Dispatch Pipeline
                </h4>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block mb-1" />
                    <strong className="block text-emerald-800 text-[11px]">1. Payment Verified</strong>
                    <span className="text-[10px] text-slate-500 font-mono">Completed</span>
                  </div>

                  <div className="bg-blue-50 border border-blue-300 p-2.5 rounded-xs animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-blue-500 inline-block mb-1" />
                    <strong className="block text-[#002855] text-[11px]">2. Picking &amp; QA</strong>
                    <span className="text-[10px] text-blue-700 font-mono font-bold">In Progress</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xs text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-slate-300 inline-block mb-1" />
                    <strong className="block text-slate-600 text-[11px]">3. BlueDart AWB</strong>
                    <span className="text-[10px] text-slate-400 font-mono">Today 5 PM</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xs text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-slate-300 inline-block mb-1" />
                    <strong className="block text-slate-600 text-[11px]">4. Out for Delivery</strong>
                    <span className="text-[10px] text-slate-400 font-mono">Tomorrow</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination Facility:</span>
                    <strong className="text-slate-800 font-mono">{city}, {state} — {pincode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Carrier &amp; Method:</span>
                    <strong className="text-[#002855]">{shippingMethod === "air" ? "BlueDart Aviation Priority Air" : "SafeExpress Surface"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Charged:</span>
                    <strong className="text-emerald-700 font-mono font-bold">₹{grandTotal.toLocaleString("en-IN")} (Paid)</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full sm:w-auto border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer rounded-xs"
                >
                  Return to Catalog
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      openTracking(orderId);
                    }}
                    className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-xs shadow-xs"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Track Shipment</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-initial bg-[#002855] hover:bg-[#001D3D] text-white px-5 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs rounded-xs"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Tax Invoice (PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
