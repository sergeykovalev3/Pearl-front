"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useId, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";

import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { isValidEmail, sanitizeEmailInput } from "@/lib/emailValidation";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";
import { submitMarketingLead } from "@/lib/submitMarketingLead";
import {
  formatUsPhoneMask,
  isCompleteUsPhone,
  takeUsPhoneDigits,
} from "@/lib/usPhone";

import styles from "./CareContact.module.scss";

const NAME_MAX_LEN = 100;
const EMAIL_MAX_LEN = 128;
const PHONE_INPUT_MAX_LEN = 14;

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

export function CareContact() {
  const reduceMotion = usePrefersReducedMotion();
  const baseId = useId();
  const nameErrorId = `${baseId}-name-error`;
  const phoneErrorId = `${baseId}-phone-error`;
  const emailErrorId = `${baseId}-email-error`;
  const submitErrorId = `${baseId}-submit-error`;

  const [name, setName] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedOk, setSubmittedOk] = useState(false);

  const onNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.slice(0, NAME_MAX_LEN));
    setNameError(null);
    setSubmitError(null);
    setSubmittedOk(false);
  }, []);

  const onPhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const digits = takeUsPhoneDigits(e.target.value);
    setPhoneDisplay(formatUsPhoneMask(digits));
    setPhoneError(null);
    setSubmitError(null);
    setSubmittedOk(false);
  }, []);

  const onEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(sanitizeEmailInput(e.target.value).slice(0, EMAIL_MAX_LEN));
    setEmailError(null);
    setSubmitError(null);
    setSubmittedOk(false);
  }, []);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError(null);
      setSubmittedOk(false);

      const trimmedName = name.trim();
      const digits = takeUsPhoneDigits(phoneDisplay);

      const nextNameError = trimmedName
        ? null
        : "Please enter your full name.";
      const nextPhoneError = isCompleteUsPhone(digits)
        ? null
        : "Enter a valid 10-digit US phone number.";
      const nextEmailError = isValidEmail(email)
        ? null
        : "Enter a valid email address.";

      setNameError(nextNameError);
      setPhoneError(nextPhoneError);
      setEmailError(nextEmailError);
      setPhoneDisplay(formatUsPhoneMask(digits));

      if (nextNameError || nextPhoneError || nextEmailError) {
        return;
      }

      const result = await submitMarketingLead({
        source: "care-contact",
        name: trimmedName,
        phone: `+1${digits}`,
        email: email.trim().toLowerCase(),
      });
      if (result.ok) {
        setName("");
        setPhoneDisplay("");
        setEmail("");
        setSubmittedOk(true);
        return;
      }
      let mappedField = false;
      if (result.fields) {
        const fe = result.fields;
        if (Array.isArray(fe.name) && typeof fe.name[0] === "string") {
          setNameError(fe.name[0]);
          mappedField = true;
        }
        if (Array.isArray(fe.phone) && typeof fe.phone[0] === "string") {
          setPhoneError(fe.phone[0]);
          mappedField = true;
        }
        if (Array.isArray(fe.email) && typeof fe.email[0] === "string") {
          setEmailError(fe.email[0]);
          mappedField = true;
        }
      }
      if (!mappedField) setSubmitError(result.message);
    },
    [name, phoneDisplay, email],
  );

  const wrapReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.11,
            delayChildren: 0.06,
          },
        },
      };

  const infoReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.035,
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

  const buttonReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.52, ease: revealEase },
        },
      };

  const formPanelReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, x: 36, scale: 0.97, rotateZ: -0.6 },
        visible: {
          opacity: 1,
          x: 0,
          scale: 1,
          rotateZ: 0,
          transition: { duration: 0.68, ease: revealEase },
        },
      };

  const inViewReveal = reduceMotion
    ? undefined
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2, margin: "0px 0px -12% 0px" },
      };

  return (
    <section className={styles.section} aria-label="Care Contact">
      <div className={`container ${styles.container}`}>
        <motion.div
          className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
          {...(wrapReveal && inViewReveal
            ? { variants: wrapReveal, ...inViewReveal }
            : {})}
        >
          <motion.div
            className={`${styles.info} ${MOTION_COMPOSITE}`}
            {...(infoReveal ? { variants: infoReveal } : {})}
          >
            <HeadingLead
              titleBefore="Leave your worries at the door and enjoy a healthier, more "
              titleHighlight="precise smile"
              description="Share your goals once and our coordinators respond with clear availability, prep notes, and pricing context—booking stays human, not a guessing game."
              headingMotionVariants={headingClipReveal}
              descriptionMotionVariants={headingClipReveal}
            />
            <motion.div
              className={MOTION_COMPOSITE}
              {...(buttonReveal ? { variants: buttonReveal } : {})}
            >
              <ButtonBlue className={styles.button}>Learn More</ButtonBlue>
            </motion.div>
          </motion.div>
          <motion.div
            className={`${styles.formWrapper} ${MOTION_COMPOSITE}`}
            {...(formPanelReveal ? { variants: formPanelReveal } : {})}
          >
            <h3 className={styles.formTitle}>Request Appointment</h3>
            <form
              action="#"
              className={styles.form}
              onSubmit={onSubmit}
              noValidate
            >
              {submitError ? (
                <p
                  id={submitErrorId}
                  className={[styles.submitError, styles.feedbackIn].join(" ")}
                  role="alert"
                >
                  {submitError}
                </p>
              ) : null}
              <div className={styles.fields}>
                <div className={styles.fieldStack}>
                  <div
                    className={[
                      styles.field,
                      nameError ? styles.fieldInvalid : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Full Name"
                      className={styles.fieldInput}
                      value={name}
                      maxLength={NAME_MAX_LEN}
                      onChange={onNameChange}
                      aria-required="true"
                      aria-invalid={nameError ? true : undefined}
                      aria-describedby={
                        [nameError ? nameErrorId : null, submitError ? submitErrorId : null]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                    />
                  </div>
                  {nameError ? (
                    <p
                      id={nameErrorId}
                      className={[styles.fieldError, styles.feedbackIn].join(" ")}
                      role="alert"
                    >
                      {nameError}
                    </p>
                  ) : null}
                </div>
                <div className={styles.fieldStack}>
                  <div
                    className={[
                      styles.field,
                      phoneError ? styles.fieldInvalid : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="numeric"
                      placeholder="(555) 123-4567"
                      className={styles.fieldInput}
                      value={phoneDisplay}
                      maxLength={PHONE_INPUT_MAX_LEN}
                      onChange={onPhoneChange}
                      aria-required="true"
                      aria-invalid={phoneError ? true : undefined}
                      aria-label="Phone number"
                      aria-describedby={
                        [phoneError ? phoneErrorId : null, submitError ? submitErrorId : null]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                    />
                  </div>
                  {phoneError ? (
                    <p
                      id={phoneErrorId}
                      className={[styles.fieldError, styles.feedbackIn].join(" ")}
                      role="alert"
                    >
                      {phoneError}
                    </p>
                  ) : null}
                </div>
                <div className={styles.fieldStack}>
                  <div
                    className={[
                      styles.field,
                      emailError ? styles.fieldInvalid : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="Email Address"
                      className={styles.fieldInput}
                      value={email}
                      maxLength={EMAIL_MAX_LEN}
                      onChange={onEmailChange}
                      aria-required="true"
                      aria-invalid={emailError ? true : undefined}
                      aria-describedby={
                        [emailError ? emailErrorId : null, submitError ? submitErrorId : null]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                    />
                  </div>
                  {emailError ? (
                    <p
                      id={emailErrorId}
                      className={[styles.fieldError, styles.feedbackIn].join(" ")}
                      role="alert"
                    >
                      {emailError}
                    </p>
                  ) : null}
                </div>
              </div>
              <ButtonBlue type="submit" className={styles.formButton}>
                Submit
              </ButtonBlue>
              {submittedOk ? (
                <p
                  className={[styles.formSuccess, styles.feedbackIn].join(" ")}
                  role="status"
                  aria-live="polite"
                >
                  We will contact you shortly.
                </p>
              ) : null}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
