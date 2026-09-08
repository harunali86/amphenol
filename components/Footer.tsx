"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#00144f] text-white border-t border-[#00226b]">
      <div className="mx-auto max-w-[1850px] px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* LEFT COLUMN: Logo + 2 Rounded Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Authentic Amphenol Logo */}
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline select-none">
                <span>Amphenol</span>
                <span className="text-xs font-normal align-super ml-0.5 mr-2">®</span>
                <span className="text-[#f59e0b] font-extrabold tracking-wider text-2xl sm:text-3xl">
                  INDIA
                </span>
              </div>
              <div className="text-[11px] uppercase tracking-widest text-blue-200/80 font-bold mt-1">
                Interconnect India Pvt. Ltd. • Bhosari Pune Plant
              </div>
            </div>

            {/* Card 1: Subscribe and Stay Connected with Amphenol */}
            <div className="border border-blue-400/30 rounded-2xl p-6 sm:p-7 bg-[#001758]/40 space-y-5">
              <h3 className="text-xl sm:text-2xl font-normal text-white leading-snug">
                Subscribe and Stay<br />Connected with<br />Amphenol India
              </h3>

              {submitted ? (
                <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/50 p-3 rounded-lg text-xs text-emerald-200">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Thank you for subscribing to Amphenol technical bulletins.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full rounded-md bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  <div>
                    <button
                      type="submit"
                      className="border border-white/80 text-white hover:bg-white hover:text-[#00144f] px-7 py-2 rounded-md text-sm font-semibold transition-all"
                    >
                      Submit
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                    By submitting your email, you are agreeing to receive occasional updates from Amphenol India. This site is protected by reCAPTCHA and Google. <span className="underline cursor-pointer hover:text-white">Privacy Policy</span> and <span className="underline cursor-pointer hover:text-white">Terms &amp; Conditions</span>.
                  </p>
                </form>
              )}
            </div>

            {/* Card 2: Plant Location & Contact */}
            <div className="border border-blue-400/30 rounded-2xl p-6 sm:p-7 bg-[#001758]/40 space-y-4">
              <div>
                <div className="text-sm font-semibold text-blue-300">
                  Pune, India
                </div>
                <div className="text-sm text-slate-200 mt-1 leading-relaxed">
                  Plot No. 105, Bhosari Industrial Area<br />
                  Pune – 411 026, Maharashtra, India
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Toll Free / Plant Board
                </div>
                <div className="text-sm text-white font-medium mt-0.5">
                  +91 20 2712 0481 / +91 20 2712 0482
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Direct Plant Orders &amp; RFQ
                </div>
                <div className="text-sm text-white font-medium mt-0.5">
                  sales@amphenol-in.com • GSTIN: 27AAACA1234F1Z5
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMNS: 3 Columns Grid (Top Row & Bottom Row) (7 cols) */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* TOP ROW: Products | Markets | Engineering Center */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Products */}
              <div>
                <h4 className="text-xl font-normal text-white mb-4 tracking-wide">
                  Products
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-200">
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      MIL-DTL-38999 Series III
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      62IN / MIL-26482 I &amp; II
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      MIL-DTL-83723 High-Temp
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      EV Powertrain (High Voltage)
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      RadSok Power Connectors
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      Micro-D (MIL-DTL-83513)
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      Hermetic Glass-to-Metal
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      M28840 Navy High-Shock
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      TFOCA Tactical Fiber Optic
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      RJ &amp; USB Field Harsh Data
                    </a>
                  </li>
                  <li>
                    <a href="#catalog" className="hover:text-white transition-colors block">
                      Backshells &amp; Protective Caps
                    </a>
                  </li>
                </ul>
              </div>

              {/* Markets */}
              <div>
                <h4 className="text-xl font-normal text-white mb-4 tracking-wide">
                  Markets
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-200">
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Aerospace &amp; Avionics
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Automotive &amp; Electric Vehicles
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Broadband &amp; Optical
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Broadcast &amp; Pro-AV
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Industrial &amp; Heavy Machine
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Medical Electronics
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Military Defense (DRDO)
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Mobile 5G Networks
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Instrumentation &amp; Radar
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Transportation &amp; Railways
                    </span>
                  </li>
                </ul>
              </div>

              {/* Engineering Center */}
              <div>
                <h4 className="text-xl font-normal text-white mb-4 tracking-wide">
                  Engineering Center
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-200">
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer font-medium text-white">
                      Custom Solutions
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer text-slate-300">
                      Custom Camera Module Solutions
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer text-slate-300">
                      Modifications of Existing Products
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer text-slate-300">
                      Cable Harness Assemblies
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer text-slate-300">
                      PCB Launch Optimization
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer text-slate-300">
                      Board-to-Board Solutions
                    </span>
                  </li>
                </ul>

                <h5 className="text-sm font-semibold text-blue-300 mt-5 mb-2.5">
                  Engineering Resources
                </h5>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li>
                    <a href="#configurator" className="hover:text-white transition-colors block">
                      MIL-SPEC Part Number Builder
                    </a>
                  </li>
                  <li>
                    <a href="#crossref" className="hover:text-white transition-colors block">
                      Competitor Cross Reference
                    </a>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      QPL / UG Defense Cross Reference
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      3D STEP &amp; 2D Drawings
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Shell Plating &amp; Corrosion Chart
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Coaxial Cable Attenuation Guide
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      VSWR Conversion Chart
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* BOTTOM ROW: Contact | Resources | Company */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 border-t border-blue-400/20">
              
              {/* Contact */}
              <div>
                <h4 className="text-xl font-normal text-white mb-4 tracking-wide">
                  Contact
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-200">
                  <li>
                    <a href="#contact" className="hover:text-white transition-colors block">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Authorized Distributors
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Local Representatives (India)
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Request Plant Tour (Pune)
                    </span>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-xl font-normal text-white mb-4 tracking-wide">
                  Resources
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-200">
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Articles &amp; News
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Technical FAQ
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Glossary of Terms
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Industry Trends &amp; Whitepapers
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      RoHS / REACH Declarations
                    </span>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-xl font-normal text-white mb-4 tracking-wide">
                  Company
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-200">
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      About Us
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Manufacturing Capabilities
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Aerospace &amp; Defense Testing
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      AS9100D &amp; ISO Certifications
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Corporate Governance &amp; CSR
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-white transition-colors block cursor-pointer">
                      Careers &amp; Engineering Jobs
                    </span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM LEGAL BAR */}
        <div className="mt-14 pt-6 border-t border-blue-400/20 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 Amphenol Interconnect India Pvt. Ltd. All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6 text-slate-300">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Sale</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Domestic GST Invoicing</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Export Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
