import { blogsFaqItems } from "@/data/faqs/blogs";
import { BlogsIntro } from "@/sections/BlogsIntro/BlogsIntro";
import { Faq } from "@/sections/Faq/Faq";
import { WelcomeVideo } from "@/sections/WelcomeVideo/WelcomeVideo";
import { GameChanger } from "@/sections/GameChanger/GameChanger";
import styles from "./BlogsPage.module.scss";

export function BlogsPage() {
  return (
    <main className={styles.page}>
      <BlogsIntro />
      <WelcomeVideo />
      <Faq
        id="faq"
        detailsName="faq-blogs"
        items={blogsFaqItems}
        titleBefore=""
        titleHighlight="Frequently Asked Questions"
        description="Straightforward answers about how we use this blog and how it fits into your care at Pearl."
        align="center"
      />
      <GameChanger />
    </main>
  );
}
