import { servicesFaqItems } from "@/data/faqs/services";
import { CareContact } from "@/sections/CareContact/CareContact";
import { Faq } from "@/sections/Faq/Faq";
import { ServicesIntro } from "@/sections/ServicesIntro/ServicesIntro";
import { WelcomeVideo } from "@/sections/WelcomeVideo/WelcomeVideo";
import { OurSpecialists } from "@/sections/OurSpecialists/OurSpecialists";
import { GameChanger } from "@/sections/GameChanger/GameChanger";

import styles from "./ServicesPage.module.scss";

export function ServicesPage() {
  return (
    <main className={styles.page}>
      <ServicesIntro />
      <CareContact />
      <WelcomeVideo />
      <OurSpecialists />
      <Faq
        id="faq"
        detailsName="faq-services"
        items={servicesFaqItems}
        titleBefore=""
        titleHighlight="Frequently Ask Question"
        description="Clear answers about our treatments, comfort, and how to plan your care."
        align="center"
      />
      <GameChanger />
    </main>
  );
}
