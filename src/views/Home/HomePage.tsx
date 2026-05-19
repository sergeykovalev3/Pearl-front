import { HomeIntro } from "@/sections/HomeIntro/HomeIntro";
import { HomeServices } from "@/sections/HomeServices/HomeServices";
import { PatientWelcome } from "@/sections/PatientWelcome/PatientWelcome";
import { WhyChooseUs } from "@/sections/WhyChooseUs/WhyChooseUs";
import { SmilePromise } from "@/sections/SmilePromise/SmilePromise";
import { WelcomeVideo } from "@/sections/WelcomeVideo/WelcomeVideo";
import { OurSpecialists } from "@/sections/OurSpecialists/OurSpecialists";
import { Reviews } from "@/sections/Reviews/Reviews";
import { HomeNewsArticles } from "@/sections/HomeNewsArticles/HomeNewsArticles";
import { Faq } from "@/sections/Faq/Faq";
import { GameChanger } from "@/sections/GameChanger/GameChanger";

import { homeFaqItems } from "@/data/faqs/home";
import styles from "./HomePage.module.scss";

export function HomePage() {
  return (
    <div className={styles.page}>
      <HomeIntro />
      <HomeServices />
      <PatientWelcome />
      <WhyChooseUs />
      <SmilePromise />
      <WelcomeVideo />
      <OurSpecialists />
      <Reviews />
      <HomeNewsArticles />
      <Faq
        id="faq"
        detailsName="faq-home"
        items={homeFaqItems}
        titleBefore=""
        titleHighlight="Frequently Ask Question"
        description="Browse practical answers spanning visits, emergencies, paperwork, budgeting, and aftercare—we wrote each response for people scanning from their phones."
        align="center"
      />
      <GameChanger />
    </div>
  );
}
