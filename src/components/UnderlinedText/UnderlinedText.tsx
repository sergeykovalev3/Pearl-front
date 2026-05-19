import { Fragment, type ReactNode } from "react";

import styles from "./UnderlinedText.module.scss";

const TEXT_UNDERLINE_SRC = "/images/global/text-underline.svg";

export type UnderlinedTextProps = {
  children: ReactNode;
  className?: string;
  /** When `true` and `children` is a string, only the last word is wrapped (underline stays on the bottom line). Default `true`. */
  lastWordOnly?: boolean;
};

function splitTrailingWord(
  source: string,
): { lead: string; last: string } | null {
  const trimmed = source.trim();
  const i = trimmed.lastIndexOf(" ");
  if (i <= 0) return null;

  const bounded = trimmed.slice(0, i + 1);
  const lastSegment = trimmed.slice(i + 1);
  const start = source.indexOf(trimmed);
  if (start < 0) {
    return { lead: bounded, last: lastSegment };
  }
  const lead = source.slice(0, start + bounded.length);

  return { lead, last: lastSegment };
}

function DecorativeSpan({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootClass = [styles.root, className].filter(Boolean).join(" ");

  return (
    <span className={rootClass}>
      <span className={styles.text}>{children}</span>
      <span className={styles.underline} aria-hidden="true">
        <img
          className={styles.underlineImg}
          src={TEXT_UNDERLINE_SRC}
          alt=""
          decoding="async"
          draggable={false}
        />
      </span>
    </span>
  );
}

export function UnderlinedText({
  children,
  className,
  lastWordOnly = true,
}: UnderlinedTextProps) {
  if (!lastWordOnly || typeof children !== "string") {
    return <DecorativeSpan className={className}>{children}</DecorativeSpan>;
  }

  const parts = splitTrailingWord(children);

  if (!parts) {
    return <DecorativeSpan className={className}>{children}</DecorativeSpan>;
  }

  return (
    <Fragment>
      {parts.lead}
      <DecorativeSpan className={className}>{parts.last}</DecorativeSpan>
    </Fragment>
  );
}
