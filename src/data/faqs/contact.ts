import type { FaqItem } from "@/data/faqs/types";

export const contactFaqItems: FaqItem[] = [
  {
    id: "contact-booking",
    question: "What is the best way to schedule an appointment?",
    answer:
      "Call the clinic or use the scheduling options on this site. Share your preferred days and whether you need a preventive visit or have a concern you would like evaluated. Our team will propose times that fit you and summarize what to expect next.",
  },
  {
    id: "contact-response",
    question: "How quickly will someone respond to my message?",
    answer:
      "We aim to reply during posted business hours, often within the same day for routine inquiries. Requests sent after hours are reviewed on the next business day. Add a brief description of what you need so we can route your message appropriately.",
  },
  {
    id: "contact-first-visit-info",
    question: "What information should I have ready before I reach out?",
    answer:
      "Have contact details handy, describe any symptoms briefly, mention insurance if you plan to use it, and note any medications or medical conditions relevant to dentistry. Prior imaging or correspondence from another office can speed things up.",
  },
  {
    id: "contact-insurance",
    question: "Can I confirm insurance or financing through contact?",
    answer:
      "Yes. Provide your carrier and member information when we ask. We can summarize typical coverage questions and estimates with the caveat that carrier decisions are finalized when benefits run. Financing questions can be routed the same way.",
  },
  {
    id: "contact-emergency",
    question: "What if I need urgent dental help?",
    answer:
      "Call us first so we can triage severity and advise next steps or same-day scheduling. Severe swelling, bleeding you cannot control, trauma to the jaws or teeth, fever with facial infection, or trouble breathing warrants emergency medical care.",
  },
  {
    id: "contact-privacy",
    question: "How is my information handled when I contact Pearl?",
    answer:
      "Messages are used solely to coordinate care and follow HIPAA-aligned practices appropriate to our workflows. Limit sensitive clinical detail to what is relevant. If you prefer, call the office for topics you do not want to put in writing online.",
  },
];
