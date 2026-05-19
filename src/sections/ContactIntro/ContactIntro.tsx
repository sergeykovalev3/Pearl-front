"use client";

import type { ChangeEvent, ComponentType, FormEvent } from "react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useSyncExternalStore } from "react";
import { motion } from "motion/react";

import { HeadingLead } from "@/components/HeadingLead/HeadingLead";
import { MapPinIcon } from "@/components/Icons/MapPinIcon/MapPinIcon";
import { ClockIcon } from "@/components/Icons/ClockIcon/ClockIcon";
import { PhoneIcon } from "@/components/Icons/PhoneIcon/PhoneIcon";
import { ChatIcon } from "@/components/Icons/ChatIcon/ChatIcon";
import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import {
  isValidEmail,
  sanitizeEmailTypedInput,
} from "@/lib/emailValidation";
import {
  formatUsPhoneMask,
  isCompleteUsPhone,
  takeUsPhoneDigits,
} from "@/lib/usPhone";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";
import {
  submitAppointmentRequest,
  type AppointmentRequestFieldErrors,
} from "@/lib/pearlAppointments";
import { pearlFetchSessionUser } from "@/lib/pearlSession";

import Image from "next/image";

import styles from "./ContactIntro.module.scss";

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

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const textClipBleedRevealStart = "inset(-14px 100% -48px -4px)" as const;
const textClipBleedRevealEnd = "inset(-14px -4px -48px -4px)" as const;

const NAME_MAX_LEN = 100;
const EMAIL_MAX_LEN = 128;
const PHONE_INPUT_MAX_LEN = 14;
const MESSAGE_MAX_LEN = 2000;

type IntroIcon = ComponentType<{ fill?: string }>;

type ContactIntroItem = {
  key: string;
  Icon: IntroIcon;
  title: string;
  description: string;
  href?: string;
};

const contactIntroItems: ContactIntroItem[] = [
  {
    key: "hours",
    Icon: ClockIcon,
    title: "Office Timings",
    description: "Monday - Saturday (9:00am to 5pm)\nSunday (Closed)",
  },
  {
    key: "email",
    Icon: MapPinIcon,
    title: "Email Address",
    description: "Smile01@gmail.com",
    href: "mailto:Smile01@gmail.com",
  },
  {
    key: "phone",
    Icon: PhoneIcon,
    title: "Phone Number",
    description: "0900-78601",
    href: "tel:090078601",
  },
  {
    key: "chat",
    Icon: ChatIcon,
    title: "Live chat",
    description: "+1-2064512559",
    href: "tel:+12064512559",
  },
];

