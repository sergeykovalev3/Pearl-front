import { AboutIntro } from "@/sections/AboutIntro/AboutIntro";
import { AboutSpecialists } from "@/sections/AboutSpecialists/AboutSpecialists";
import { LatestTechnology } from "@/sections/LatestTechnology/LatestTechnology";
import { HomeServices } from "@/sections/HomeServices/HomeServices";
import { WelcomeVideo } from "@/sections/WelcomeVideo/WelcomeVideo";

import styles from "./AboutPage.module.scss";

export function AboutPage() {
  return (
    <main className={styles.page}>
      <AboutIntro />
      <AboutSpecialists />
      <LatestTechnology />
      <HomeServices />
      <WelcomeVideo />
    </main>
  );
}
