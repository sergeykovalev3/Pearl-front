import type { Metadata } from "next";

import { LoginPage } from "@/views/Login/LoginPage";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Sign in to your Pearl Dental Care account to view appointments and profile details.",
};

export default function Login() {
  return <LoginPage />;
}
