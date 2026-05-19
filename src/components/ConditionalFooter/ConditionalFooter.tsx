"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/sections/Footer/Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/register" || pathname === "/login") return null;
  return <Footer />;
}
