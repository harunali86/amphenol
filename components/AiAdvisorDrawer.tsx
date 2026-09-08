"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRfq } from "@/context/RfqContext";
import { CATALOG_PRODUCTS, Product } from "@/data/catalog";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Plus,
  FileText,
  Sliders,
  CheckCircle2,
  CornerDownLeft,
  User,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  recommendedProducts?: Product[];
  timestamp: string;
}

export function AiAdvisorDrawer() {
  const { isAiAdvisorOpen, setIsAiAdvisorOpen, addToRfq, setActiveTab } = useRfq();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "Hello! I am the **Amphenol Technical Interconnect Advisor**.\n\nI can help you select the exact Mil-Spec or industrial connector for your voltage, current, pin density, and IP rating requirements, or find direct Amphenol equivalents for TE Connectivity, Souriau, and Deutsch parts.\n\nWhat engineering challenge are you solving today?",
      timestamp: "Just now",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: "EV Battery: 250A 1000V DC Plug", query: "Need a high voltage IP67 connector for an EV powertrain battery pack rated for 250A and 1000V." },
    { label: "Defense: 38999 66-Pin Plug", query: "Looking for MIL-DTL-38999 Series III straight plug with 66 pins in Olive Drab Cadmium." },
    { label: "Cross-Ref: TE DTS26W19-35PN", query: "What is the Amphenol equivalent for TE Connectivity part DTS26W19-35PN?" },
    { label: "Harsh Data: Rugged RJ45 Cat6", query: "Need a ruggedized RJ45 ethernet connector with IP68 rating for tactical field communications." },
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

    // AI Semantic Simulation based on catalog parameters
    setTimeout(() => {
      const q = query.toLowerCase();
      let matches: Product[] = [];
      let replyText = "";

      if (q.includes("ev") || q.includes("250a") || q.includes("1000v") || q.includes("powertrain") || q.includes("battery")) {
        matches = [CATALOG_PRODUCTS[2], CATALOG_PRODUCTS[3]]; // e-Power and RadSok
        replyText = "For high-voltage EV battery & powertrain architectures, I recommend Amphenol's **e-Power HVSL series** combined with **RadSok** hyperbolic contact technology. It features integrated High Voltage Interlock Loop (HVIL), IP67/IP6K9K touch-proof sealing, and handles up to 250A continuous at 1000V DC without thermal degradation.";
      } else if (q.includes("te") || q.includes("dts26") || q.includes("cross-ref") || q.includes("equivalent")) {
        matches = [CATALOG_PRODUCTS[0], CATALOG_PRODUCTS[1]]; // D38999 Series III
        replyText = "The direct 100% form-fit-function Amphenol replacement for TE Connectivity **DTS26W19-35PN** is **D38999/26WF35PN**. Both adhere strictly to MIL-DTL-38999 Series III, featuring identical 19-35 insert layouts (66 Size 22D contacts), Olive Drab Cadmium plating, and 500-hour salt spray resistance.";
      } else if (q.includes("rj45") || q.includes("ethernet") || q.includes("cat6") || q.includes("data")) {
        matches = [CATALOG_PRODUCTS[4], CATALOG_PRODUCTS[5]]; // RJ Field & USB Field
        replyText = "For harsh tactical outdoor and industrial data links, I recommend **RJ Field (RJFTV)**. It encapsulates standard RJ45 cordsets inside a MIL-DTL-38999 Series III metal shell, providing complete IP68 fluid immersion protection and 65dB EMI shielding up to 10 GHz.";
      } else {
        matches = [CATALOG_PRODUCTS[0], CATALOG_PRODUCTS[8]]; // D38999 and 2M
        replyText = "Based on your technical requirements, I have cross-referenced Amphenol's verified defense and industrial product matrix. Here are the top qualified part numbers with immediate stock availability at our Pune logistics hub.";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        recommendedProducts: matches,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  if (!isAiAdvisorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsAiAdvisorOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Sliding Drawer */}
      <div className="relative flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 px-5 py-4 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-xs">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">Amphenol AI Technical Advisor</h3>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-blue-200">
                15,000 SKUs RAG Grounded • Zero Hallucination Mode
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiAdvisorOpen(false)}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Security & Strict Specs Guardrail Banner */}
        <div className="border-b border-slate-100 bg-blue-50/70 px-5 py-2 text-[11px] text-blue-800 dark:border-slate-800 dark:bg-blue-950/40 dark:text-blue-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            Grounding: Amphenol India Datasheets & MIL-STD Specifications
          </span>
          <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">Temp: 0.0</span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-3`}>
                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-sm"
                      : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <span className="block mt-1.5 text-[10px] opacity-70 text-right">
                    {m.timestamp}
                  </span>
                </div>

                {/* Rich Product Recommendation Cards */}
                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Recommended Amphenol Part Numbers:
                    </span>
                    {m.recommendedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800/90 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-400">
                              {prod.mpn}
                            </span>
                            <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                              {prod.title}
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            {prod.stock} in stock
                          </span>
                        </div>

                        {/* Specs Pills */}
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {prod.pinCount} Pins
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {prod.currentRating}
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {prod.ipRating}
                          </span>
                        </div>

                        {/* Card Interactive Action Buttons */}
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-700/80">
                          <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            ₹{prod.priceTiers[0].price.toLocaleString("en-IN")}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setIsAiAdvisorOpen(false);
                                setActiveTab("configurator");
                              }}
                              className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 flex items-center gap-1"
                            >
                              <Sliders className="h-3 w-3" />
                              Configure
                            </button>

                            <button
                              onClick={() => {
                                addToRfq(prod, prod.moq, "ai-advisor");
                                confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
                              }}
                              className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
                            >
                              <Plus className="h-3 w-3" />
                              Add to RFQ
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                <Bot className="h-4 w-4 animate-bounce" />
              </div>
              <div className="rounded-2xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Searching 15,000 SKUs parametric vector index...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="border-t border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Quick Prompts (Click to test):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask specs (e.g. 4-pin IP68 waterproof 60A connector)..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 transition-all shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
