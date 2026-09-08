"use client";

import React from "react";
import { RfqProvider } from "@/context/RfqContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <RfqProvider>{children}</RfqProvider>;
}
