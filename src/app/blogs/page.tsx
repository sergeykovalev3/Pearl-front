import type { Metadata } from "next";

import { BlogsPage } from "@/views/Blogs/BlogsPage";

export const metadata: Metadata = {
  title: "Blog & Oral Health Tips",
  description:
    "Practical guides on prevention, cosmetic care, kids’ visits, implants, emergencies, and habits that protect your smile—written for patients, not jargon.",
};

export default function Blogs() {
  return <BlogsPage />;
}