export function ContactIntro() {
  const reduceMotion = usePrefersReducedMotion();
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const baseId = useId();
  const firstNameErrorId = `${baseId}-first-name-error`;
  const lastNameErrorId = `${baseId}-last-name-error`;
  const emailErrorId = `${baseId}-email-error`;
  const phoneErrorId = `${baseId}-phone-error`;
  const dateErrorId = `${baseId}-date-error`;
  const messageErrorId = `${baseId}-message-error`;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [message, setMessage] = useState("");

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [submittedOk, setSubmittedOk] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiSubmitError, setApiSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const u = await pearlFetchSessionUser();
      if (cancelled || !u) return;
      const parts = u.fullName.trim().split(/\s+/);
      setFirstName((prev) => (prev.trim() ? prev : parts[0] ?? ""));
      setLastName((prev) =>
        prev.trim() ? prev : parts.slice(1).join(" "),
      );
      setEmail((prev) => (prev.trim() ? prev : u.email));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function applyServerFieldErrors(fields: AppointmentRequestFieldErrors) {
    const fn = fields.firstName?.[0];
    const ln = fields.lastName?.[0];
    const em = fields.email?.[0];
    const ph = fields.phone?.[0];
    const dt = fields.date?.[0];
    const msg = fields.message?.[0];
    if (fn) setFirstNameError(fn);
    if (ln) setLastNameError(ln);
    if (em) setEmailError(em);
    if (ph) setPhoneError(ph);
    if (dt) setDateError(dt);
    if (msg) setMessageError(msg);
  }

  const textClipReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.76, clipPath: textClipBleedRevealStart },
        visible: {
          opacity: [0.76, 1],
          clipPath: [textClipBleedRevealStart, textClipBleedRevealEnd],
          transition: { duration: 0.82, ease: revealEase },
        },
      };

  const wrapReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.11,
            delayChildren: 0.05,
          },
        },
      };

  const contentReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.13,
            delayChildren: 0.06,
          },
        },
      };

  const itemsReveal = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.088,
            delayChildren: 0.035,
          },
        },
      };

  const mapReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.74, y: 26, scale: 0.986 },
        visible: {
          opacity: [0.74, 1],
          y: [26, 0],
          scale: [0.986, 1],
          transition: { duration: 0.72, ease: revealEase },
        },
      };

  const itemCardReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.82, y: 18 },
        visible: {
          opacity: [0.82, 1],
          y: [18, 0],
          transition: { duration: 0.56, ease: revealEase },
        },
      };

  const formReveal = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, x: 34, scale: 0.978, rotateZ: -0.55 },
        visible: {
          opacity: [0, 1],
          x: [34, 0],
          scale: [0.978, 1],
          rotateZ: [-0.55, 0],
          transition: { duration: 0.68, ease: revealEase, delay: 0.06 },
        },
      };

  const inViewReveal = reduceMotion
    ? undefined
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.14, margin: "0px 0px -12% 0px" },
      };

  const syncMessageTextareaHeight = useCallback(() => {
    const el = messageRef.current;
    if (!el) return;
    el.style.height = "auto";
    const cs = getComputedStyle(el);
    const maxPx = parseFloat(cs.maxHeight);
    const minPx = parseFloat(cs.minHeight);
    const cap = Number.isFinite(maxPx) && maxPx > 0 ? maxPx : 224;
    const floor = Number.isFinite(minPx) && minPx > 0 ? minPx : 0;
    const h = Math.min(Math.max(el.scrollHeight, floor), cap);
    el.style.height = `${h}px`;
  }, []);

  useLayoutEffect(() => {
    syncMessageTextareaHeight();
  }, [message, syncMessageTextareaHeight]);

  const onFirstNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value.slice(0, NAME_MAX_LEN));
    setFirstNameError(null);
    setSubmittedOk(false);
    setApiSubmitError(null);
  }, []);

  const onLastNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value.slice(0, NAME_MAX_LEN));
    setLastNameError(null);
    setSubmittedOk(false);
    setApiSubmitError(null);
  }, []);

  const onEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(
      sanitizeEmailTypedInput(e.target.value).slice(0, EMAIL_MAX_LEN),
    );
    setEmailError(null);
    setSubmittedOk(false);
    setApiSubmitError(null);
  }, []);

  const onPhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const digits = takeUsPhoneDigits(e.target.value);
    setPhoneDisplay(formatUsPhoneMask(digits));
    setPhoneError(null);
    setSubmittedOk(false);
    setApiSubmitError(null);
  }, []);

  const onDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAppointmentDate(e.target.value);
    setDateError(null);
    setSubmittedOk(false);
    setApiSubmitError(null);
  }, []);

  const onMessageChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value.slice(0, MESSAGE_MAX_LEN));
      setMessageError(null);
      setSubmittedOk(false);
      setApiSubmitError(null);
    },
    [],
  );

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmedFirst = firstName.trim();
      const trimmedLast = lastName.trim();
      const digits = takeUsPhoneDigits(phoneDisplay);
      const trimmedMessage = message.trim();

      const nextFirstError = trimmedFirst
        ? null
        : "Please enter your first name.";
      const nextLastError = trimmedLast
        ? null
        : "Please enter your last name.";
      const nextEmailError = email.trim()
        ? isValidEmail(email)
          ? null
          : "Enter a valid email address."
        : "Please enter your email address.";
      const nextPhoneError = isCompleteUsPhone(digits)
        ? null
        : "Enter a valid 10-digit US phone number.";
      const nextDateError = appointmentDate
        ? null
        : "Please select a date.";
      const nextMessageError = trimmedMessage
        ? null
        : "Please enter a message.";

      setFirstNameError(nextFirstError);
      setLastNameError(nextLastError);
      setEmailError(nextEmailError);
      setPhoneError(nextPhoneError);
      setDateError(nextDateError);
      setMessageError(nextMessageError);
      setPhoneDisplay(formatUsPhoneMask(digits));

      if (
        nextFirstError ||
        nextLastError ||
        nextEmailError ||
        nextPhoneError ||
        nextDateError ||
        nextMessageError
      ) {
        return;
      }

      setApiSubmitError(null);
      setIsSubmitting(true);
      const result = await submitAppointmentRequest({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: email.trim().toLowerCase(),
        phone: phoneDisplay,
        date: appointmentDate,
        message: trimmedMessage,
      });
      setIsSubmitting(false);

      if (!result.ok) {
        if (result.fields) {
          applyServerFieldErrors(result.fields);
        }
        setApiSubmitError(
          result.message ??
            (result.fields && Object.keys(result.fields).length > 0
              ? null
              : "Could not submit your request. Please try again."),
        );
        return;
      }

      setSubmittedOk(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneDisplay("");
      setAppointmentDate("");
      setMessage("");
    },
    [appointmentDate, email, firstName, lastName, message, phoneDisplay],
  );

  return (
    <section className={styles.section} aria-label="Contact Intro">
      <div className={`container ${styles.container}`}>
        <motion.div
          className={`${styles.wrapper} ${MOTION_COMPOSITE}`}
          {...(wrapReveal && inViewReveal
            ? { variants: wrapReveal, ...inViewReveal }
            : {})}
        >
          <HeadingLead
            as="h1"
            titleBefore=""
            titleHighlight="Get in touch"
            description="Book an Appointment to treat your teeth right now."
            align="center"
            headingMotionVariants={textClipReveal}
            descriptionMotionVariants={textClipReveal}
          />
          <motion.div
            className={`${styles.content} ${MOTION_COMPOSITE}`}
            {...(contentReveal ? { variants: contentReveal } : {})}
          >
            <motion.div
              className={`${styles.items} ${MOTION_COMPOSITE}`}
              {...(itemsReveal ? { variants: itemsReveal } : {})}
            >
              <motion.div
                className={`${styles.map} ${MOTION_COMPOSITE}`}
                {...(mapReveal ? { variants: mapReveal } : {})}
              >
                <div className={styles.mapImageWrap}>
                  <Image
                    src="/images/contact/contactIntro/map.png"
                    alt=""
                    fill
                    className={styles.mapImage}
                    sizes="(max-width: 767px) 100vw, min(505px, 40vw)"
                  />
                </div>
                <div className={styles.mapInner}>
                  <div className={styles.mapInnerIcon}>
                    <MapPinIcon fill="var(--colorWhite)" />
                  </div>
                  <div className={styles.mapInnerText}>
                    <h3 className={styles.mapInnerTextTitle}>Office Address</h3>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=1441%20Morris%20Ave%2C%20Union%2C%20NJ%2007083"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.mapInnerTextDescription} ${styles.itemLink}`}
                    >
                      1441 Morris Ave, Union, NJ 07083
                    </a>
                  </div>
                </div>
              </motion.div>
              {contactIntroItems.map((item) => {
                const Icon = item.Icon;
                return (
                  <motion.div
                    className={`${styles.item} ${MOTION_COMPOSITE}`}
                    key={item.key}
                    {...(itemCardReveal ? { variants: itemCardReveal } : {})}
                  >
                    <div className={styles.itemIcon}>
                      <Icon fill="var(--colorWhite)" />
                    </div>
                    <div className={styles.itemText}>
                      <h3 className={styles.itemTextTitle}>{item.title}</h3>
                      <span className={styles.itemTextDescription}>
                        {item.href ? (
                          <a href={item.href} className={styles.itemLink}>
                            {item.description}
                          </a>
                        ) : (
                          item.description
                        )}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            <motion.div
              className={[
                styles.formWrapper,
                MOTION_COMPOSITE,
                submittedOk ? styles.formWrapperSuccess : "",
              ]
                .filter(Boolean)
                .join(" ")}
              {...(formReveal ? { variants: formReveal } : {})}
            >
              <div className={styles.formShell}>
                <div
                  className={[
                    styles.formLayer,
                    submittedOk ? styles.formLayerHidden : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  inert={submittedOk ? true : undefined}
                >
                  <form className={styles.form} onSubmit={onSubmit} noValidate>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label htmlFor="firstName" className={styles.formLabel}>
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="First name"
                      className={[
                        styles.formInput,
                        firstNameError ? styles.formInputInvalid : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      value={firstName}
                      maxLength={NAME_MAX_LEN}
                      onChange={onFirstNameChange}
                      aria-required="true"
                      aria-invalid={firstNameError ? true : undefined}
                      aria-describedby={
                        firstNameError ? firstNameErrorId : undefined
                      }
                    />
                    {firstNameError ? (
                      <p
                        id={firstNameErrorId}
                        className={`${styles.formFieldError} ${styles.fieldErrorReveal}`}
                        role="alert"
                      >
                        {firstNameError}
                      </p>
                    ) : null}
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="lastName" className={styles.formLabel}>
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Last name"
                      className={[
                        styles.formInput,
                        lastNameError ? styles.formInputInvalid : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      value={lastName}
                      maxLength={NAME_MAX_LEN}
                      onChange={onLastNameChange}
                      aria-required="true"
                      aria-invalid={lastNameError ? true : undefined}
                      aria-describedby={
                        lastNameError ? lastNameErrorId : undefined
                      }
                    />
                    {lastNameError ? (
                      <p
                        id={lastNameErrorId}
                        className={`${styles.formFieldError} ${styles.fieldErrorReveal}`}
                        role="alert"
                      >
                        {lastNameError}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label htmlFor="email" className={styles.formLabel}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="Email"
                      className={[
                        styles.formInput,
                        emailError ? styles.formInputInvalid : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      value={email}
                      maxLength={EMAIL_MAX_LEN}
                      onChange={onEmailChange}
                      aria-required="true"
                      aria-invalid={emailError ? true : undefined}
                      aria-describedby={emailError ? emailErrorId : undefined}
                    />
                    {emailError ? (
                      <p
                        id={emailErrorId}
                        className={`${styles.formFieldError} ${styles.fieldErrorReveal}`}
                        role="alert"
                      >
                        {emailError}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label htmlFor="phone" className={styles.formLabel}>
                      Phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      placeholder="(555) 123-4567"
                      className={[
                        styles.formInput,
                        phoneError ? styles.formInputInvalid : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      value={phoneDisplay}
                      maxLength={PHONE_INPUT_MAX_LEN}
                      onChange={onPhoneChange}
                      aria-required="true"
                      aria-label="Phone number"
                      aria-invalid={phoneError ? true : undefined}
                      aria-describedby={phoneError ? phoneErrorId : undefined}
                    />
                    {phoneError ? (
                      <p
                        id={phoneErrorId}
                        className={`${styles.formFieldError} ${styles.fieldErrorReveal}`}
                        role="alert"
                      >
                        {phoneError}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label htmlFor="date" className={styles.formLabel}>
                      Select date
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      className={[
                        styles.formInput,
                        dateError ? styles.formInputInvalid : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      value={appointmentDate}
                      onChange={onDateChange}
                      aria-required="true"
                      aria-invalid={dateError ? true : undefined}
                      aria-describedby={dateError ? dateErrorId : undefined}
                    />
                    {dateError ? (
                      <p
                        id={dateErrorId}
                        className={`${styles.formFieldError} ${styles.fieldErrorReveal}`}
                        role="alert"
                      >
                        {dateError}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label htmlFor="message" className={styles.formLabel}>
                      Message
                    </label>
                    <textarea
                      ref={messageRef}
                      id="message"
                      name="message"
                      rows={1}
                      className={[
                        styles.formTextarea,
                        messageError ? styles.formTextareaInvalid : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      value={message}
                      maxLength={MESSAGE_MAX_LEN}
                      onChange={onMessageChange}
                      aria-required="true"
                      aria-invalid={messageError ? true : undefined}
                      aria-describedby={
                        messageError ? messageErrorId : undefined
                      }
                    />
                    {messageError ? (
                      <p
                        id={messageErrorId}
                        className={`${styles.formFieldError} ${styles.fieldErrorReveal}`}
                        role="alert"
                      >
                        {messageError}
                      </p>
                    ) : null}
                  </div>
                </div>
                {apiSubmitError ? (
                  <p
                    className={`${styles.formFieldError} ${styles.fieldErrorReveal}`}
                    role="alert"
                  >
                    {apiSubmitError}
                  </p>
                ) : null}
                <ButtonBlue
                  type="submit"
                  className={styles.formButton}
                  disabled={isSubmitting}
                >
                  Submit
                </ButtonBlue>
                  </form>
                </div>
                {submittedOk ? (
                  <div className={styles.successOverlay}>
                    <div
                      className={styles.formSuccess}
                      role="status"
                      aria-live="polite"
                    >
                      <div className={styles.formSuccessHeader}>
                        <span className={styles.formSuccessIcon} aria-hidden>
                          ✓
                        </span>
                        <div className={styles.formSuccessCopy}>
                          <h3 className={styles.formSuccessTitle}>
                            Thank you for reaching out.
                          </h3>
                          <p className={styles.formSuccessBody}>
                            Your message has been received. We will review what
                            you shared and contact you shortly—usually within one
                            business day. If you need help sooner, please call our
                            office.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
