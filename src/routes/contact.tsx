import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Instagram, ArrowRight, Send } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import contactHero from "@/assets/contact-hero.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aranya Apothecary" },
      {
        name: "description",
        content:
          "Speak with the Aranya herbalists. Visit the flagship apothecary in Bengaluru, or write to us about partnerships, press and bespoke protocols.",
      },
      { property: "og:title", content: "Contact Aranya" },
      { property: "og:description", content: "Herbalists, hours and the door of the apothecary." },
    ],
  }),
  component: ContactPage,
});

const channels = [
  { icon: Mail, label: "Write", value: "hello@aranya.earth", sub: "Reply within 24 hours" },
  { icon: Phone, label: "Call", value: "+91 80 4000 8200", sub: "Mon–Sat · 10:00 to 19:00 IST" },
  { icon: MapPin, label: "Visit", value: "12 Lavelle Road, Bengaluru 560 001", sub: "By appointment, Tue–Sun" },
  { icon: Instagram, label: "Follow", value: "@aranya.earth", sub: "Field notes & rituals" },
];

const subjects = ["A product question", "Bespoke protocol", "Wholesale & retail", "Press & partnerships", "Something else"];

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative bg-umber text-cream">
      <div className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.12] mix-blend-overlay" />

      <PageHero
        eyebrow="Contact · The Apothecary"
        title={
          <>
            The door is open.{" "}
            <em className="not-italic italic text-terra">Walk in, write in.</em>
          </>
        }
        subtitle="Our herbalists answer every letter personally. For visits, the flagship sits behind a quiet linen curtain on Lavelle Road."
        image={contactHero}
        imageAlt="Aranya flagship apothecary interior"
      />

      {/* CHANNELS */}
      <section className="border-y border-cream/10 bg-walnut/25 px-6 py-14 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.label} delay={i * 0.08}>
                <div className="h-full rounded-sm border border-cream/10 bg-umber/40 p-6 transition hover:border-sand/40">
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-sand/70">
                    <Icon className="h-4 w-4 text-terra" />
                    {c.label}
                  </div>
                  <p className="mt-5 font-display text-xl text-cream">{c.value}</p>
                  <p className="mt-2 text-[12px] text-cream/55">{c.sub}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FORM + ASIDE */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.32em] text-sand/70">Write to us</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Tell us what your <em className="italic text-terra not-italic">body is asking for.</em>
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-12 space-y-7"
            >
              <div className="grid gap-7 md:grid-cols-2">
                <Field label="Full name" name="name" placeholder="Ananya Rao" />
                <Field label="Email" name="email" type="email" placeholder="you@domain.com" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.32em] text-sand/70">Subject</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {subjects.map((s, i) => (
                    <label key={s} className="cursor-pointer">
                      <input type="radio" name="subject" defaultChecked={i === 0} className="peer sr-only" />
                      <span className="inline-block rounded-full border border-cream/15 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-cream/70 transition peer-checked:border-sand peer-checked:bg-sand peer-checked:text-umber">
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.32em] text-sand/70">Your letter</label>
                <textarea
                  rows={6}
                  placeholder="Share what you're working with — energy, sleep, recovery, skin, or simply curiosity."
                  className="mt-3 w-full resize-none rounded-sm border border-cream/15 bg-umber/60 px-4 py-3 text-[14px] text-cream placeholder:text-cream/35 outline-none transition focus:border-sand"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="group inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3 text-[12px] uppercase tracking-[0.25em] text-umber transition hover:bg-sand"
              >
                {sent ? "Letter received" : "Send the letter"}
                {sent ? <Send className="h-4 w-4" /> : <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}
              </motion.button>

              {sent && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12px] uppercase tracking-[0.22em] text-sand/80"
                >
                  Thank you. A herbalist will write back within a working day.
                </motion.p>
              )}
            </form>
          </Reveal>

          {/* ASIDE — HOURS / MAP CARD */}
          <Reveal delay={0.15}>
            <div className="sticky top-28 space-y-6">
              <div className="overflow-hidden rounded-sm border border-cream/10 bg-walnut/40">
                <div className="relative aspect-[4/3] overflow-hidden bg-umber">
                  <img
                    src={contactHero}
                    alt="Aranya flagship interior"
                    loading="lazy"
                    width={1600}
                    height={1024}
                    className="h-full w-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-umber via-umber/30 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="text-[10px] uppercase tracking-[0.32em] text-sand/80">Flagship apothecary</span>
                    <p className="mt-2 font-display text-2xl">Lavelle Road, Bengaluru</p>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  {[
                    { d: "Tuesday — Friday", h: "11:00 — 19:30" },
                    { d: "Saturday — Sunday", h: "10:00 — 20:00" },
                    { d: "Monday", h: "Closed for harvest" },
                  ].map((row) => (
                    <div key={row.d} className="flex items-baseline justify-between border-b border-cream/8 pb-3 last:border-0 last:pb-0">
                      <span className="text-[12px] uppercase tracking-[0.22em] text-cream/65">{row.d}</span>
                      <span className="font-display text-sand">{row.h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-sm border border-sand/20 bg-walnut/30 p-6">
                <span className="text-[10px] uppercase tracking-[0.32em] text-sand/70">Bespoke consultation</span>
                <p className="mt-3 text-[14px] leading-relaxed text-cream/75">
                  Book a 45-minute private session with a senior herbalist — pulse reading, dosha mapping and a custom 28-day protocol. ₹ 2,400, redeemable against your first kit.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-[10px] uppercase tracking-[0.32em] text-sand/70">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-3 w-full rounded-sm border border-cream/15 bg-umber/60 px-4 py-3 text-[14px] text-cream placeholder:text-cream/35 outline-none transition focus:border-sand"
      />
    </div>
  );
}
