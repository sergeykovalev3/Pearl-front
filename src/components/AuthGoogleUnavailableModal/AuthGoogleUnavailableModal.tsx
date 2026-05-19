"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { acquireDocumentScrollLock } from "@/lib/documentScrollLock";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

import styles from "./AuthGoogleUnavailableModal.module.scss";

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const DEFAULT_TITLE = "Google sign-in unavailable";
const DEFAULT_BODY =
  "Google authentication is not yet available. This option will be enabled in a forthcoming update.";

type AuthGoogleUnavailableModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  body?: string;
};

export function AuthGoogleUnavailableModal({
  open,
  onClose,
  title = DEFAULT_TITLE,
  body = DEFAULT_BODY,
}: AuthGoogleUnavailableModalProps) {
  const reduceMotion = usePrefersReducedMotion();
  const layerKey = useId();
  const titleId = useId();
  const bodyId = useId();
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    return acquireDocumentScrollLock();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    prevFocusRef.current = document.activeElement as HTMLElement | null;

    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      prevFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  const backdropMotion = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.28, ease: revealEase },
      };

  const panelMotion = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: 8 },
        transition: { duration: 0.34, ease: revealEase },
      };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className={styles.layer} role="presentation">
          <motion.button
            key={`${layerKey}-backdrop`}
            type="button"
            className={styles.backdrop}
            aria-hidden
            tabIndex={-1}
            {...backdropMotion}
            onClick={onClose}
          />
          <motion.div
            key={`${layerKey}-panel`}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            className={styles.panel}
            {...panelMotion}
          >
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <p id={bodyId} className={styles.body}>
              {body}
            </p>
            <ButtonBlue
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
            >
              Close
            </ButtonBlue>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
