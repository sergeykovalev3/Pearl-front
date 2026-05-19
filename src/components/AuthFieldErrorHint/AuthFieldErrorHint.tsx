"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { ExclamationCircleIcon } from "@/components/Icons/ExclamationCircleIcon/ExclamationCircleIcon";

import styles from "./AuthFieldErrorHint.module.scss";

type AuthFieldErrorHintProps = {
  message: string;
  describedById: string;
  placement?: "field" | "terms";
};

export function AuthFieldErrorHint({
  message,
  describedById,
  placement = "field",
}: AuthFieldErrorHintProps) {
  const [pinned, setPinned] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPinned(false);
  }, [message]);

  useEffect(() => {
    if (!pinned) return;
    const onDocPointerDown = (e: PointerEvent) => {
      const node = rootRef.current;
      if (node && !node.contains(e.target as Node)) {
        setPinned(false);
      }
    };
    document.addEventListener("pointerdown", onDocPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onDocPointerDown, true);
  }, [pinned]);

  useEffect(() => {
    if (!pinned) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinned(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pinned]);

  const onTriggerPointerDown = useCallback((e: ReactPointerEvent) => {
    e.preventDefault();
    setPinned((p) => !p);
  }, []);

  return (
    <>
      <div
        ref={rootRef}
        className={styles.root}
        data-auth-field-hint=""
        data-placement={placement}
        data-pinned={pinned ? "true" : "false"}
        onMouseLeave={() => setPinned(false)}
      >
        <button
          type="button"
          className={styles.trigger}
          tabIndex={-1}
          aria-hidden
          onPointerDown={onTriggerPointerDown}
        >
          <ExclamationCircleIcon size={24} />
        </button>
        <div className={styles.tooltip} aria-hidden>
          {message}
        </div>
      </div>
      <p
        id={describedById}
        className={[
          styles.message,
          placement === "terms" ? styles.messageTerms : styles.messageField,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {message}
      </p>
    </>
  );
}
