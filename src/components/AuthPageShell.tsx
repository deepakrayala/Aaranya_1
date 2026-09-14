import { Leaf } from "lucide-react";
import { AranyaMark } from "./AranyaMark";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type AuthPageShellProps = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
};

export const authInputClassName =
  "mt-2.5 w-full rounded-sm border border-cream/15 bg-umber/60 px-4 py-3 text-[14px] text-cream outline-none transition placeholder:text-cream/35 focus:border-sand";

export function AuthPageShell({ eyebrow, title, subtitle, children }: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-umber text-cream">
      <div className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.12] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_at_top,oklch(0.34_0.06_52_/_0.7),transparent_68%)]" />

      <SiteHeader />

      <main className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl items-center px-6 py-32 md:px-10 md:py-40">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-sand/80">
              <span className="h-px w-8 bg-sand/50" /> {eyebrow}
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] text-cream md:text-7xl">{title}</h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/65">{subtitle}</p>
            <div className="mt-10 hidden items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-sand/70 md:flex">
              <Leaf className="h-4 w-4 text-terra" /> Private, considered, yours.
            </div>
          </div>

          <section className="rounded-sm border border-cream/12 bg-walnut/35 p-6 shadow-2xl backdrop-blur-sm sm:p-9">
            <AranyaMark size={32} className="text-sand/80" />
            <div className="mt-5">{children}</div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
