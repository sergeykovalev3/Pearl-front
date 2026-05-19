"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useId, useState, useSyncExternalStore } from "react";

import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { PhoneOutlineIcon } from "@/components/Icons/PhoneOutlineIcon/PhoneOutlineIcon";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";
import { submitMarketingLead } from "@/lib/submitMarketingLead";
import {
  formatUsPhoneMask,
  isCompleteUsPhone,
  takeUsPhoneDigits,
} from "@/lib/usPhone";

import { BP_MIN_TABLET } from "@/styles/breakpoints";

import styles from "./PatientWelcome.module.scss";

function subscribeReducedMotion(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", listener);
  return () => mq.removeEventListener("change", listener);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const textClipBleedRevealStart = "inset(-14px 100% -48px -4px)" as const;
const textClipBleedRevealEnd = "inset(-14px -4px -48px -4px)" as const;

export function PatientWelcome() {
  const reduceMotion = usePrefersReducedMotion();
  const phoneFieldId = useId();
  const errorId = `${phoneFieldId}-error`;
  const submitErrorId = `${phoneFieldId}-submit-error`;
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedOk, setSubmittedOk] = useState(false);

  const onPhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const digits = takeUsPhoneDigits(e.target.value);
    setPhoneDisplay(formatUsPhoneMask(digits));
    setValidationError(null);
    setSubmitError(null);
  }, []);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError(null);
      const input = e.currentTarget.querySelector<HTMLInputElement>(
        'input[name="phone"]',
      );
      const raw = input?.value ?? phoneDisplay;
      const digits = takeUsPhoneDigits(raw);
      if (!isCompleteUsPhone(digits)) {
        setValidationError("Enter a valid 10-digit US phone number.");
        setPhoneDisplay(formatUsPhoneMask(digits));
        return;
      }
      setValidationError(null);
      const result = await submitMarketingLead({
        source: "patient-welcome",
        phone: `+1${digits}`,
      });
      if (result.ok) {
        setSubmittedOk(true);
        setPhoneDisplay("");
        return;
      }
      const phoneFieldErrors = result.fields?.phone;
      const firstPhoneErr =
        Array.isArray(phoneFieldErrors) &&
        typeof phoneFieldErrors[0] === "string"
          ? phoneFieldErrors[0]
          : undefined;
      if (firstPhoneErr) {
        setValidationError(firstPhoneErr);
        return;
      }
      setSubmitError(result.message);
    },
    [phoneDisplay],
  );

  const wrapOrchestration = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.06,
          },
        },
      };

  const infoOrchestration = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.03,
          },
        },
      };

  const headingClipReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.76, clipPath: textClipBleedRevealStart },
        visible: {
          opacity: [0.76, 1],
          clipPath: [textClipBleedRevealStart, textClipBleedRevealEnd],
          transition: { duration: 0.82, ease: revealEase },
        },
      };

  const leadClipReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: revealEase },
        },
      };

  const formReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.62, ease: revealEase },
        },
      };

  const imageReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, x: 44, scale: 0.985 },
        visible: {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: { duration: 0.76, ease: revealEase },
        },
      };

  const inViewReveal = reduceMotion
    ? undefined
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.22, margin: "0px 0px -12% 0px" },
      };

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <motion.div
          className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
          {...(wrapOrchestration && inViewReveal
            ? { variants: wrapOrchestration, ...inViewReveal }
            : {})}
        >
          <motion.div
            className={`${styles.info} ${MOTION_COMPOSITE}`}
            {...(infoOrchestration ? { variants: infoOrchestration } : {})}
          >
            <HeadingLead
              titleBefore="We’re"
              titleHighlight="welcoming"
              titleAfter="new patients and can’t wait to meet you."
              description="Expect a warm onboarding, jargon-free explanations, and a roadmap that respects your timeline—tell us what you need and we’ll handle every reassuring detail from here."
              headingMotionVariants={headingClipReveal}
              descriptionMotionVariants={leadClipReveal}
            />
            <motion.div
              className={`${styles.formSlot} ${MOTION_COMPOSITE}`}
              {...(formReveal ? { variants: formReveal } : {})}
            >
              <div
                className={submittedOk ? styles.formLayerHidden : undefined}
                inert={submittedOk ? true : undefined}
              >
                <form
                  action="#"
                  className={styles.form}
                  onSubmit={onSubmit}
                  noValidate
                >
                  {submitError ? (
                    <p
                      id={submitErrorId}
                      className={styles.submitError}
                      role="alert"
                    >
                      {submitError}
                    </p>
                  ) : null}
                  <div className={styles.formRow}>
                    <div className={styles.formFields}>
                      <div className={styles.fieldStack}>
                        <div
                          className={[
                            styles.field,
                            validationError ? styles.fieldInvalid : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <PhoneOutlineIcon
                            className={styles.fieldIcon}
                            size={24}
                          />
                          <input
                            id={phoneFieldId}
                            type="tel"
                            name="phone"
                            autoComplete="tel"
                            inputMode="numeric"
                            placeholder="(555) 123-4567"
                            className={styles.fieldInput}
                            value={phoneDisplay}
                            onChange={onPhoneChange}
                            aria-invalid={validationError ? true : undefined}
                            aria-describedby={
                              [
                                validationError ? errorId : null,
                                submitError ? submitErrorId : null,
                              ]
                                .filter(Boolean)
                                .join(" ") || undefined
                            }
                            aria-label="Phone number"
                          />
                        </div>
                        {validationError ? (
                          <p
                            id={errorId}
                            className={styles.fieldError}
                            role="alert"
                          >
                            {validationError}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <button type="submit" className={styles.fieldButton}>
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              {submittedOk ? (
                <div className={styles.successOverlay}>
                  <div
                    className={styles.formSuccess}
                    role="status"
                    aria-live="polite"
                  >
                    <span className={styles.formSuccessIcon} aria-hidden>
                      ✓
                    </span>
                    <p className={styles.formSuccessText}>
                      We will contact you shortly.
                    </p>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
          <motion.div
            className={`${styles.image} ${MOTION_COMPOSITE}`}
            {...(imageReveal ? { variants: imageReveal } : {})}
          >
            <Image
              className={styles.imagePhoto}
              src="/images/home/patientWelcome/image.jpg"
              alt="Patient Welcome"
              width={413}
              height={362}
              sizes={`(max-width: ${BP_MIN_TABLET}) min(92vw, 413px), 413px`}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
