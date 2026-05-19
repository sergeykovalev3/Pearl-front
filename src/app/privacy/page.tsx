import type { Metadata } from "next";

import {
  privacyEffectiveDate,
  privacySections,
} from "@/data/legal/privacyPolicy";
import { LegalDocumentPage } from "@/views/Legal/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Pearl Dental Care collects, uses, and protects personal and health-related information across our digital services.",
};

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      effectiveDate={privacyEffectiveDate}
      sections={privacySections}
    />
  );
}
