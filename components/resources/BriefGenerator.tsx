"use client";

import { useState } from "react";
import {
  buildProjectBrief,
  PROJECT_TYPE_OPTIONS,
  type BriefFormValues,
} from "@/components/resources/generator-model";

const INITIAL_VALUES: BriefFormValues = {
  projectName: "",
  projectType: "site-web",
  objective: "",
  users: "",
  firstFlow: "",
  existingTools: "",
  integrations: "",
  constraints: "",
};

const fieldClassName =
  "mt-2 w-full rounded-field border border-line bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/25";

export default function BriefGenerator() {
  const [values, setValues] = useState<BriefFormValues>(INITIAL_VALUES);
  const [brief, setBrief] = useState(() => buildProjectBrief(INITIAL_VALUES));
  const [status, setStatus] = useState("");

  function updateValue(field: keyof BriefFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("");
  }

  function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBrief(buildProjectBrief(values));
    setStatus("Votre mini cahier des charges a été actualisé dans ce navigateur.");
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setStatus("Le cahier des charges a été copié dans le presse-papiers.");
    } catch {
      setStatus(
        "La copie automatique n'est pas disponible. Sélectionnez le texte ci-dessous pour le copier.",
      );
    }
  }

  function downloadBrief() {
    const blob = new Blob([brief], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mini-cahier-des-charges.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatus("Le fichier .txt a été téléchargé depuis ce navigateur.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-12">
      <form
        onSubmit={generate}
        className="space-y-6 rounded-card border border-line bg-surface-raised p-5 shadow-card sm:p-8"
        aria-describedby="generator-privacy"
      >
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Décrivez le premier périmètre
          </h2>
          <p id="generator-privacy" className="mt-2 text-sm leading-relaxed text-muted">
            Les réponses restent dans votre navigateur. Aucun nom, message ou
            formulaire n&apos;est envoyé ni enregistré par cet outil.
          </p>
        </div>

        <div>
          <label htmlFor="project-name" className="text-sm font-semibold">
            Nom du projet ou activité
          </label>
          <input
            id="project-name"
            name="projectName"
            value={values.projectName}
            onChange={(event) => updateValue("projectName", event.target.value)}
            className={fieldClassName}
            placeholder="Ex. suivi des commandes"
            required
          />
        </div>

        <div>
          <label htmlFor="project-type" className="text-sm font-semibold">
            Type de projet
          </label>
          <select
            id="project-type"
            name="projectType"
            value={values.projectType}
            onChange={(event) => updateValue("projectType", event.target.value)}
            className={fieldClassName}
          >
            {PROJECT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="project-objective" className="text-sm font-semibold">
            Quel objectif voulez-vous atteindre ?
          </label>
          <textarea
            id="project-objective"
            name="objective"
            value={values.objective}
            onChange={(event) => updateValue("objective", event.target.value)}
            className={`${fieldClassName} min-h-28`}
            placeholder="Ex. rendre les demandes et leur état visibles par toute l'équipe"
            required
          />
        </div>

        <div>
          <label htmlFor="project-users" className="text-sm font-semibold">
            Qui utilisera le produit ?
          </label>
          <textarea
            id="project-users"
            name="users"
            value={values.users}
            onChange={(event) => updateValue("users", event.target.value)}
            className={`${fieldClassName} min-h-24`}
            placeholder="Profils, équipe, clients ou partenaires concernés"
            required
          />
        </div>

        <div>
          <label htmlFor="project-flow" className="text-sm font-semibold">
            Quel est le premier flux à traiter ?
          </label>
          <textarea
            id="project-flow"
            name="firstFlow"
            value={values.firstFlow}
            onChange={(event) => updateValue("firstFlow", event.target.value)}
            className={`${fieldClassName} min-h-28`}
            placeholder="Décrivez une opération récente, du début à la fin"
            required
          />
        </div>

        <div>
          <label htmlFor="existing-tools" className="text-sm font-semibold">
            Quels outils ou données existent déjà ?
          </label>
          <textarea
            id="existing-tools"
            name="existingTools"
            value={values.existingTools}
            onChange={(event) => updateValue("existingTools", event.target.value)}
            className={`${fieldClassName} min-h-24`}
            placeholder="Excel, WhatsApp, cahiers, site actuel, exports…"
          />
        </div>

        <div>
          <label htmlFor="integrations" className="text-sm font-semibold">
            Connexions ou options à étudier
          </label>
          <textarea
            id="integrations"
            name="integrations"
            value={values.integrations}
            onChange={(event) => updateValue("integrations", event.target.value)}
            className={`${fieldClassName} min-h-24`}
            placeholder="Paiement, livraison, stock, notifications, API…"
          />
        </div>

        <div>
          <label htmlFor="constraints" className="text-sm font-semibold">
            Contraintes, échéance indicative ou priorité
          </label>
          <textarea
            id="constraints"
            name="constraints"
            value={values.constraints}
            onChange={(event) => updateValue("constraints", event.target.value)}
            className={`${fieldClassName} min-h-24`}
            placeholder="Ce qui doit être préservé, testé ou décidé en premier"
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast shadow-card transition hover:-translate-y-0.5 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Générer le mini cahier des charges
        </button>
      </form>

      <section
        aria-labelledby="generated-brief-title"
        className="rounded-card border border-line bg-surface p-5 sm:p-8 lg:sticky lg:top-24"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Résultat local
            </p>
            <h2
              id="generated-brief-title"
              className="mt-2 font-display text-2xl font-bold tracking-tight"
            >
              Votre base de discussion
            </h2>
          </div>
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            .txt disponible
          </span>
        </div>
        <pre className="mt-6 max-h-[38rem] overflow-auto whitespace-pre-wrap rounded-field border border-line bg-background p-4 text-sm leading-relaxed text-foreground">
          {brief}
        </pre>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={copyBrief}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line bg-surface-raised px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Copier le texte
          </button>
          <button
            type="button"
            onClick={downloadBrief}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast shadow-card transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Télécharger le .txt
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-4 min-h-6 text-sm text-muted">
          {status}
        </p>
      </section>
    </div>
  );
}
