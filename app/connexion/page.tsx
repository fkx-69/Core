import type { Metadata } from "next";

import {
  hasPreviewAuthConfiguration,
  previewAuthEnabled,
  safeReturnPath,
} from "@/lib/preview-auth";

export const metadata: Metadata = {
  title: "Accès privé",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    erreur?: string | string[];
    next?: string | string[];
  }>;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const returnPath = safeReturnPath(first(params.next));
  const configurationError =
    previewAuthEnabled() && !hasPreviewAuthConfiguration();
  const invalidPassword = first(params.erreur) === "mot-de-passe";

  return (
    <main className="dot-grid grid min-h-svh place-items-center px-5 py-10">
      <section
        className="w-full max-w-md rounded-card border border-line bg-surface-raised p-7 shadow-raised sm:p-9"
        aria-labelledby="login-title"
      >
        <div className="mb-8 flex items-center gap-3">
          <span
            className="grid size-10 place-items-center rounded-xl bg-accent font-display text-lg font-bold text-accent-contrast"
            aria-hidden
          >
            C
          </span>
          <div>
            <p className="font-display text-lg font-semibold leading-none">
              Core
            </p>
            <p className="mt-1 text-xs text-muted">Prévisualisation privée</p>
          </div>
        </div>

        <h1
          id="login-title"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          Accéder au site
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Saisissez le mot de passe partagé pour ouvrir cette prévisualisation.
        </p>

        <form
          action="/api/preview/login"
          method="post"
          className="mt-7 space-y-5"
        >
          <input type="hidden" name="next" value={returnPath} />

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              maxLength={512}
              aria-invalid={invalidPassword || configurationError}
              aria-describedby={
                invalidPassword || configurationError
                  ? "login-error"
                  : "login-help"
              }
              className="w-full rounded-field border border-line bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="Votre mot de passe"
            />
          </div>

          {invalidPassword || configurationError ? (
            <p
              id="login-error"
              role="alert"
              className="rounded-field bg-danger-soft px-3 py-2.5 text-sm text-danger"
            >
              {configurationError
                ? "L’accès privé est temporairement indisponible."
                : "Le mot de passe est incorrect. Réessayez."}
            </p>
          ) : (
            <p id="login-help" className="text-xs leading-5 text-muted">
              Ce navigateur restera connecté pendant 30 jours.
            </p>
          )}

          <button
            type="submit"
            disabled={configurationError}
            className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuer
          </button>
        </form>
      </section>
    </main>
  );
}
