"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CATALOG_PRODUCTS } from "@/data/catalog";

export interface RfqItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  source: "catalog" | "configurator" | "bom" | "ai-advisor";
  notes?: string;
}

interface RfqContextType {
  items: RfqItem[];
  addToRfq: (product: Product, quantity?: number, source?: RfqItem["source"], notes?: string) => void;
  removeFromRfq: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearRfq: () => void;
  totalQuantity: number;
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  isRfqOpen: boolean;
  setIsRfqOpen: (open: boolean) => void;
  isAiAdvisorOpen: boolean;
  setIsAiAdvisorOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  activeTab: "overview" | "catalog" | "configurator" | "bom";
  setActiveTab: (tab: "overview" | "catalog" | "configurator" | "bom") => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  compareProducts: Product[];
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutProduct: { product: Product; quantity: number } | null;
  startDirectCheckout: (product?: Product, quantity?: number) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;
  openTracking: (orderId?: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  crmToast: string | null;
  triggerCrmToast: (msg: string) => void;
}

const RfqContext = createContext<RfqContextType | undefined>(undefined);

export function RfqProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<RfqItem[]>([]);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<{ product: Product; quantity: number } | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState("AMP-ORD-2026-9841");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [crmToast, setCrmToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "catalog" | "configurator" | "bom">("overview");

  const triggerCrmToast = (msg: string) => {
    setCrmToast(msg);
    setTimeout(() => {
      setCrmToast(null);
    }, 4500);
  };

  const openTracking = (orderId?: string) => {
    if (orderId) setTrackingOrderId(orderId);
    setIsTrackingOpen(true);
  };

  const startDirectCheckout = (product?: Product, quantity?: number) => {
    if (product) {
      setCheckoutProduct({ product, quantity: quantity || product.moq });
    } else {
      setCheckoutProduct(null);
    }
    setIsCheckoutOpen(true);
  };

  const toggleCompare = (product: Product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id || p.mpn === product.mpn);
      if (exists) {
        return prev.filter((p) => p.id !== product.id && p.mpn !== product.mpn);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const clearCompare = () => {
    setCompareProducts([]);
    setIsCompareModalOpen(false);
  };

  // Initialize with a default demo item so the RFQ modal shows realistic data immediately
  useEffect(() => {
    const defaultProduct = CATALOG_PRODUCTS[0];
    if (defaultProduct) {
      setItems([
        {
          id: "init-item-1",
          product: defaultProduct,
          quantity: 25,
          unitPrice: 2420,
          source: "catalog",
        },
      ]);
    }
  }, []);

  const calculateUnitPrice = (product: Product, qty: number): number => {
    // Find best tier price
    let unit = product.priceTiers[0].price;
    for (const tier of product.priceTiers) {
      if (qty >= tier.qty) {
        unit = tier.price;
      }
    }
    return unit;
  };

  const addToRfq = (
    product: Product,
    quantity = 10,
    source: RfqItem["source"] = "catalog",
    notes?: string
  ) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.mpn === product.mpn);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const newPrice = calculateUnitPrice(product, newQty);
        return prev.map((i) =>
          i.product.mpn === product.mpn
            ? { ...i, quantity: newQty, unitPrice: newPrice }
            : i
        );
      } else {
        const unit = calculateUnitPrice(product, quantity);
        return [
          ...prev,
          {
            id: `rfq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            product,
            quantity,
            unitPrice: unit,
            source,
            notes,
          },
        ];
      }
    });
    triggerCrmToast(`Synced to Pune Central CRM • Lead ID: #RFQ-2026-${Math.floor(100 + Math.random() * 900)}`);
  };

  const removeFromRfq = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromRfq(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newUnit = calculateUnitPrice(i.product, qty);
          return { ...i, quantity: qty, unitPrice: newUnit };
        }
        return i;
      })
    );
  };

  const clearRfq = () => setItems([]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const gstAmount = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gstAmount;

  return (
    <RfqContext.Provider
      value={{
        items,
        addToRfq,
        removeFromRfq,
        updateQuantity,
        clearRfq,
        totalQuantity,
        subtotal,
        gstAmount,
        grandTotal,
        isRfqOpen,
        setIsRfqOpen,
        isAiAdvisorOpen,
        setIsAiAdvisorOpen,
        isSearchOpen,
        setIsSearchOpen,
        activeTab,
        setActiveTab,
        quickViewProduct,
        setQuickViewProduct,
        compareProducts,
        toggleCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutProduct,
        startDirectCheckout,
        isTrackingOpen,
        setIsTrackingOpen,
        trackingOrderId,
        setTrackingOrderId,
        openTracking,
        isAdminOpen,
        setIsAdminOpen,
        crmToast,
        triggerCrmToast,
      }}
    >
      {/* 🚀 Global Floating CRM Telemetry Notification Banner */}
      {crmToast && (
        <div className="fixed top-14 right-4 sm:right-8 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 rounded-xl border border-blue-400/40 bg-slate-900/95 text-white px-4 py-2.5 shadow-2xl backdrop-blur-md text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-blue-300">⚡ Live Telemetry:</span>
            <span className="font-medium text-slate-200">{crmToast}</span>
          </div>
        </div>
      )}
      {children}
    </RfqContext.Provider>
  );
}

export function useRfq() {
  const context = useContext(RfqContext);
  if (!context) {
    throw new Error("useRfq must be used within an RfqProvider");
  }
  return context;
}
