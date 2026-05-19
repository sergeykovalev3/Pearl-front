"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { UnderlinedText } from "@/components/UnderlinedText/UnderlinedText";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";

import styles from "./HeadingLead.module.scss";

export type HeadingLeadProps = {
  titleBefore: ReactNode;
  titleHighlight: ReactNode;
  titleAfter?: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2";
  align?: "start" | "center";
  layout?: "default" | "fragment";
  className?: string;
  headingClassName?: string;
  descriptionClassName?: string;
  headingMotionVariants?: Variants;
  descriptionMotionVariants?: Variants;
  underlineLastWordOnly?: boolean;
};

export function HeadingLead({
  titleBefore,
  titleHighlight,
  titleAfter,
  description,
  as = "h2",
  align = "start",
  layout: layoutProp = "default",
  className,
  headingClassName,
  descriptionClassName,
  headingMotionVariants,
  descriptionMotionVariants,
  underlineLastWordOnly,
}: HeadingLeadProps) {
  const isFragment = layoutProp === "fragment";

  const showDescription =
    description != null && description !== "";

  const rootClass = [styles.root, styles[`align${align}`], className]
    .filter(Boolean)
    .join(" ");

  const titleClassName = [
    styles.title,
    as === "h1" ? styles.titleAsH1 : null,
    isFragment ? styles[`textAlign${align}`] : null,
    headingClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const descriptionBase =
    isFragment && descriptionClassName ? null : styles.description;

  const descriptionClassNameMerged = [
    descriptionBase,
    isFragment ? styles[`textAlign${align}`] : null,
    descriptionClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const useMotionBundle =
    !isFragment &&
    (headingMotionVariants != null || descriptionMotionVariants != null);

  const bundleVariants =
    headingMotionVariants != null || descriptionMotionVariants != null
      ? ({
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.085,
              delayChildren: 0.015,
            },
          },
        } satisfies Variants)
      : undefined;

  const titleInner = (
    <>
      {titleBefore != null && titleBefore !== "" ? (
        <>
          {titleBefore}{" "}
        </>
      ) : null}
      <UnderlinedText lastWordOnly={underlineLastWordOnly ?? true}>
        {titleHighlight}
      </UnderlinedText>
      {titleAfter != null && titleAfter !== "" ? <> {titleAfter}</> : null}
    </>
  );

  const MotionHeading = as === "h1" ? motion.h1 : motion.h2;

  const titleEl =
    headingMotionVariants != null ? (
      <MotionHeading
        className={[titleClassName, MOTION_COMPOSITE].filter(Boolean).join(" ")}
        variants={headingMotionVariants}
      >
        {titleInner}
      </MotionHeading>
    ) : as === "h1" ? (
      <h1 className={titleClassName}>{titleInner}</h1>
    ) : (
      <h2 className={titleClassName}>{titleInner}</h2>
    );

  const descriptionEl = showDescription ? (
    descriptionMotionVariants != null ? (
      <motion.p
        className={[descriptionClassNameMerged, MOTION_COMPOSITE]
          .filter(Boolean)
          .join(" ")}
        variants={descriptionMotionVariants}
      >
        {description}
      </motion.p>
    ) : (
      <p className={descriptionClassNameMerged}>{description}</p>
    )
  ) : null;

  if (isFragment) {
    return (
      <>
        {titleEl}
        {descriptionEl}
      </>
    );
  }

  if (useMotionBundle) {
    return (
      <motion.div
        className={[rootClass, MOTION_COMPOSITE].filter(Boolean).join(" ")}
        variants={bundleVariants}
      >
        {titleEl}
        {descriptionEl}
      </motion.div>
    );
  }

  return (
    <div className={rootClass}>
      {titleEl}
      {descriptionEl}
    </div>
  );
}
