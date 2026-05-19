"use client";

import type {
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
} from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import styles from "./ButtonBlue.module.scss";

function isInternalAppHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export type ButtonBlueLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

export type ButtonBlueButtonProps = {
  href?: never;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type ButtonBlueProps = ButtonBlueLinkProps | ButtonBlueButtonProps;

function useShineWhenInView() {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOn(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, on };
}

export function ButtonBlue(props: ButtonBlueProps) {
  const { ref, on } = useShineWhenInView();
  const shineClass = on ? styles.rootShineOn : "";

  if ("href" in props) {
    const { href, children, className, ...rest } = props as ButtonBlueLinkProps;
    const rootClass = [styles.root, shineClass, className]
      .filter(Boolean)
      .join(" ");
    if (isInternalAppHref(href)) {
      return (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={rootClass}
          {...rest}
        >
          <span className={styles.shine} aria-hidden />
          <span className={styles.label}>{children}</span>
        </Link>
      );
    }
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={rootClass}
        {...rest}
      >
        <span className={styles.shine} aria-hidden />
        <span className={styles.label}>{children}</span>
      </a>
    );
  }

  const {
    children,
    className,
    type = "button",
    ...rest
  } = props as ButtonBlueButtonProps;
  const rootClass = [styles.root, shineClass, className].filter(Boolean).join(" ");
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      className={rootClass}
      {...rest}
    >
      <span className={styles.shine} aria-hidden />
      <span className={styles.label}>{children}</span>
    </button>
  );
}
