import type { Metadata } from "next";
import Link from "next/link";

import PasswordField from "@/components/admin/PasswordField";
import {
  hasAdminAuthConfiguration,
  safeAdminReturnPath,
} from "@/lib/admin-auth";
import { loginAdminAction } from "@/lib/admin-actions";

export const metadata: Metadata = {
  title: "Administration — Connexion",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type LoginPageProps = {
  searchParams: Promise<{ erreur?: string | string[]; next?: string | string[] }>;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = safeAdminReturnPath(first(params.next));
  const error = first(params.erreur);
  const unavailable = !hasAdminAuthConfiguration() || error === "indisponible";

  return (
    <main className="grid min-h-svh place-items-center bg-background px-5 py-10">
      <section
        className="w-full max-w-md rounded-field border border-line bg-surface-raised p-7 sm:p-9"
        aria-labelledby="admin-login-title"
      >
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-accent font-display text-lg font-bold text-accent-contrast" aria-hidden>
            C
          </span>
          <div>
            <p className="font-display text-lg font-semibold leading-none">Core</p>
            <p className="mt-1 text-xs text-muted">Administration privée</p>
          </div>
        </div>
        <h1 id="admin-login-title" className="font-display text-2xl font-semibold tracking-tight">
          Ouvrir le tableau de bord
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Cette interface est réservée à l’équipe Core. Les statistiques portent uniquement sur les visiteurs ayant accepté la mesure d’audience.
        </p>
        <form action={loginAdminAction} className="mt-7 space-y-5">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium">Mot de passe</label>
            <PasswordField
              id="admin-password"
              name="password"
              autoComplete="current-password"
              autoFocus
              required
              maxLength={512}
              disabled={unavailable}
              aria-invalid={Boolean(error) || unavailable}
              aria-describedby="admin-login-message"
              placeholder="Votre mot de passe"
            />
          </div>
          <p id="admin-login-message" role={error || unavailable ? "alert" : undefined} className={`rounded-field px-3 py-2.5 text-sm ${error || unavailable ? "bg-danger-soft text-danger" : "bg-surface text-muted"}`}>
            {unavailable
              ? "Le tableau de bord est temporairement indisponible."
              : error === "identifiants"
                ? "Identifiants invalides ou accès temporairement verrouillé."
                : "Votre session d’administration durera 8 heures."}
          </p>
          <button type="submit" disabled={unavailable} className="inline-flex min-h-11 w-full items-center justify-center rounded-field bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            Se connecter
          </button>
        </form>
        <Link href="/" prefetch={false} className="mt-6 inline-flex min-h-10 items-center text-sm font-medium text-muted underline decoration-line underline-offset-4 transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          Retour au site public
        </Link>
      </section>
    </main>
  );
}
