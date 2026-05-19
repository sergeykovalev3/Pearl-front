import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { ConditionalFooter } from "@/components/ConditionalFooter/ConditionalFooter";
import { SiteHeaderOffsetSyncScript } from "@/components/SiteHeaderOffsetSyncScript/SiteHeaderOffsetSyncScript";
import { Header } from "@/sections/Header/Header";

import "./globals.scss";

const generalSans = localFont({
  src: [
    {
      path: "../fonts/GeneralSans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/GeneralSans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/GeneralSans-Semibold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#222830",
};

export const metadata: Metadata = {
  title: "Pearl",
  description:
    "Pearl Dental Care offers preventive, restorative, cosmetic, and emergency dentistry—with gentle treatment and a calm, patient-first experience.",
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={generalSans.variable}>
      <body suppressHydrationWarning>
        <Header />
        <SiteHeaderOffsetSyncScript />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
