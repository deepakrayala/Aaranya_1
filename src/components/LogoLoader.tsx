import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function LogoLoader({ duration = 2200 }: { duration?: number }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="logo-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[var(--umber)]"
        >
          {/* radial warmth */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--clay) 28%, transparent) 0%, transparent 55%)",
            }}
          />
          {/* drifting grain */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 1.2 }}
            className="bg-grain pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
          />

          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* orbiting outer ring */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 140 140" width={160} height={160}>
                  <circle
                    cx="70"
                    cy="70"
                    r="66"
                    fill="none"
                    stroke="var(--sand)"
                    strokeOpacity="0.35"
                    strokeWidth="0.6"
                    strokeDasharray="1 4"
                  />
                </svg>
              </motion.div>

              {/* counter-rotating inner dashed ring */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 140 140" width={160} height={160}>
                  <circle
                    cx="70"
                    cy="70"
                    r="56"
                    fill="none"
                    stroke="var(--terra)"
                    strokeOpacity="0.5"
                    strokeWidth="0.5"
                    strokeDasharray="2 6"
                  />
                </svg>
              </motion.div>

              {/* mark */}
              <svg
                viewBox="0 0 100 100"
                width={160}
                height={160}
                className="text-[var(--sand)]"
                aria-label="Aranya"
              >
                {/* core breath */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.6"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.55 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="1 2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.55 }}
                  transition={{ duration: 1.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* petals bloom */}
                <g>
                  {PETAL_ANGLES.map((a, i) => (
                    <motion.ellipse
                      key={a}
                      cx="50"
                      cy="22"
                      rx="3.4"
                      ry="14"
                      fill="currentColor"
                      transform={`rotate(${a} 50 50)`}
                      initial={{ opacity: 0, scale: 0.2 }}
                      animate={{ opacity: i % 2 === 0 ? 1 : 0.55, scale: 1 }}
                      style={{ transformOrigin: "50px 50px", transformBox: "fill-box" as never }}
                      transition={{
                        duration: 0.7,
                        delay: 0.25 + i * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  ))}
                </g>

                {/* pulsing seed */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="3"
                  fill="currentColor"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ duration: 1.1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "50px 50px" }}
                />
                <circle cx="50" cy="50" r="1.2" fill="var(--umber)" />
              </svg>
            </motion.div>

            {/* wordmark with staggered letters */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex overflow-hidden">
                {"ARANYA".split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 28, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.6 + i * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="font-display text-[var(--cream)] text-3xl tracking-[0.6em] pl-[0.6em]"
                  >
                    {ch}
                  </motion.span>
                ))}
              </div>

              {/* hairline progress */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: duration / 1000 - 0.3, ease: "easeInOut" }}
                style={{ transformOrigin: "left" }}
                className="h-px w-40 bg-gradient-to-r from-transparent via-[var(--sand)] to-transparent"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-[10px] uppercase tracking-[0.5em] text-[var(--sand)]"
              >
                sacred botanicals
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
