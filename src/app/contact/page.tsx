import type { Metadata } from "next";

import { ContactPage } from "@/views/Contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact & Appointments",
  description:
    "Request an appointment, send a message, or find Pearl Dental Care—hours, phone, and directions in one place.",
};

export default function Contact() {
  return <ContactPage />;
}
