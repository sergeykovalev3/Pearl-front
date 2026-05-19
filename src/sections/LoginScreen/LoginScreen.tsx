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
import {
  AUTH_EMAIL_MAX_LEN,
  AUTH_PASSWORD_MAX_LEN,
  validateAuthEmail,
  validateLoginPassword,
} from "@/lib/authFormValidation";
import { getAuthScreenMotionVariants } from "@/lib/authScreenMotionVariants";
import { sanitizeEmailTypedInput } from "@/lib/emailValidation";
import { loginAccount } from "@/lib/loginAccount";
import { MOTION_COMPOSITE } from "@/lib/motionComposite";
import { PEARL_AUTH_CHANGE_EVENT } from "@/lib/pearlSession";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

import loginStyles from "./LoginScreen.module.scss";

function firstFieldMessage(messages?: string[]): string | null {
  if (!messages?.length) return null;
  return messages[0] ?? null;
}

export function LoginScreen() {
  const router = useRouter();
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const baseId = useId();
  const emailErrorId = `${baseId}-email-error`;
  const passwordErrorId = `${baseId}-password-error`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError(null);
      const nextEmailError = validateAuthEmail(email);
      const nextPasswordError = validateLoginPassword(password);
      setEmailError(nextEmailError);
      setPasswordError(nextPasswordError);
      if (nextEmailError || nextPasswordError) return;

      setIsSubmitting(true);
      try {
        const result = await loginAccount({
          email: email.trim().toLowerCase(),
          password,
        });

        if (!result.ok) {
          if (result.status === 401 && result.message) {
            setSubmitError(result.message);
            return;
          }
          if (result.fields) {
            setEmailError(firstFieldMessage(result.fields.email));
            setPasswordError(firstFieldMessage(result.fields.password));
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
    [email, password, router],
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
    <main className={styles.page} aria-label="Log in">
      <AuthGoogleUnavailableModal
        open={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
      />
      <AuthGoogleUnavailableModal
        open={forgotPasswordModalOpen}
        onClose={() => setForgotPasswordModalOpen(false)}
        title="Password recovery unavailable"
        body="Password recovery is not yet available. This option will be enabled in a forthcoming update."
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
              Welcome Back
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
              <span>Log in with Google</span>
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
                      autoComplete="current-password"
                      className={[
                        styles.input,
                        passwordError ? styles.inputInvalid : "",
                        passwordError ? styles.inputWithErrorHint : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      placeholder="Password"
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

                <div className={loginStyles.rememberRow}>
                  <label className={loginStyles.rememberLabel}>
                    <input
                      name="remember"
                      type="checkbox"
                      className={[styles.checkbox, loginStyles.rememberCheckbox].join(
                        " ",
                      )}
                    />
                    <span className={styles.agreeText}>Remember Me</span>
                  </label>
                  <button
                    type="button"
                    className={[styles.switchLink, loginStyles.linkAsButton].join(
                      " ",
                    )}
                    onClick={() => setForgotPasswordModalOpen(true)}
                  >
                    Forgot password?
                  </button>
                </div>

                {submitError ? (
                  <p className={loginStyles.submitError} role="alert">
                    {submitError}
                  </p>
                ) : null}

                <ButtonBlue
                  type="submit"
                  className={styles.submit}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Signing in…" : "Log in"}
                </ButtonBlue>
              </form>
            </motion.div>

            <motion.p
              className={styles.switch}
              {...(blockReveal ? { variants: blockReveal } : {})}
            >
              Not member yet?{" "}
              <Link href="/register" className={styles.switchLink}>
                Create an account
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
