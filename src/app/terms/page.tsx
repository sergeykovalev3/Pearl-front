import type { Metadata } from "next";

import { termsEffectiveDate, termsSections } from "@/data/legal/termsOfUse";
import { LegalDocumentPage } from "@/views/Legal/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing use of Pearl Dental Care’s website, patient account, scheduling tools, and online services.",
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title="Terms of Use"
      effectiveDate={termsEffectiveDate}
      sections={termsSections}
    />
  );
}
