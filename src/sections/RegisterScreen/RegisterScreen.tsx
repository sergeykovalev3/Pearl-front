"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import { AuthFieldErrorHint } from "@/components/AuthFieldErrorHint/AuthFieldErrorHint";
import { AuthGoogleUnavailableModal } from "@/components/AuthGoogleUnavailableModal/AuthGoogleUnavailableModal";
import { AuthVisualColumn } from "@/components/AuthVisualColumn/AuthVisualColumn";
import styles from "@/components/AuthScreen/AuthScreen.module.scss";
import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { GoogleIcon } from "@/components/Icons/GoogleIcon/GoogleIcon";
import { LockClosedIcon } from "@/components/Icons/LockClosedIcon/LockClosedIcon";
import { MailEnvelopeIcon } from "@/components/Icons/MailEnvelopeIcon/MailEnvelopeIcon";
import { PhoneIcon } from "@/components/Icons/PhoneIcon/PhoneIcon";
import { UserProfileIcon } from "@/components/Icons/UserProfileIcon/UserProfileIcon";
import {
  AUTH_EMAIL_MAX_LEN,
  AUTH_NAME_MAX_LEN,
  AUTH_PASSWORD_MAX_LEN,
  AUTH_PHONE_DISPLAY_MAX_LEN,
  validateAuthEmail,
  validateAuthName,
  validateAuthPassword,
  validateAuthPhoneDigits,
} from "@/lib/authFormValidation";
import { getAuthScreenMotionVariants } from "@/lib/authScreenMotionVariants";
import { sanitizeEmailTypedInput } from "@/lib/emailValidation";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";
import { PEARL_AUTH_CHANGE_EVENT } from "@/lib/pearlSession";
import { registerAccount } from "@/lib/registerAccount";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { formatUsPhoneMask, takeUsPhoneDigits } from "@/lib/usPhone";

import registerStyles from "./RegisterScreen.module.scss";

function firstFieldMessage(messages?: string[]): string | null {
  if (!messages?.length) return null;
  return messages[0] ?? null;
}

