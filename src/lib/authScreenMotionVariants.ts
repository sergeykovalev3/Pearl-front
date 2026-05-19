import type { Variants } from "motion/react";

export const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const textClipBleedRevealStart = "inset(-14px 100% -48px -4px)" as const;
export const textClipBleedRevealEnd = "inset(-14px -4px -48px -4px)" as const;

export type AuthScreenMotionVariants = {
  shellOrchestration: Variants | undefined;
  visualColumnOrchestration: Variants | undefined;
  imageReveal: Variants | undefined;
  quoteOrchestration: Variants | undefined;
  headingClipReveal: Variants | undefined;
  leadClipReveal: Variants | undefined;
  panelReveal: Variants | undefined;
  panelInnerOrchestration: Variants | undefined;
  blockReveal: Variants | undefined;
  inViewReveal:
    | {
        initial: "hidden";
        whileInView: "visible";
        viewport: {
          once: boolean;
          amount: number;
          margin: string;
        };
      }
    | undefined;
};

export function getAuthScreenMotionVariants(
  reduceMotion: boolean,
): AuthScreenMotionVariants {
  if (reduceMotion) {
    return {
      shellOrchestration: undefined,
      visualColumnOrchestration: undefined,
      imageReveal: undefined,
      quoteOrchestration: undefined,
      headingClipReveal: undefined,
      leadClipReveal: undefined,
      panelReveal: undefined,
      panelInnerOrchestration: undefined,
      blockReveal: undefined,
      inViewReveal: undefined,
    };
  }

  return {
    shellOrchestration: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.14,
          delayChildren: 0.05,
        },
      },
    },
    visualColumnOrchestration: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.16,
          delayChildren: 0.04,
        },
      },
    },
    imageReveal: {
      hidden: { opacity: 0, x: -36, scale: 0.986 },
      visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.82, ease: revealEase },
      },
    },
    quoteOrchestration: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.11,
          delayChildren: 0.12,
        },
      },
    },
    headingClipReveal: {
      hidden: { opacity: 0.76, clipPath: textClipBleedRevealStart },
      visible: {
        opacity: [0.76, 1],
        clipPath: [textClipBleedRevealStart, textClipBleedRevealEnd],
        transition: { duration: 0.82, ease: revealEase },
      },
    },
    leadClipReveal: {
      // No translateY: it inflates the scrollable overflow box while overflow-y is
      // auto on small screens, which flashes a scrollbar for the animation duration.
      hidden: { opacity: 0, y: 0 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: revealEase },
      },
    },
    panelReveal: {
      hidden: { opacity: 0, x: 0 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: revealEase },
      },
    },
    panelInnerOrchestration: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.085,
          delayChildren: 0.06,
        },
      },
    },
    blockReveal: {
      hidden: { opacity: 0, y: 0 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.62, ease: revealEase },
      },
    },
    inViewReveal: {
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true, amount: 0.18, margin: "0px 0px -8% 0px" },
    },
  };
}
