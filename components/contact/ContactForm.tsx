"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Send } from "lucide-react";
import Button from "@/components/ui/Button";

const PROJECT_TYPES = [
  "Site web",
  "Application web",
  "Application mobile",
  "Software sur mesure",
  "Autre",
] as const;

type FormValues = {
  nom: string;
  email: string;
  telephone: string;
  typeProjet: string;
  message: string;
};

type Field = keyof FormValues;

const INITIAL_VALUES: FormValues = {
  nom: "",
  email: "",
  telephone: "",
  typeProjet: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_INTL_RE = /^\+?[0-9][0-9 .-]{7,18}$/;

function validateField(field: Field, values: FormValues): string | null {
  const value = values[field].trim();
  switch (field) {
    case "nom":
      return value ? null : "Veuillez indiquer votre nom.";
    case "email":
      if (!value) return "Veuillez indiquer votre adresse e-mail.";
      return EMAIL_RE.test(value)
        ? null
        : "Cette adresse e-mail ne semble pas valide.";
    case "telephone":
      // Optionnel, mais vérifié si renseigné.
      if (!value) return null;
      return PHONE_INTL_RE.test(value)
        ? null
        : "Entrez un numéro valide.";
    case "typeProjet":
      return value ? null : "Veuillez sélectionner un type de projet.";
    case "message":
      if (!value) return "Veuillez décrire votre projet.";
      return value.length >= 10
        ? null
        : "Votre message doit contenir au moins 10 caractères.";
  }
}

const inputClasses =
  "min-h-12 w-full rounded-field border border-line bg-surface-raised px-4 py-3 text-base text-foreground placeholder:text-muted/70 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-danger sm:text-sm";

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  function handleChange(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    // Efface l'erreur dès que l'utilisateur corrige.
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleBlur(field: Field) {
    const error = validateField(field, values);
    if (error) setErrors((e) => ({ ...e, [field]: error }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Partial<Record<Field, string>> = {};
    (Object.keys(values) as Field[]).forEach((field) => {
      const error = validateField(field, values);
      if (error) nextErrors[field] = error;
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Envoi simulé : pas de backend.
    setStatus("sending");
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      setStatus("sent");
    }, 900);
  }

  function resetForm() {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setValues(INITIAL_VALUES);
    setErrors({});
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center rounded-card border border-line bg-surface-raised p-10 text-center shadow-card"
      >
        <Image
          src="/assets/illustrations/contact-success.webp"
          alt=""
          width={900}
          height={900}
          className="h-auto w-full max-w-56 dark:brightness-200"
          aria-hidden
        />
        <h2 className="mt-4 font-display text-2xl font-semibold">
          Merci, {values.nom.trim().split(" ")[0]} !
        </h2>
        <p className="mt-2 max-w-sm leading-relaxed text-muted">
          Ceci est une démonstration : votre message n&apos;a pas été transmis.
        </p>
        <Button variant="outline" className="mt-8 w-full sm:w-auto" onClick={resetForm}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div>
          <label htmlFor="nom" className="mb-1.5 block text-sm font-medium">
            Nom <span className="text-accent">*</span>
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            autoComplete="name"
            placeholder="Votre nom"
            value={values.nom}
            onChange={(e) => handleChange("nom", e.target.value)}
            onBlur={() => handleBlur("nom")}
            aria-invalid={!!errors.nom}
            aria-describedby={errors.nom ? "nom-error" : undefined}
            className={inputClasses}
          />
          {errors.nom && (
            <p id="nom-error" role="alert" className="mt-1.5 text-sm text-danger">
              {errors.nom}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            E-mail <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vous@entreprise.com"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClasses}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 text-sm text-danger">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="telephone"
            className="mb-1.5 block text-sm font-medium"
          >
            Téléphone{" "}
            <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            autoComplete="tel"
            placeholder="Votre numéro (facultatif)"
            value={values.telephone}
            onChange={(e) => handleChange("telephone", e.target.value)}
            onBlur={() => handleBlur("telephone")}
            aria-invalid={!!errors.telephone}
            aria-describedby={errors.telephone ? "telephone-error" : undefined}
            className={inputClasses}
          />
          {errors.telephone && (
            <p id="telephone-error" role="alert" className="mt-1.5 text-sm text-danger">
              {errors.telephone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="typeProjet"
            className="mb-1.5 block text-sm font-medium"
          >
            Type de projet <span className="text-accent">*</span>
          </label>
          <select
            id="typeProjet"
            name="typeProjet"
            value={values.typeProjet}
            onChange={(e) => handleChange("typeProjet", e.target.value)}
            onBlur={() => handleBlur("typeProjet")}
            aria-invalid={!!errors.typeProjet}
            aria-describedby={errors.typeProjet ? "typeProjet-error" : undefined}
            className={inputClasses}
          >
            <option value="">Sélectionnez…</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.typeProjet && (
            <p id="typeProjet-error" role="alert" className="mt-1.5 text-sm text-danger">
              {errors.typeProjet}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Décrivez votre projet en quelques lignes…"
            value={values.message}
            onChange={(e) => handleChange("message", e.target.value)}
            onBlur={() => handleBlur("message")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`${inputClasses} resize-y`}
          />
          {errors.message && (
            <p id="message-error" role="alert" className="mt-1.5 text-sm text-danger">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Envoi en cours…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden />
              Envoyer le message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