export function RegisterScreen() {
  const router = useRouter();
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const baseId = useId();
  const nameErrorId = `${baseId}-name-error`;
  const phoneErrorId = `${baseId}-phone-error`;
  const emailErrorId = `${baseId}-email-error`;
  const passwordErrorId = `${baseId}-password-error`;
  const termsErrorId = `${baseId}-terms-error`;

  const [name, setName] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.slice(0, AUTH_NAME_MAX_LEN));
    setNameError(null);
    setSubmitError(null);
  }, []);

  const onPhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const digits = takeUsPhoneDigits(e.target.value);
    setPhoneDisplay(formatUsPhoneMask(digits));
    setPhoneError(null);
    setSubmitError(null);
  }, []);

  const onEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(
      sanitizeEmailTypedInput(e.target.value).slice(0, AUTH_EMAIL_MAX_LEN),
    );
    setEmailError(null);
    setSubmitError(null);
  }, []);

  const onPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value.slice(0, AUTH_PASSWORD_MAX_LEN));
    setPasswordError(null);
    setSubmitError(null);
  }, []);

  const onTermsChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
    setTermsError(null);
    setSubmitError(null);
  }, []);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError(null);
      const digits = takeUsPhoneDigits(phoneDisplay);
      setPhoneDisplay(formatUsPhoneMask(digits));

      const nextNameError = validateAuthName(name);
      const nextPhoneError = validateAuthPhoneDigits(digits);
      const nextEmailError = validateAuthEmail(email);
      const nextPasswordError = validateAuthPassword(password);
      const nextTermsError = termsAccepted
        ? null
        : "Please confirm that you agree to the Terms of Use and Privacy Policy.";

      setNameError(nextNameError);
      setPhoneError(nextPhoneError);
      setEmailError(nextEmailError);
      setPasswordError(nextPasswordError);
      setTermsError(nextTermsError);

      if (
        nextNameError ||
        nextPhoneError ||
        nextEmailError ||
        nextPasswordError ||
        nextTermsError
      ) {
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await registerAccount({
          name: name.trim(),
          phone: phoneDisplay,
          email: email.trim().toLowerCase(),
          password,
          termsAccepted,
        });

        if (!result.ok) {
          if (result.status === 409 && result.message) {
            setEmailError(result.message);
            return;
          }
          if (result.fields) {
            setNameError(firstFieldMessage(result.fields.name));
            setPhoneError(firstFieldMessage(result.fields.phone));
            setEmailError(firstFieldMessage(result.fields.email));
            setPasswordError(firstFieldMessage(result.fields.password));
            const termsMsg = firstFieldMessage(result.fields.termsAccepted);
            if (termsMsg) setTermsError(termsMsg);
            return;
          }
          setSubmitError(
            result.message ?? "Something went wrong. Please try again.",
          );
          return;
        }

        window.dispatchEvent(new Event(PEARL_AUTH_CHANGE_EVENT));
        router.push("/");
      } catch {
        setSubmitError(
          "Could not reach the server. Check that the API is running.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, phoneDisplay, email, password, termsAccepted, router],
  );

  const {
    shellOrchestration,
    visualColumnOrchestration,
    imageReveal,
    quoteOrchestration,
    headingClipReveal,
    leadClipReveal,
    panelReveal,
    panelInnerOrchestration,
    blockReveal,
    inViewReveal,
  } = getAuthScreenMotionVariants(reduceMotion);

  return (
    <main className={styles.page} aria-label="Create an account">
      <AuthGoogleUnavailableModal
        open={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
      />
      <motion.div
        className={styles.shell}
        {...(shellOrchestration && inViewReveal
          ? { variants: shellOrchestration, ...inViewReveal }
          : {})}
      >
        <AuthVisualColumn
          variants={visualColumnOrchestration}
          imageReveal={imageReveal}
          quoteOrchestration={quoteOrchestration}
          headingClipReveal={headingClipReveal}
          leadClipReveal={leadClipReveal}
        />

        <motion.div
          className={styles.panel}
          {...(panelReveal ? { variants: panelReveal } : {})}
        >
          <motion.div
            className={styles.panelInner}
            {...(panelInnerOrchestration ? { variants: panelInnerOrchestration } : {})}
          >
            <motion.h1
              className={[styles.title, MOTION_COMPOSITE].join(" ")}
              {...(headingClipReveal ? { variants: headingClipReveal } : {})}
            >
              Create an account
            </motion.h1>
            <motion.p
              className={styles.lead}
              {...(leadClipReveal ? { variants: leadClipReveal } : {})}
            >
              Discover a better way of spending with Pearl.
            </motion.p>

            <motion.button
              type="button"
              className={[styles.googleBtn, MOTION_COMPOSITE].join(" ")}
              {...(blockReveal ? { variants: blockReveal } : {})}
              onClick={() => setGoogleModalOpen(true)}
            >
              <GoogleIcon size={20} />
              <span>Sign up with Google</span>
            </motion.button>

            <motion.div
              className={styles.or}
              {...(blockReveal ? { variants: blockReveal } : {})}
            >
              <span className={styles.orLine} aria-hidden />
              <span className={styles.orLabel}>Or</span>
              <span className={styles.orLine} aria-hidden />
            </motion.div>

            <motion.div {...(blockReveal ? { variants: blockReveal } : {})}>
              <form className={styles.form} onSubmit={onSubmit} noValidate>
                <div className={styles.field}>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <UserProfileIcon size={20} />
                    </span>
                    <input
                      id={`${baseId}-name`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      className={[
                        styles.input,
                        nameError ? styles.inputInvalid : "",
                        nameError ? styles.inputWithErrorHint : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      placeholder="Your name"
                      aria-label="Name"
                      aria-invalid={nameError ? true : undefined}
                      aria-describedby={nameError ? nameErrorId : undefined}
                      maxLength={AUTH_NAME_MAX_LEN}
                      value={name}
                      onChange={onNameChange}
                    />
                    {nameError ? (
                      <AuthFieldErrorHint
                        message={nameError}
                        describedById={nameErrorId}
                      />
                    ) : null}
                  </div>
                </div>

                <div className={styles.field}>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <PhoneIcon size={20} />
                    </span>
                    <input
                      id={`${baseId}-phone`}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      className={[
                        styles.input,
                        phoneError ? styles.inputInvalid : "",
                        phoneError ? styles.inputWithErrorHint : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      placeholder="(555) 555-5555"
                      aria-label="Phone number"
                      aria-invalid={phoneError ? true : undefined}
                      aria-describedby={phoneError ? phoneErrorId : undefined}
                      maxLength={AUTH_PHONE_DISPLAY_MAX_LEN}
                      value={phoneDisplay}
                      onChange={onPhoneChange}
                    />
                    {phoneError ? (
                      <AuthFieldErrorHint
                        message={phoneError}
                        describedById={phoneErrorId}
                      />
                    ) : null}
                  </div>
                </div>

                <div className={styles.field}>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <MailEnvelopeIcon size={20} />
                    </span>
                    <input
                      id={`${baseId}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      className={[
                        styles.input,
                        emailError ? styles.inputInvalid : "",
                        emailError ? styles.inputWithErrorHint : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      placeholder="you@example.com"
                      aria-label="Email"
                      aria-invalid={emailError ? true : undefined}
                      aria-describedby={emailError ? emailErrorId : undefined}
                      maxLength={AUTH_EMAIL_MAX_LEN}
                      value={email}
                      onChange={onEmailChange}
                    />
                    {emailError ? (
                      <AuthFieldErrorHint
                        message={emailError}
                        describedById={emailErrorId}
                      />
                    ) : null}
                  </div>
                </div>

                <div className={styles.field}>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <LockClosedIcon size={20} />
                    </span>
                    <input
                      id={`${baseId}-password`}
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className={[
                        styles.input,
                        passwordError ? styles.inputInvalid : "",
                        passwordError ? styles.inputWithErrorHint : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      placeholder="Create a password"
                      aria-label="Password"
                      aria-invalid={passwordError ? true : undefined}
                      aria-describedby={
                        passwordError ? passwordErrorId : undefined
                      }
                      maxLength={AUTH_PASSWORD_MAX_LEN}
                      value={password}
                      onChange={onPasswordChange}
                    />
                    {passwordError ? (
                      <AuthFieldErrorHint
                        message={passwordError}
                        describedById={passwordErrorId}
                      />
                    ) : null}
                  </div>
                </div>

                <div
                  className={[
                    styles.agreeShell,
                    termsError ? styles.agreeShellWithHint : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <label className={styles.agree}>
                    <input
                      name="terms"
                      type="checkbox"
                      className={[styles.checkbox, termsError ? styles.checkboxInvalid : ""]
                        .filter(Boolean)
                        .join(" ")}
                      checked={termsAccepted}
                      onChange={onTermsChange}
                      aria-invalid={termsError ? true : undefined}
                      aria-describedby={termsError ? termsErrorId : undefined}
                    />
                    <span className={styles.agreeText}>
                      I agree with{" "}
                      <Link
                        href="/terms"
                        className={styles.inlineLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className={styles.inlineLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {termsError ? (
                    <AuthFieldErrorHint
                      message={termsError}
                      describedById={termsErrorId}
                      placement="terms"
                    />
                  ) : null}
                </div>

                {submitError ? (
                  <p className={registerStyles.submitError} role="alert">
                    {submitError}
                  </p>
                ) : null}

                <ButtonBlue
                  type="submit"
                  className={styles.submit}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Signing up…" : "Sign up"}
                </ButtonBlue>
              </form>
            </motion.div>

            <motion.p
              className={styles.switch}
              {...(blockReveal ? { variants: blockReveal } : {})}
            >
              Have account?{" "}
              <Link href="/login" className={styles.switchLink}>
                Sign In
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
