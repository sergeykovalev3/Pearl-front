import type { Metadata } from "next";

import { ServicesPage } from "@/views/Services/ServicesPage";

export const metadata: Metadata = {
  title: "Dental Services",
  description:
    "From prevention and hygiene to implants, cosmetic smile design, endodontics, whitening, and emergencies—explore care options at Pearl Dental Care.",
};

export default function Services() {
  return <ServicesPage />;
}
