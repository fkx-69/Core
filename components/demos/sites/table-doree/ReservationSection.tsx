"use client";

import { useId, useState } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import Reveal from "./Reveal";
import { GUEST_OPTIONS, SITE, TIME_SLOTS } from "./data";

type Booking = {
  date: string;
  time: string;
  guests: string;
  name: string;
  phone: string;
};

const EMPTY_BOOKING: Booking = {
  date: "",
  time: "20h00",
  guests: "2 couverts",
  name: "",
  phone: "",
};

/** Formate 2026-07-14 en « mardi 14 juillet 2026 ». */
function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const FIELD_CLASSES =
  "w-full rounded-none border border-[#d8c9ac] bg-[#faf6ef] px-4 py-3 text-[15px] text-[#221a12] placeholder:text-[#a2937e] transition focus:border-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/40";

const LABEL_CLASSES =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b5c4a]";

/** Section « Réserver » : formulaire simulé côté client, sans backend. */
export default function ReservationSection() {
  const uid = useId();
  const [booking, setBooking] = useState<Booking>(EMPTY_BOOKING);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  // Date minimale posée directement sur l'input côté client : hors du rendu,
  // donc aucun écart SSR/hydratation.
  const setMinToday = (input: HTMLInputElement | null) => {
    if (input) input.min = new Date().toISOString().slice(0, 10);
  };

  const set = (key: keyof Booking) => (value: string) =>
    setBooking((current) => ({ ...current, [key]: value }));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmed(booking);
  }

  function reset() {
    setConfirmed(null);
    setBooking(EMPTY_BOOKING);
  }

  return (
    <section
      id="reserver"
      aria-labelledby="reserver-titre"
      className="scroll-mt-24 bg-[#211a12] py-16 text-[#f3ecdd] @3xl:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 @3xl:px-8 @4xl:grid-cols-[5fr_6fr] @4xl:gap-16">
        {/* Colonne éditoriale */}
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">
            Réservation
          </p>
          <h2
            id="reserver-titre"
            className="mt-4 text-4xl leading-[1.05] @3xl:text-5xl [font-family:var(--font-td-serif)]"
          >
            Votre table
            <br />
            <span className="italic text-amber-400">vous attend</span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#b3a48e]">
            Trente-quatre couverts seulement : nous vous conseillons de
            réserver deux à trois jours à l&apos;avance, davantage le week-end.
            Toute demande est confirmée par téléphone ou WhatsApp dans
            l&apos;heure.
          </p>
          <div className="mt-8 border-t border-[#3a3226] pt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#b3a48e]">
              Vous préférez appeler ?
            </p>
            <a
              href={SITE.phoneHref}
              className="mt-2 inline-flex items-center gap-3 text-2xl text-[#f3ecdd] transition hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#211a12] [font-family:var(--font-td-serif)]"
            >
              <Phone className="h-5 w-5 text-amber-400" aria-hidden />
              {SITE.phone}
            </a>
            <p className="mt-2 text-sm text-[#b3a48e]">
              Tous les jours d&apos;ouverture, de 10 h à 23 h.
            </p>
          </div>
        </Reveal>

        {/* Formulaire / confirmation */}
        <Reveal delay={100}>
          {confirmed ? (
            <div
              role="status"
              className="screen-in flex h-full flex-col justify-center bg-[#f2ead9] px-6 py-12 text-[#221a12] @2xl:px-10"
            >
              <CheckCircle2
                className="h-10 w-10 text-amber-700"
                aria-hidden
              />
              <h3 className="mt-5 text-3xl [font-family:var(--font-td-serif)]">
                Demande envoyée
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#6b5c4a]">
                Merci {confirmed.name.trim() || "cher convive"} — nous avons
                bien noté votre demande pour{" "}
                <strong className="font-semibold text-[#221a12]">
                  {confirmed.guests.toLowerCase()}
                </strong>
                , le{" "}
                <strong className="font-semibold text-[#221a12]">
                  {formatDate(confirmed.date)}
                </strong>{" "}
                à{" "}
                <strong className="font-semibold text-[#221a12]">
                  {confirmed.time}
                </strong>
                . Nous vous confirmons la table par WhatsApp au{" "}
                <strong className="font-semibold text-[#221a12]">
                  {confirmed.phone}
                </strong>{" "}
                dans l&apos;heure.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-8 inline-flex w-fit items-center justify-center rounded-full border border-[#221a12]/25 px-6 py-2.5 text-sm font-semibold text-[#221a12] transition hover:border-amber-700 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2ead9]"
              >
                Faire une autre demande
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-[#f2ead9] px-6 py-8 text-[#221a12] @2xl:px-10 @2xl:py-10"
            >
              <div className="grid gap-5 @lg:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-date`} className={LABEL_CLASSES}>
                    Date
                  </label>
                  <input
                    id={`${uid}-date`}
                    type="date"
                    required
                    ref={setMinToday}
                    value={booking.date}
                    onInput={(e) => set("date")(e.currentTarget.value)}
                    className={FIELD_CLASSES}
                  />
                </div>
                <div>
                  <label htmlFor={`${uid}-time`} className={LABEL_CLASSES}>
                    Heure
                  </label>
                  <select
                    id={`${uid}-time`}
                    required
                    value={booking.time}
                    onChange={(e) => set("time")(e.target.value)}
                    className={FIELD_CLASSES}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="@lg:col-span-2">
                  <label htmlFor={`${uid}-guests`} className={LABEL_CLASSES}>
                    Nombre de couverts
                  </label>
                  <select
                    id={`${uid}-guests`}
                    required
                    value={booking.guests}
                    onChange={(e) => set("guests")(e.target.value)}
                    className={FIELD_CLASSES}
                  >
                    {GUEST_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${uid}-name`} className={LABEL_CLASSES}>
                    Nom complet
                  </label>
                  <input
                    id={`${uid}-name`}
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Awa Sarr"
                    value={booking.name}
                    onChange={(e) => set("name")(e.target.value)}
                    className={FIELD_CLASSES}
                  />
                </div>
                <div>
                  <label htmlFor={`${uid}-phone`} className={LABEL_CLASSES}>
                    Téléphone
                  </label>
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="Votre numéro (démonstration)"
                    value={booking.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    className={FIELD_CLASSES}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-8 w-full rounded-full bg-amber-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-[#faf6ef] transition hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2ead9]"
              >
                Demander cette table
              </button>
              <p className="mt-4 text-center text-xs text-[#a2937e]">
                Démonstration — aucune donnée n&apos;est envoyée ni conservée.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
