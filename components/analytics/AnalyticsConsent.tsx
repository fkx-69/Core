"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const CONSENT_COOKIE = "core_analytics_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
const DELETION_PENDING_KEY = "core_analytics_deletion_pending";

type Consent = "accepted" | "declined" | null;

function readConsent(): Consent {
  const match = document.cookie.match(/(?:^|; )core_analytics_consent=([^;]+)/);
  return match?.[1] === "accepted" || match?.[1] === "declined" ? (match[1] as Consent) : null;
}

function writeConsent(value: Exclude<Consent, null>): void {
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

function referrerHost(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const url = new URL(document.referrer);
    if (url.origin === window.location.origin) return undefined;
    return url.hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

async function requestDeletion(): Promise<boolean> {
  try {
    const response = await fetch("/api/analytics/visitor", {
      method: "DELETE",
      credentials: "same-origin",
      keepalive: true,
    });
    return response.status === 204;
  } catch {
    return false;
  }
}

function setDeletionPending(value: boolean): void {
  try {
    if (value) localStorage.setItem(DELETION_PENDING_KEY, "1");
    else localStorage.removeItem(DELETION_PENDING_KEY);
  } catch {
    // Storage can be disabled; the consent state still stops collection.
  }
}

function deletionIsPending(): boolean {
  try {
    return localStorage.getItem(DELETION_PENDING_KEY) === "1";
  } catch {
    return false;
  }
}

export default function AnalyticsConsent() {
  const pathname = usePathname();
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
  const [consent, setConsent] = useState<Consent>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const sentPath = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      const current = readConsent();
      setConsent(current);
      setOpen(current === null);
      setReady(true);
      if (current === "declined" && deletionIsPending()) {
        void requestDeletion().then((success) => {
          if (success) setDeletionPending(false);
        });
      }
    }, 0);
    const onPreferences = () => setOpen(true);
    window.addEventListener("core:analytics-preferences", onPreferences);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("core:analytics-preferences", onPreferences);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ready || consent !== "accepted" || !pathname || sentPath.current === pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/connexion") || pathname.startsWith("/api/")) return;
    sentPath.current = pathname;
    const eventId = crypto.randomUUID();
    const payload = { eventId, path: pathname, referrerHost: referrerHost() };
    void fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => {
      // Analytics is deliberately best-effort and must never affect rendering.
    });
  }, [consent, enabled, pathname, ready]);

  if (!enabled || !ready || !open) return null;

  const choose = (value: Exclude<Consent, null>) => {
    if (value === "declined") {
      // Stop collection before starting the privacy cleanup request. The
      // request is deletion, never a tracking event, and is retried while
      // this browser remains in the declined state.
      writeConsent(value);
      setConsent(value);
      setOpen(false);
      sentPath.current = null;
      setDeletionPending(true);
      void requestDeletion().then((success) => {
        if (success) setDeletionPending(false);
      });
      return;
    }
    writeConsent(value);
    setConsent(value);
    setOpen(false);
  };

  return (
    <aside
      role="dialog"
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-description"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-card border border-line bg-surface-raised p-5 shadow-overlay sm:inset-x-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 id="analytics-consent-title" className="font-display text-lg font-semibold">
            Votre confidentialité compte
          </h2>
          <p id="analytics-consent-description" className="mt-2 text-sm leading-6 text-muted">
            Avec votre accord, Core réalise une mesure d’audience limitée et pseudonymisée pour améliorer le site. Aucun cookie de mesure n’est déposé avant votre choix, et vous pouvez le retirer à tout moment.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-accent bg-accent-soft px-5 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-accent-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-accent bg-accent-soft px-5 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-accent-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Accepter
          </button>
        </div>
      </div>
    </aside>
  );
}
