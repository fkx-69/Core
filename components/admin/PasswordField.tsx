"use client";

import type { InputHTMLAttributes } from "react";
import { useState } from "react";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordField({ className = "", disabled, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={`w-full rounded-field border border-line bg-background px-4 py-3 pr-24 text-base outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      />
      <button
        type="button"
        aria-controls={props.id}
        aria-pressed={visible}
        disabled={disabled}
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-1 right-1 min-w-20 rounded-field px-2 text-xs font-semibold text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {visible ? "Masquer" : "Afficher"}
      </button>
    </div>
  );
}
