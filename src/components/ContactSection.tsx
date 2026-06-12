"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type ProfileType = "coiffeur" | "laboratoire" | "entreprise" | "";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  profile: ProfileType;
  comment: string;
}

const profileOptions = [
  { value: "coiffeur" as const, label: "Un coiffeur" },
  { value: "laboratoire" as const, label: "Un laboratoire" },
  { value: "entreprise" as const, label: "Une entreprise" },
];

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-heading text-sm font-semibold text-arkhe-navy md:text-base"
    >
      {children}
      <span className="text-red-500"> *</span>
    </label>
  );
}

function TextField({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <RequiredLabel htmlFor={id}>{label}</RequiredLabel>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-[5px] border border-[#9EA1A8] px-4 font-sans text-sm text-arkhe-navy placeholder:text-[#9EA1A8] outline-none transition-colors focus:border-arkhe-blue md:text-base"
      />
    </div>
  );
}

export function ContactSection() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    profile: "",
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.profile) return;
    setSubmitted(true);
  };

  return (
    <section className="section-container pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center md:gap-6">
        <h1 className="font-heading text-3xl font-bold text-arkhe-navy md:text-5xl">
          Formulaire de contact
        </h1>
        <p className="max-w-2xl font-sans text-sm text-[#6E6E6E] md:text-base">
          Échangez avec nos experts pour découvrir comment intégrer la valorisation des
          cheveux à vos projets et démarches d&apos;innovation.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-lg border border-arkhe-border bg-white shadow-sm md:mt-14">
        <div className="flex flex-col lg:flex-row">
          {/* Panneau latéral */}
          <aside className="card-gradient flex flex-col gap-6 p-8 text-white lg:w-[38%] lg:p-10">
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-xl font-bold text-white md:text-2xl">
                Informations de contact
              </h2>
              <p className="font-sans text-sm leading-relaxed text-white/90 md:text-base">
                Besoin d&apos;un renseignement ? Consultez nos coordonnées ou contactez-nous
                directement via le formulaire ci-dessous.
              </p>
            </div>

            <ul className="flex flex-col gap-4 font-sans text-sm md:text-base">
              <li className="flex items-center gap-3">
                <PhoneIcon />
                <a href="tel:+33656532616" className="hover:underline">
                  +33 6 56 53 26 16
                </a>
              </li>
              <li className="flex items-center gap-3">
                <EmailIcon />
                <a href="mailto:Contact@arkhe.com" className="hover:underline">
                  Contact@arkhe.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <LocationIcon className="mt-0.5 shrink-0" />
                <span>8 rue du général audran, Paris - 75010</span>
              </li>
            </ul>

            <div className="mt-auto flex gap-3 pt-4">
              <SocialLink href="#" label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="#" label="LinkedIn">
                <LinkedInIcon />
              </SocialLink>
              <SocialLink href="#" label="TikTok">
                <TikTokIcon />
              </SocialLink>
            </div>
          </aside>

          {/* Formulaire */}
          <div className="flex flex-1 flex-col p-8 lg:p-10">
            <p className="mb-6 text-right font-sans text-xs text-red-500">
              * Champs obligatoires
            </p>

            {submitted ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
                <p className="font-heading text-xl font-semibold text-arkhe-navy">
                  Message envoyé !
                </p>
                <p className="font-sans text-sm text-[#6E6E6E]">
                  Notre équipe vous recontactera dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField
                    id="firstName"
                    label="Prénom"
                    placeholder="Jean"
                    value={form.firstName}
                    onChange={update("firstName")}
                  />
                  <TextField
                    id="lastName"
                    label="Nom"
                    placeholder="Petit"
                    value={form.lastName}
                    onChange={update("lastName")}
                  />
                </div>

                <TextField
                  id="email"
                  label="Email professionnelle"
                  placeholder="exemple@gmail.com"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                />

                <TextField
                  id="company"
                  label="Entreprise / laboratoire"
                  placeholder="Nom entreprise / laboratoire"
                  value={form.company}
                  onChange={update("company")}
                />

                <fieldset className="flex flex-col gap-3">
                  <legend className="font-heading text-sm font-semibold text-arkhe-navy md:text-base">
                    Je suis<span className="text-red-500"> *</span> :
                  </legend>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    {profileOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-2 font-sans text-sm text-arkhe-navy md:text-base"
                      >
                        <input
                          type="radio"
                          name="profile"
                          value={option.value}
                          checked={form.profile === option.value}
                          onChange={() => update("profile")(option.value)}
                          required
                          className="size-4 accent-arkhe-blue"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-2">
                  <RequiredLabel htmlFor="comment">Commentaire</RequiredLabel>
                  <textarea
                    id="comment"
                    required
                    rows={5}
                    value={form.comment}
                    onChange={(e) => update("comment")(e.target.value)}
                    placeholder="Écrivez un commentaire..."
                    className="w-full resize-y rounded-[5px] border border-[#9EA1A8] px-4 py-3 font-sans text-sm text-arkhe-navy placeholder:text-[#9EA1A8] outline-none transition-colors focus:border-arkhe-blue md:text-base"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="px-10">
                    Envoyer
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-white/40 transition-colors hover:bg-white/10"
    >
      {children}
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        fill="currentColor"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
        fill="currentColor"
      />
    </svg>
  );
}

function LocationIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.4.4 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.4.2-1.1.4-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.4-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .0-1.6.2-2 .3-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.1.4-.3 1-.3 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 1 .2 1.6.3 2 .2.5.4.8.8 1.2.4.4.7.6 1.2.8.4.1 1 .3 2 .3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.6-.2 2-.3.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.1-.4.3-1 .3-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1-.2-1.6-.3-2-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.1-1-.3-2-.3-1.2-.1-1.6-.1-4.7-.1zm0 3.7a4.3 4.3 0 100 8.6 4.3 4.3 0 000-8.6zm0 7.1a2.8 2.8 0 110-5.6 2.8 2.8 0 010 5.6zm5.4-9.2a1 1 0 100 2 1 1 0 000-2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.2h4V23h-4V8.2zm7.3 0h3.8v2h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6v8.9h-4v-7.9c0-1.9 0-4.3-2.6-4.3-2.6 0-3 2-3 4.1V23h-4V8.2z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}
