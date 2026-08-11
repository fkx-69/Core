"use client";

export default function AnalyticsPreferencesButton() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("core:analytics-preferences"))}
      className="text-sm text-muted underline decoration-line underline-offset-4 transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      Gérer mes préférences de confidentialité
    </button>
  );
}

