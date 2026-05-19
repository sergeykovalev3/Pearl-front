import type { Metadata } from "next";

import { AboutPage } from "@/views/About/AboutPage";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the Pearl team, our philosophy of whole-patient care, and why families trust us for preventive, cosmetic, and restorative dentistry.",
};

export default function About() {
  return <AboutPage />;
}
