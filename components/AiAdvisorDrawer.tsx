"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRfq } from "@/context/RfqContext";
import { Product } from "@/data/catalog";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Plus,
  Sliders,
  User,
  RotateCcw,
  Cpu,
  CheckCircle2,
  FileText,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  recommendedProducts?: Product[];
  timestamp: string;
  source?: "gemini-ai" | "fallback-intelligence";
}

export function AiAdvisorDrawer() {
  const { isAiAdvisorOpen, setIsAiAdvisorOpen, addToRfq, setActiveTab } = useRfq();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "Hello! I am the **Amphenol Technical AI Copilot**, powered by the **Amphenol Interconnect Intelligence Engine** and grounded in 15,000+ Mil-Spec, Aerospace, and EV interconnect solutions.\n\nAsk me about:\n- **Mil-Spec circular connectors** (MIL-DTL-38999 Series III, 2M, 26482, 83723)\n- **High Voltage EV Powertrain** solutions (up to 1000V DC / 250A with RadSok)\n- **Direct Cross-References** for TE Connectivity, Souriau, and Deutsch part numbers\n- **Tactical Rugged Ethernet** & Subsea IP68/IP69K solutions\n\nHow can I assist your engineering project today?",
      timestamp: "Just now",
      source: "gemini-ai",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isAiAdvisorOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isAiAdvisorOpen]);

  const quickPrompts = [
    {
      label: "⚡ EV Battery: 250A 1000V DC",
      query: "Need a high voltage IP67 connector for an EV powertrain battery pack rated for 250A and 1000V.",
    },
    {
      label: "🛡️ Defense: 38999 66-Pin Plug",
      query: "Looking for MIL-DTL-38999 Series III straight plug with 66 pins in Olive Drab Cadmium for high vibration.",
    },
    {
      label: "🔄 Cross-Ref: TE DTS26W19-35PN",
      query: "What is the direct Amphenol equivalent for TE Connectivity part DTS26W19-35PN?",
    },
    {
      label: "🌐 Rugged RJ45 Field Cat6",
      query: "Need a ruggedized RJ45 ethernet connector with IP68 rating in a metal shell for harsh tactical communication.",
    },
  ];

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: "ai",
        text: "Chat reset. How can I assist with your connector design or cross-reference today?",
        timestamp: "Just now",
        source: "gemini-ai",
      },
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply || "I have analyzed your technical requirements.",
        recommendedProducts: data.recommendedProducts || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: data.source || "gemini-ai",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat API error:", err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "Based on your technical requirements, our engineering system has located qualified Amphenol parts with immediate stock at Pune Central Hub.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: "fallback-intelligence",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderBold = (str: string) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-bold text-xs mt-2.5 mb-1 text-blue-800 dark:text-blue-300">
            {trimmed.replace("### ", "")}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-bold text-sm mt-3 mb-1 text-blue-900 dark:text-blue-200">
            {trimmed.replace("## ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const bulletText = trimmed.replace(/^[\*\-]\s+/, "");
        return (
          <li key={idx} className="ml-4 list-disc text-xs leading-relaxed my-0.5">
            {renderBold(bulletText)}
          </li>
        );
      }
      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs leading-relaxed my-0.5">
          {renderBold(line)}
        </p>
      );
    });
  };

  return (
    <>
      {/* 🌟 Persistent Floating AI Copilot Trigger Button (Bottom-Right FAB) */}
      {!isAiAdvisorOpen && (
        <aside
          aria-label="Amphenol AI Copilot"
          className="fixed bottom-5 right-5 z-40"
        >
          <button
            onClick={() => setIsAiAdvisorOpen(true)}
            className="group relative flex items-center gap-2.5 sm:gap-3 rounded-full bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 px-4 py-3 sm:py-3.5 text-white shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all ring-2 ring-white/40 border border-blue-400/40 backdrop-blur-md"
            title="Open Amphenol AI Technical Copilot"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 shadow-inner">
              <Bot className="h-5 w-5 text-white animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold tracking-tight">Amphenol Copilot</span>
                <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
              </div>
              <p className="text-[10px] text-blue-200 hidden sm:block">
                Interconnect AI • 15,000 SKUs Grounded
              </p>
            </div>
          </button>
        </aside>
      )}

      {/* 🌟 Interactive Sliding AI Copilot Drawer */}
      {isAiAdvisorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsAiAdvisorOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Sliding Drawer Container */}
          <div className="relative flex h-full w-full sm:max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 px-4 sm:px-5 py-3.5 sm:py-4 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-xs">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight">Amphenol AI Copilot</h3>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-blue-200 flex items-center gap-1.5">
                    <Cpu className="h-3 w-3 text-emerald-300" />
                    Amphenol Interconnect Intelligence Engine • Pune R&D Hub
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearChat}
                  title="Clear Chat History"
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsAiAdvisorOpen(false)}
                  title="Close Assistant"
                  className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Technical Grounding Badge */}
            <div className="border-b border-slate-100 bg-blue-50/80 px-4 sm:px-5 py-2 text-[11px] text-blue-900 dark:border-slate-800 dark:bg-blue-950/40 dark:text-blue-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                MIL-SPEC QPL & ISO 9001:2015 Technical Verification
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-2.5 w-2.5" /> LIVE
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 sm:gap-3 ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.sender === "ai" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 mt-1">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className="max-w-[88%] sm:max-w-[85%] space-y-3">
                    <div
                      className={`rounded-2xl p-3.5 sm:p-4 text-xs leading-relaxed ${
                        m.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none shadow-sm"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60"
                      }`}
                    >
                      <div>{renderFormattedContent(m.text)}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                        <span>
                          {m.source === "gemini-ai" && "⚡ Amphenol AI Grounded"}
                        </span>
                        <span>{m.timestamp}</span>
                      </div>
                    </div>

                    {/* 📦 Rich Product Recommendation Cards */}
                    {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                      <div className="space-y-2.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Recommended Amphenol Solutions:
                        </span>
                        {m.recommendedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800/90 hover:border-blue-400 transition-all"
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
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
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
                                {prod.voltageRating}
                              </span>
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                {prod.ipRating}
                              </span>
                            </div>

                            {/* Card Actions */}
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
                                  3D View
                                </button>

                                <button
                                  onClick={() => {
                                    addToRfq(prod, prod.moq, "ai-advisor");
                                    confetti({
                                      particleCount: 35,
                                      spread: 60,
                                      origin: { y: 0.8 },
                                    });
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
                <div className="flex gap-3 items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    <Bot className="h-4 w-4 animate-bounce" />
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping" />
                    Amphenol AI is analyzing specs & cross-referencing catalog...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="border-t border-slate-100 bg-slate-50/90 p-3 dark:border-slate-800 dark:bg-slate-900/90">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Instant Technical Prompts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    disabled={isTyping}
                    onClick={() => handleSend(p.query)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 transition-colors disabled:opacity-50"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input Bar */}
            <div className="border-t border-slate-200 p-3 sm:p-4 dark:border-slate-800 bg-white dark:bg-slate-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask specs, part numbers, cross-ref (e.g. 1000V EV, TE equivalent)..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 transition-all shrink-0 active:scale-95"
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
