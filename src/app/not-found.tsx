import Link from "next/link";

import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";

import styles from "./systemPages.module.scss";

export default function NotFound() {
  return (
    <main className={styles.main} aria-labelledby="not-found-heading">
      <div className={`container ${styles.inner}`}>
        <p className={styles.code} aria-hidden>
          404
        </p>
        <h1 id="not-found-heading" className={styles.title}>
          This page could not be found
        </h1>
        <p className={styles.description}>
          The address may be mistyped, or the page may have moved. Head back
          home or reach out and we will help you find what you need.
        </p>
        <div className={styles.actions}>
          <ButtonBlue href="/">Back to home</ButtonBlue>
          <Link href="/contact" className={styles.secondaryLink}>
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
