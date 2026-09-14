type Props = { className?: string; size?: number };

export function AranyaMark({ className, size = 48 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="1 2"
        opacity="0.55"
      />
      {/* 8 petals */}
      <g fill="currentColor">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <ellipse
            key={a}
            cx="50"
            cy="22"
            rx="3.4"
            ry="14"
            transform={`rotate(${a} 50 50)`}
            opacity={i % 2 === 0 ? 1 : 0.55}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="3" fill="currentColor" />
      <circle cx="50" cy="50" r="1.2" fill="var(--umber)" />
    </svg>
  );
}
