import type { Metadata } from "next";

import { RegisterPage } from "@/views/Register/RegisterPage";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a Pearl Dental Care account to book visits, save contact details, and track appointment requests securely.",
};

export default function Register() {
  return <RegisterPage />;
}
