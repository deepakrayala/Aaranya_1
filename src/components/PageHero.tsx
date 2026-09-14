import { motion } from "framer-motion";
import { SiteHeader } from "./SiteHeader";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  image: string;
  imageAlt: string;
};

export function PageHero({ eyebrow, title, subtitle, image, imageAlt }: Props) {
  return (
    <section className="relative isolate overflow-hidden">
      <SiteHeader />
      <div className="absolute inset-0 -z-10">
        <img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover"
          width={1600}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-umber/85 via-umber/60 to-umber" />
      </div>
      <div className="mx-auto flex min-h-[62svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-40 md:px-10 md:pb-24 md:pt-44">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-sand/80"
        >
          <span className="h-px w-8 bg-sand/50" /> {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-shadow-soft mt-5 max-w-3xl font-display text-[clamp(2.4rem,5.4vw,4.75rem)] leading-[1.02] text-cream"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-5 max-w-xl text-[15px] leading-relaxed text-cream/70"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
