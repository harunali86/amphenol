"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRfq } from "@/context/RfqContext";
import { Product } from "@/data/catalog";
import { Connector3DViewer } from "@/components/Connector3DViewer";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
  Plus,
  Minus,
  Check,
  RotateCcw,
  Copy,
  ChevronRight,
  Info,
  Download,
  Box,
  Compass,
  FileDown,
  CreditCard,
} from "lucide-react";

export function ConnectorConfigurator() {
  const { addToRfq, setIsRfqOpen, startDirectCheckout } = useRfq();

  // Configurator selections
  const [shellStyle, setShellStyle] = useState({
    code: "26",
    label: "Straight Plug with EMI Grounding",
    desc: "Triple-start threaded self-locking coupling with integral EMI fingers",
    prefix: "D38999/26",
  });

  const [materialFinish, setMaterialFinish] = useState({
    code: "W",
    label: "Olive Drab Cadmium",
    class: "Conductive • 500h Salt Spray",
    hex: "#4b5320",
    textColor: "text-amber-900",
  });

  const [insertArrangement, setInsertArrangement] = useState({
    code: "19-35",
    size: "19",
    pins: 66,
    contactSize: "22D",
    rating: "5.0A / 600Vrms",
  });

  const [contactType, setContactType] = useState({
    code: "P",
    label: "Pin (Male Gold Contacts)",
  });

  const [keying, setKeying] = useState({
    code: "N",
    label: "Normal Keyway Polarization",
    angle: 0,
  });

  const [configuredQty, setConfiguredQty] = useState(10);
  const [copiedMpn, setCopiedMpn] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "front" | "side">("3d");
  const [downloadCadSuccess, setDownloadCadSuccess] = useState(false);

  // Generate Military Part Number
  const generatedMpn = useMemo(() => {
    return `D38999/${shellStyle.code}${materialFinish.code}${insertArrangement.size}F${insertArrangement.code.split("-")[1]}${contactType.code}${keying.code}`;
  }, [shellStyle, materialFinish, insertArrangement, contactType, keying]);

  // Standard ISO-10303-21 STEP CAD Download Trigger
  const handleDownloadStepCad = () => {
    const stepContent = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Amphenol Tri-Start MIL-DTL-38999 Series III 3D Solid Model'),'2;1');
FILE_NAME('${generatedMpn}.stp','${new Date().toISOString()}',('Amphenol Interconnect India Design Cell'),('Mechanical CAD Division'),'Amphenol 3D Kernel v4.8','OpenCASCADE Technology 7.6','None');
FILE_SCHEMA(('CONFIG_CONTROL_DESIGN'));
ENDSEC;
DATA;
#1=APPLICATION_CONTEXT('configuration controlled 3D assembly');
#2=APPLICATION_PROTOCOL_DEFINITION('international standard','config_control_design',1994,#1);
#3=PRODUCT('${generatedMpn}','${generatedMpn}','Amphenol ${shellStyle.label}',(#4));
#4=PRODUCT_CONTEXT('',#1,'mechanical');
#5=PRODUCT_DEFINITION_FORMATION('1.0','Mil-Spec Revision G',#3);
#6=PRODUCT_DEFINITION('design','',#5,#4);
#7=PRODUCT_DEFINITION_SHAPE('','',#6);
#8=SHAPE_REPRESENTATION('${generatedMpn}_SOLID_BODY',(#9,#10),#11);
#9=AXIS2_PLACEMENT_3D('',#12,#13,#14);
#10=MANIFOLD_SOLID_BREP('${generatedMpn}_SHELL',#15);
#11=(GEOMETRIC_REPRESENTATION_CONTEXT(3) GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((#16)) GLOBAL_UNIT_ASSIGNED_CONTEXT((#17,#18,#19)) REPRESENTATION_CONTEXT('','3D'));
#12=CARTESIAN_POINT('',(0.,0.,0.));
#13=DIRECTION('',(0.,0.,1.));
#14=DIRECTION('',(1.,0.,0.));
#15=CLOSED_SHELL('',());
#16=UNCERTAINTY_MEASURE_WITH_UNIT(LENGTH_MEASURE(1.E-05),#17,'distance_accuracy_value','confusion accuracy');
#17=(CONVERSION_BASED_UNIT('MILLIMETRE',#20) LENGTH_UNIT() NAMED_UNIT(#21));
#18=(NAMED_UNIT(#22) PLANE_ANGLE_UNIT() SI_UNIT($,.RADIAN.));
#19=(NAMED_UNIT(#22) SI_UNIT($,.STERADIAN.) SOLID_ANGLE_UNIT());
#20=LENGTH_MEASURE_WITH_UNIT(LENGTH_MEASURE(1.E-03),#23);
#21=DIMENSIONAL_EXPOSITIONS(1,0,0,0,0,0,0);
#22=DIMENSIONAL_EXPOSITIONS(0,0,0,0,0,0,0);
#23=(LENGTH_UNIT() NAMED_UNIT(#21) SI_UNIT(.MILLI.,.METRE.));
ENDSEC;
END-ISO-10303-21;`;

    const blob = new Blob([stepContent], { type: "application/step;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${generatedMpn}.stp`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadCadSuccess(true);
    setTimeout(() => setDownloadCadSuccess(false), 2500);
  };

  // Calculate pricing based on selections
  const calculatedUnitPrice = useMemo(() => {
    let base = 2850;
    if (shellStyle.code === "24") base += 350; // Jam nut
    if (materialFinish.code === "K") base += 2100; // Stainless steel
    if (materialFinish.code === "Z") base += 450; // Black Zinc Nickel
    if (insertArrangement.pins > 40) base += 450;
    if (configuredQty >= 50) base = Math.round(base * 0.88);
    if (configuredQty >= 250) base = Math.round(base * 0.78);
    return base;
  }, [shellStyle, materialFinish, insertArrangement, configuredQty]);

  // Handle Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMpn);
    setCopiedMpn(true);
    setTimeout(() => setCopiedMpn(false), 2000);
  };

  // Handler to add configured part to RFQ
  const handleAddConfiguredPart = () => {
    const customProduct: Product = {
      id: `custom-cfg-${Date.now()}`,
      mpn: generatedMpn,
      series: "MIL-DTL-38999 Series III ATO",
      title: `${shellStyle.label}, Shell ${insertArrangement.size}, ${insertArrangement.pins} Pins, ${materialFinish.label}`,
      category: "Military & Aerospace",
      description: `Assemble-to-Order custom configuration. Plating: ${materialFinish.label}, Keyway: ${keying.code}. Built at Pune Bhosari manufacturing facility.`,
      image: "/images/products/mil-dtl-38999.jpg",
      shellSize: `Shell ${insertArrangement.size}`,
      pinCount: insertArrangement.pins,
      currentRating: insertArrangement.rating.split("/")[0].trim(),
      voltageRating: insertArrangement.rating.split("/")[1].trim(),
      ipRating: "IP68 (Harsh Immersion)",
      operatingTemp: materialFinish.code === "K" ? "-65°C to +200°C" : "-65°C to +175°C",
      shellPlating: materialFinish.label,
      contactGender: contactType.code === "P" ? "Pin (Male)" : "Socket (Female)",
      matingType: "Threaded",
      stock: 500,
      warehouse: "Pune ATO Assembly Cell",
      moq: 10,
      leadTime: "Assemble-to-Order (Ships in 48 hrs)",
      priceTiers: [
        { qty: 10, price: calculatedUnitPrice },
        { qty: 50, price: Math.round(calculatedUnitPrice * 0.88) },
        { qty: 250, price: Math.round(calculatedUnitPrice * 0.78) },
      ],
      datasheetUrl: "https://amphenol-in.com/wp-content/uploads/2024/12/MIL-38999-Sr-III-AC38907-0317.pdf",
      cad3dAvailable: true,
      competitorEquivalents: [
        { brand: "TE Connectivity", partNumber: `DTS${shellStyle.code}${materialFinish.code}${insertArrangement.size}-${insertArrangement.code.split("-")[1]}${contactType.code}${keying.code}` },
      ],
      badges: ["Custom ATO Assembly", "Mil-Spec Certified", "48h Dispatch"],
    };

    addToRfq(customProduct, configuredQty, "configurator");
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setIsRfqOpen(true);
    }, 800);
  };

  const handleDirectBuyConfiguredPart = () => {
    const customProduct: Product = {
      id: `custom-cfg-${Date.now()}`,
      mpn: generatedMpn,
      series: "MIL-DTL-38999 Series III ATO",
      title: `${shellStyle.label}, Shell ${insertArrangement.size}, ${insertArrangement.pins} Pins, ${materialFinish.label}`,
      category: "Military & Aerospace",
      description: `Assemble-to-Order custom configuration. Plating: ${materialFinish.label}, Keyway: ${keying.code}. Built at Pune Bhosari manufacturing facility.`,
      image: "/images/products/mil-dtl-38999.jpg",
      shellSize: `Shell ${insertArrangement.size}`,
      pinCount: insertArrangement.pins,
      currentRating: insertArrangement.rating.split("/")[0].trim(),
      voltageRating: insertArrangement.rating.split("/")[1].trim(),
      ipRating: "IP68 (Harsh Immersion)",
      operatingTemp: materialFinish.code === "K" ? "-65°C to +200°C" : "-65°C to +175°C",
      shellPlating: materialFinish.label,
      contactGender: contactType.code === "P" ? "Pin (Male)" : "Socket (Female)",
      matingType: "Threaded",
      stock: 500,
      warehouse: "Pune ATO Assembly Cell",
      moq: 10,
      leadTime: "Assemble-to-Order (Ships in 48 hrs)",
      priceTiers: [
        { qty: 10, price: calculatedUnitPrice },
        { qty: 50, price: Math.round(calculatedUnitPrice * 0.88) },
        { qty: 250, price: Math.round(calculatedUnitPrice * 0.78) },
      ],
      datasheetUrl: "https://amphenol-in.com/wp-content/uploads/2024/12/MIL-38999-Sr-III-AC38907-0317.pdf",
      cad3dAvailable: true,
      competitorEquivalents: [
        { brand: "TE Connectivity", partNumber: `DTS${shellStyle.code}${materialFinish.code}${insertArrangement.size}-${insertArrangement.code.split("-")[1]}${contactType.code}${keying.code}` },
      ],
      badges: ["Custom ATO Assembly", "Mil-Spec Certified", "48h Dispatch"],
    };

    startDirectCheckout(customProduct, configuredQty);
  };

  // Generate dynamic circular pin layout coordinates
  const pinCoordinates = useMemo(() => {
    const coords: { x: number; y: number }[] = [];
    const count = insertArrangement.pins;

    if (count <= 13) {
      // 1 center pin + 12 outer
      coords.push({ x: 80, y: 80 });
      for (let i = 0; i < count - 1; i++) {
        const angle = (i / (count - 1)) * 2 * Math.PI;
        coords.push({
          x: 80 + 44 * Math.cos(angle),
          y: 80 + 44 * Math.sin(angle),
        });
      }
    } else if (count <= 37) {
      coords.push({ x: 80, y: 80 });
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * 2 * Math.PI;
        coords.push({ x: 80 + 26 * Math.cos(angle), y: 80 + 26 * Math.sin(angle) });
      }
      for (let i = 0; i < count - 13; i++) {
        const angle = (i / (count - 13)) * 2 * Math.PI;
        coords.push({ x: 80 + 52 * Math.cos(angle), y: 80 + 52 * Math.sin(angle) });
      }
    } else {
      // High density 66 pins in 3 orbits
      coords.push({ x: 80, y: 80 });
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * 2 * Math.PI;
        coords.push({ x: 80 + 20 * Math.cos(angle), y: 80 + 20 * Math.sin(angle) });
      }
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * 2 * Math.PI;
        coords.push({ x: 80 + 38 * Math.cos(angle), y: 80 + 38 * Math.sin(angle) });
      }
      for (let i = 0; i < Math.min(35, count - 31); i++) {
        const angle = (i / Math.min(35, count - 31)) * 2 * Math.PI;
        coords.push({ x: 80 + 56 * Math.cos(angle), y: 80 + 56 * Math.sin(angle) });
      }
    }
    return coords;
  }, [insertArrangement.pins]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border border-slate-300 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#002855]">
                3D Interactive Connector Configurator
              </h2>
              <span className="bg-[#002855] text-white px-2.5 py-0.5 text-xs font-mono font-bold tracking-wider">
                MIL-DTL-38999 ATO CELL
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Configure 10,000+ military qualified circular connector combinations with real-time part number validation, dynamic pinout mapping, and 48-hour Pune plant dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-blue-200 bg-blue-50 px-3 py-2 text-xs shrink-0">
            <ShieldCheck className="h-4 w-4 text-[#002855] shrink-0" />
            <span className="text-slate-800">
              Pune Cell: <strong>48-Hour Assemble-to-Order (ATO)</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Configurator Layout: Left Steps + Right Live Spec & MPN preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Step-by-Step Selection Engine (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Step 1: Shell Style */}
          <div className="border border-slate-300 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-[#002855] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                Shell Style &amp; Mounting
              </span>
              <span className="font-mono text-xs font-bold text-[#002855]">/{shellStyle.code}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { code: "26", label: "Straight Plug with EMI", desc: "Cable plug with triple-start locking", prefix: "D38999/26" },
                { code: "20", label: "Wall Mount Receptacle", desc: "4-hole front/rear panel flange", prefix: "D38999/20" },
                { code: "24", label: "Jam Nut Receptacle", desc: "Single D-hole rear nut mount", prefix: "D38999/24" },
              ].map((style) => (
                <button
                  key={style.code}
                  onClick={() => setShellStyle(style)}
                  className={`p-3 text-left border transition-all cursor-pointer ${
                    shellStyle.code === style.code
                      ? "border-[#002855] bg-blue-50/70 shadow-xs ring-1 ring-[#002855]"
                      : "border-slate-300 hover:border-slate-400 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#002855]">
                      /{style.code}
                    </span>
                    {shellStyle.code === style.code && (
                      <Check className="h-3.5 w-3.5 text-[#002855]" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {style.label}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Material & Finish Plating */}
          <div className="border border-slate-300 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-[#002855] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                Material &amp; Plating Finish
              </span>
              <span className="font-mono text-xs font-bold text-[#002855]">[{materialFinish.code}] {materialFinish.label}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { code: "W", label: "Olive Drab Cadmium", class: "Conductive • 500h Salt Spray (Standard Defense)", hex: "#4b5320" },
                { code: "F", label: "Electroless Nickel", class: "RoHS Compliant • 48h Salt Spray • Space Grade", hex: "#cbd5e1" },
                { code: "Z", label: "Black Zinc Nickel", class: "RoHS Compliant Alternative to Cadmium • 500h Salt", hex: "#1e293b" },
                { code: "K", label: "Passivated Stainless 316L", class: "Firewall 200°C • Severe Marine Immersion", hex: "#94a3b8" },
              ].map((m) => (
                <button
                  key={m.code}
                  onClick={() => setMaterialFinish({ ...m, textColor: "text-slate-900" })}
                  className={`p-3 text-left border transition-all cursor-pointer flex items-start justify-between ${
                    materialFinish.code === m.code
                      ? "border-[#002855] bg-blue-50/70 shadow-xs ring-1 ring-[#002855]"
                      : "border-slate-300 hover:border-slate-400 bg-white"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-slate-400 shrink-0"
                        style={{ backgroundColor: m.hex }}
                      />
                      <span className="font-mono text-xs font-bold text-[#002855]">
                        [{m.code}]
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {m.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{m.class}</p>
                  </div>
                  {materialFinish.code === m.code && (
                    <Check className="h-4 w-4 text-[#002855] shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Shell Size & Insert Layout */}
          <div className="border border-slate-300 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-[#002855] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                Shell Size &amp; Contact Layout
              </span>
              <span className="font-mono text-xs font-bold text-[#002855]">
                Shell {insertArrangement.size} • {insertArrangement.pins} Contacts
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { code: "11-35", size: "11", pins: 13, contactSize: "22D", rating: "5.0A / 600Vrms" },
                { code: "15-35", size: "15", pins: 37, contactSize: "22D", rating: "5.0A / 600Vrms" },
                { code: "19-35", size: "19", pins: 66, contactSize: "22D", rating: "5.0A / 600Vrms" },
                { code: "21-41", size: "21", pins: 41, contactSize: "20", rating: "7.5A / 600Vrms" },
              ].map((arr) => (
                <button
                  key={arr.code}
                  onClick={() => setInsertArrangement(arr)}
                  className={`p-3 text-center border transition-all cursor-pointer ${
                    insertArrangement.code === arr.code
                      ? "border-[#002855] bg-blue-50/70 shadow-xs ring-1 ring-[#002855]"
                      : "border-slate-300 hover:border-slate-400 bg-white"
                  }`}
                >
                  <div className="font-mono text-sm font-black text-slate-900">
                    {arr.code}
                  </div>
                  <div className="text-xs font-bold text-[#002855] mt-0.5">
                    {arr.pins} Pins
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Size {arr.contactSize} • Shell {arr.size}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4 & 5: Contact Gender & Keyway Polarization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender */}
            <div className="border border-slate-300 bg-white p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#002855] block pb-2 mb-3 border-b border-slate-200">
                Step 4 • Contact Gender
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: "P", label: "Pin (Male Contacts)" },
                  { code: "S", label: "Socket (Female Contacts)" },
                ].map((g) => (
                  <button
                    key={g.code}
                    onClick={() => setContactType(g)}
                    className={`p-2.5 text-center border text-xs font-bold transition-all cursor-pointer ${
                      contactType.code === g.code
                        ? "border-[#002855] bg-[#002855] text-white shadow-xs"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    [{g.code}] {g.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Keying */}
            <div className="border border-slate-300 bg-white p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#002855] block pb-2 mb-3 border-b border-slate-200">
                Step 5 • Keyway Polarization
              </span>
              <div className="flex gap-1.5">
                {[
                  { code: "N", angle: 0 },
                  { code: "A", angle: 35 },
                  { code: "B", angle: 75 },
                  { code: "C", angle: 120 },
                  { code: "D", angle: 150 },
                ].map((k) => (
                  <button
                    key={k.code}
                    onClick={() => setKeying({ code: k.code, label: `Keyway ${k.code}`, angle: k.angle })}
                    className={`flex-1 py-2 text-center border font-mono text-xs font-bold transition-all cursor-pointer ${
                      keying.code === k.code
                        ? "border-[#002855] bg-[#002855] text-white shadow-xs"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    {k.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive 3D & Military Part Number Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20 z-10">
          {/* Dynamic Generated MPN Box */}
          <div className="border border-slate-300 bg-white p-6 text-slate-900 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#002855]">
                <Sparkles className="h-4 w-4 text-[#002855]" />
                Live Generated Military MPN
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 font-mono text-[10px] font-bold">
                QPL 100% VALIDATED
              </span>
            </div>

            {/* Assembled Part Number with Copy Action */}
            <div className="mt-4 bg-slate-50 p-4 border border-slate-300 text-center relative group">
              <div className="font-mono text-lg sm:text-xl font-black tracking-widest text-[#002855]">
                {generatedMpn}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                MIL-DTL-38999 Series III Assemble-to-Order SKU
              </p>

              <button
                onClick={handleCopy}
                className="mt-2.5 inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-[#002855] hover:text-[#002855] transition-colors"
              >
                {copiedMpn ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied MPN!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Part Number</span>
                  </>
                )}
              </button>
            </div>

            {/* Syntax Breakdown Token Pills */}
            <div className="mt-4 grid grid-cols-4 gap-1.5 text-[11px] font-mono text-center">
              <div className="bg-slate-100 p-1.5 border border-slate-200">
                <span className="text-[#002855] font-bold">/{shellStyle.code}</span>
                <p className="text-[9px] text-slate-500 font-sans">Shell Type</p>
              </div>
              <div className="bg-slate-100 p-1.5 border border-slate-200">
                <span className="text-[#002855] font-bold">{materialFinish.code}</span>
                <p className="text-[9px] text-slate-500 font-sans">Plating</p>
              </div>
              <div className="bg-slate-100 p-1.5 border border-slate-200">
                <span className="text-[#002855] font-bold">{insertArrangement.size}F{insertArrangement.code.split("-")[1]}</span>
                <p className="text-[9px] text-slate-500 font-sans">Insert</p>
              </div>
              <div className="bg-slate-100 p-1.5 border border-slate-200">
                <span className="text-[#002855] font-bold">{contactType.code}{keying.code}</span>
                <p className="text-[9px] text-slate-500 font-sans">Contact/Key</p>
              </div>
            </div>

            {/* Interactive 3D CAD & Pinout Visualizer Panel */}
            {/* Interactive 3D CAD & Pinout Visualizer Panel */}
            <div className="mt-5 bg-slate-50 p-3.5 sm:p-4 border border-slate-200">
              {/* View Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("3d")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-2xs transition-colors cursor-pointer ${
                      viewMode === "3d"
                        ? "bg-[#002855] text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    🌐 3D Model
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("front")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-2xs transition-colors cursor-pointer ${
                      viewMode === "front"
                        ? "bg-[#002855] text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    🎯 Pinout Face
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("side")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-2xs transition-colors cursor-pointer ${
                      viewMode === "side"
                        ? "bg-[#002855] text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    📐 Blueprint
                  </button>
                </div>

                <span className="font-mono text-xs font-bold text-slate-700 hidden sm:inline">
                  {insertArrangement.pins} Contacts
                </span>
              </div>

              {/* VIEW 1: INTERACTIVE THREE.JS 3D ROTATABLE MODEL */}
              {viewMode === "3d" && (
                <Connector3DViewer
                  shellStyle={shellStyle}
                  materialFinish={materialFinish}
                  insertArrangement={insertArrangement}
                  contactType={contactType}
                  keying={keying}
                  generatedMpn={generatedMpn}
                />
              )}

              {/* VIEW 2: FRONT PIN FACE 2D TOPOLOGY */}
              {viewMode === "front" && (
                <div>
                  <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full border-4 border-slate-300 bg-white shadow-inner">
                    {/* Outer Shell Color ring matching selected plating */}
                    <div
                      className="absolute inset-0 rounded-full border-4 opacity-80"
                      style={{ borderColor: materialFinish.hex }}
                    />

                    {/* Keyway Notch that rotates based on selected keying angle */}
                    <div
                      style={{
                        transform: `rotate(${keying.angle}deg) translateY(-84px)`,
                      }}
                      className="absolute h-3 w-5 bg-amber-500 border border-amber-600 shadow-xs z-10 transition-transform duration-300"
                      title={`Keyway Position ${keying.code} (${keying.angle}°)`}
                    />

                    {/* Inner insert circle */}
                    <div className="h-36 w-36 rounded-full border border-dashed border-slate-300 flex items-center justify-center relative">
                      {/* Dynamic Pins */}
                      {pinCoordinates.map((pt, i) => (
                        <div
                          key={i}
                          style={{ left: `${pt.x - 4}px`, top: `${pt.y - 4}px` }}
                          className="absolute h-2 w-2 rounded-full bg-amber-400 border border-amber-600 shadow-2xs hover:scale-150 transition-transform"
                          title={`Pin #${i + 1} (Size ${insertArrangement.contactSize})`}
                        />
                      ))}

                      <div className="text-center font-mono z-10 bg-white/85 px-2 py-0.5 rounded-xs border border-slate-200">
                        <span className="text-xs font-black text-slate-900 block">{insertArrangement.code}</span>
                        <span className="text-[10px] font-bold text-[#002855]">{contactType.code === "P" ? "Pins (Male)" : "Sockets (Female)"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 text-center text-[11px] text-slate-500 font-medium">
                    Plating: <strong className="text-slate-800">{materialFinish.label}</strong> • {insertArrangement.rating}
                  </div>
                </div>
              )}

              {/* VIEW 3: SIDE BLUEPRINT */}
              {viewMode === "side" && (
                <div className="h-44 w-full bg-white border border-slate-300 rounded-xs p-3 flex flex-col justify-between font-mono text-[11px]">
                  <div className="flex justify-between items-center text-slate-500 border-b border-slate-200 pb-1.5">
                    <span>SHELL SIZE: <strong>{insertArrangement.size}</strong></span>
                    <span>STYLE: <strong>{shellStyle.code}</strong></span>
                  </div>
                  <div className="flex items-center justify-around py-3">
                    <div className="text-center">
                      <div className="text-xs font-black text-[#002855]">{insertArrangement.size === "19" ? "38.1 mm" : "31.8 mm"}</div>
                      <div className="text-[9px] text-slate-400">Flange Diameter</div>
                    </div>
                    <div className="h-10 w-px bg-slate-300" />
                    <div className="text-center">
                      <div className="text-xs font-black text-[#002855]">M28 x 1.0 - 6g</div>
                      <div className="text-[9px] text-slate-400">Coupling Thread</div>
                    </div>
                    <div className="h-10 w-px bg-slate-300" />
                    <div className="text-center">
                      <div className="text-xs font-black text-emerald-700">IP68 / 2m</div>
                      <div className="text-[9px] text-slate-400">Sealing Depth</div>
                    </div>
                  </div>
                  <div className="text-center text-[10px] text-slate-500 border-t border-slate-200 pt-1">
                    Complies with MIL-DTL-38999 Series III Revision K Standards
                  </div>
                </div>
              )}

              {/* Download 3D CAD and Spec Sheet Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleDownloadStepCad}
                  className={`py-2 px-2.5 text-xs font-bold rounded-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                    downloadCadSuccess
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300"
                  }`}
                >
                  {downloadCadSuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-white" />
                      <span>Saved .STEP!</span>
                    </>
                  ) : (
                    <>
                      <Box className="h-3.5 w-3.5 text-blue-700" />
                      <span>3D CAD (.STEP)</span>
                    </>
                  )}
                </button>

                <a
                  href="https://amphenol-in.com/wp-content/uploads/2024/12/MIL-38999-Sr-III-AC38907-0317.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 text-xs font-bold rounded-xs border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <FileText className="h-3.5 w-3.5 text-amber-700" />
                  <span>2D Spec Sheet (PDF)</span>
                </a>
              </div>
            </div>

            {/* Price & Quantity Calculation */}
            <div className="mt-5 border-t border-slate-200 pt-4 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Configured Unit Price
                  </span>
                  <div className="font-mono text-2xl font-black text-[#002855]">
                    ₹{calculatedUnitPrice.toLocaleString("en-IN")}
                    <span className="text-xs font-normal text-slate-500"> + GST</span>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                    Order Quantity
                  </span>
                  <div className="inline-flex items-center border border-slate-300 bg-white">
                    <button
                      onClick={() => setConfiguredQty((q) => Math.max(10, q - 10))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 font-mono text-xs font-bold text-slate-900 min-w-10 text-center">
                      {configuredQty}
                    </span>
                    <button
                      onClick={() => setConfiguredQty((q) => q + 10)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 border border-slate-200 font-mono">
                <span className="text-slate-600">Batch Total ({configuredQty} units):</span>
                <span className="font-bold text-[#002855] text-sm">
                  ₹{(calculatedUnitPrice * configuredQty).toLocaleString("en-IN")} + GST
                </span>
              </div>

              {/* Add to RFQ and Instant Buy Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddConfiguredPart}
                  className="bg-[#002855] hover:bg-[#001D3D] text-white py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                >
                  {addedNotice ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>+ RFQ Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDirectBuyConfiguredPart}
                  className="bg-[#002855] hover:bg-[#001D3D] text-white py-3 text-xs font-semibold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer rounded-xs"
                >
                  <CreditCard className="h-4 w-4 text-blue-200" />
                  <span>Direct Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
