import type { Metadata } from "next";

import { HomePage } from "@/views/Home/HomePage";

export const metadata: Metadata = {
  title: "Pearl",
  description:
    "Modern dental clinic for preventive, restorative, and cosmetic care. Book a visit—experienced clinicians, thoughtful communication, gentle hands.",
};

export default function Home() {
  return <HomePage />;
}
