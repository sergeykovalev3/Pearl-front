"use client";

import { useEffect } from "react";
import Link from "next/link";

import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";

import styles from "./systemPages.module.scss";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.main} aria-labelledby="error-heading">
      <div className={`container ${styles.inner}`}>
        <p className={styles.code} aria-hidden>
          !
        </p>
        <h1 id="error-heading" className={styles.title}>
          Something went wrong
        </h1>
        <p className={styles.description}>
          We hit an unexpected issue loading this page. You can try again, or
          return home while we get things back on track.
        </p>
        <div className={styles.actions}>
          <ButtonBlue type="button" onClick={() => reset()}>
            Try again
          </ButtonBlue>
          <Link href="/" className={styles.secondaryLink}>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
