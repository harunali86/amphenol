"use client";

import React from "react";
import { useRfq } from "@/context/RfqContext";
import { Navbar } from "@/components/Navbar";
import { ExecutiveOverview } from "@/components/ExecutiveOverview";
import { CatalogView } from "@/components/CatalogView";
import { ConnectorConfigurator } from "@/components/ConnectorConfigurator";
import { BomImporter } from "@/components/BomImporter";
import { SearchModal } from "@/components/SearchModal";
import { AiAdvisorDrawer } from "@/components/AiAdvisorDrawer";
import { RfqModal } from "@/components/RfqModal";
import { ProductQuickViewModal } from "@/components/ProductQuickViewModal";
import { ProductCompareDock } from "@/components/ProductCompareDock";
import { ProductCompareModal } from "@/components/ProductCompareModal";
import { DirectCheckoutModal } from "@/components/DirectCheckoutModal";
import { OrderTrackingModal } from "@/components/OrderTrackingModal";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const { activeTab } = useRfq();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Global Header */}
      <Navbar />

      {/* Main Interactive Stage */}
      <main className="flex-1 mx-auto w-full max-w-[1850px] px-2 sm:px-4 lg:px-6 py-5">
        {activeTab === "overview" && <ExecutiveOverview />}
        {activeTab === "catalog" && <CatalogView />}
        {activeTab === "configurator" && <ConnectorConfigurator />}
        {activeTab === "bom" && <BomImporter />}
      </main>

      {/* Global Dialog Modals & Drawers */}
      <SearchModal />
      <AiAdvisorDrawer />
      <RfqModal />
      <ProductQuickViewModal />
      <ProductCompareModal />
      <ProductCompareDock />
      <DirectCheckoutModal />
      <OrderTrackingModal />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
