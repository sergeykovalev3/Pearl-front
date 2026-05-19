"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ButtonBlue } from "@/components/ButtonBlue/ButtonBlue";
import { SITE_CONTACT_BOOKING_HREF } from "@/data/siteNavLinks";
import {
  fetchMyAppointments,
  type PearlAppointmentRecord,
} from "@/lib/pearlAppointments";
import { pearlAvatarLetter } from "@/lib/pearlAvatarLetter";
import {
  logoutPearl,
  pearlFetchSessionUser,
  PEARL_AUTH_CHANGE_EVENT,
  type PearlSessionUser,
} from "@/lib/pearlSession";
import { displayUsPhoneFromE164 } from "@/lib/usPhone";

import styles from "./ProfileScreen.module.scss";

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatAppointmentDay(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map((x) => Number.parseInt(x, 10));
  if (
    !Number.isFinite(y) ||
    !Number.isFinite(m) ||
    !Number.isFinite(d) ||
    m < 1 ||
    m > 12
  ) {
    return isoDate;
  }
  return longDateFormatter.format(new Date(Date.UTC(y, m - 1, d)));
}

function formatSubmittedAt(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  return longDateFormatter.format(new Date(t));
}

export function ProfileScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<PearlSessionUser | null>(null);
  const [appointments, setAppointments] = useState<
    PearlAppointmentRecord[] | null
  >(null);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      const next = await pearlFetchSessionUser();
      if (!cancelled) {
        setUser(next);
        setReady(true);
      }
    };
    void sync();
    const onAuthChange = () => {
      void sync();
    };
    window.addEventListener(PEARL_AUTH_CHANGE_EVENT, onAuthChange);
    return () => {
      cancelled = true;
      window.removeEventListener(PEARL_AUTH_CHANGE_EVENT, onAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    setAppointments(null);
    setAppointmentsLoading(true);
    void (async () => {
      const rows = await fetchMyAppointments();
      if (!cancelled) {
        setAppointments(rows);
        setAppointmentsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, user?.id]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  const onLogout = () => {
    void (async () => {
      await logoutPearl();
      router.replace("/");
      router.refresh();
    })();
  };

  if (!ready || !user) {
    return <main className={styles.page} />;
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.content}>
          <header className={styles.profileHeader} aria-labelledby="profile-heading">
            <div className={styles.avatar} aria-hidden>
              <span className={styles.avatarLetter}>
                {pearlAvatarLetter(user.fullName, user.email)}
              </span>
            </div>
            <div className={styles.identity}>
              <h1 id="profile-heading" className={styles.name}>
                {user.fullName}
              </h1>
              <p className={styles.email}>{user.email}</p>
            </div>
          </header>

          <div className={styles.actions}>
            <ButtonBlue href={SITE_CONTACT_BOOKING_HREF} className={styles.book}>
              Book Now
            </ButtonBlue>
            <button
              type="button"
              className={styles.logoutLink}
              onClick={onLogout}
            >
              Log out
            </button>
          </div>

          <hr className={styles.divider} />

          <section aria-labelledby="history-heading">
            <h2 id="history-heading" className={styles.historyTitle}>
              Appointment history
            </h2>
            <p className={styles.historyIntro}>
              Requests you submitted while signed in appear here with the
              preferred date you chose on the booking form.
            </p>

            {appointmentsLoading ? (
              <p className={styles.historyLoading}>Loading appointments…</p>
            ) : appointments === null ? (
              <p className={styles.historyError} role="alert">
                Could not load your appointments. Refresh the page or try again
                later.
              </p>
            ) : appointments.length === 0 ? (
              <p className={styles.historyEmpty}>
                You have no saved appointments yet.{" "}
                <Link href={SITE_CONTACT_BOOKING_HREF} className={styles.historyEmptyLink}>
                  Book an appointment
                </Link>{" "}
                to add one.
              </p>
            ) : (
              <ul className={styles.historyList}>
                {appointments.map((row) => (
                  <li key={row.id}>
                    <article className={styles.historyCard}>
                      <div className={styles.historyCardTop}>
                        <p className={styles.preferredDate}>
                          {formatAppointmentDay(row.scheduledOn)}
                        </p>
                      </div>
                      <p className={styles.metaLine}>
                        Submitted {formatSubmittedAt(row.createdAt)}
                        {" · "}
                        {displayUsPhoneFromE164(row.phoneE164)}
                      </p>
                      <p className={styles.message}>{row.message}</p>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
