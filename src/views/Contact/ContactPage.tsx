import { contactFaqItems } from "@/data/faqs/contact";
import { ContactIntro } from "@/sections/ContactIntro/ContactIntro";
import { Faq } from "@/sections/Faq/Faq";

import styles from "./ContactPage.module.scss";

export function ContactPage() {
  return (
    <main className={styles.page}>
      <ContactIntro />
      <Faq
        id="faq"
        detailsName="faq-contact"
        items={contactFaqItems}
        titleBefore=""
        titleHighlight="Frequently Asked Questions"
        description="Practical guidance for reaching Pearl, appointments, urgent needs, and how we respond to inquiries."
        align="center"
      />
    </main>
  );
}
