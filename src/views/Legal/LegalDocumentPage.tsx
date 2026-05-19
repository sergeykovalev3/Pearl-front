import type { LegalSection } from "@/data/legal/types";

import styles from "./LegalDocumentPage.module.scss";

export type LegalDocumentPageProps = {
  title: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export function LegalDocumentPage({
  title,
  effectiveDate,
  sections,
}: LegalDocumentPageProps) {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.shell}`}>
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.meta}>Effective {effectiveDate}</p>
          </header>
          <div className={styles.prose}>
            {sections.map((section, sectionIdx) => {
              const headingId = slugifyForId(section.heading, sectionIdx);
              return (
                <section
                  key={headingId}
                  className={styles.block}
                  aria-labelledby={headingId}
                >
                  <h2 className={styles.h2} id={headingId}>
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx} className={styles.paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </section>
              );
            })}
          </div>
        </article>
      </div>
    </main>
  );
}

function slugifyForId(heading: string, index: number) {
  const base = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "section"}-${index}`;
}
