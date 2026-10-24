export default function TeaBowl() {
  return (
    <svg
      viewBox="0 0 420 460"
      className="h-auto w-full max-w-md drop-shadow-[0_24px_40px_rgba(14,26,20,0.28)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bowl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3d5c4c" />
          <stop offset="55%" stopColor="#2f4a3c" />
          <stop offset="100%" stopColor="#1a2e24" />
        </linearGradient>
        <linearGradient id="tea" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#c77a3a" />
          <stop offset="100%" stopColor="#8a4a22" />
        </linearGradient>
      </defs>
      <g className="steam-rise origin-center" style={{ transformOrigin: "210px 90px" }}>
        <path
          d="M170 120c8-28 4-48-6-70"
          fill="none"
          stroke="#e8e2d6"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
      <g className="steam-rise-slow origin-center" style={{ transformOrigin: "210px 90px" }}>
        <path
          d="M210 118c2-32 14-52 8-78"
          fill="none"
          stroke="#e8e2d6"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M250 122c-6-26 8-50 16-72"
          fill="none"
          stroke="#e8e2d6"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
      <ellipse cx="210" cy="168" rx="132" ry="38" fill="#1a1714" opacity="0.2" />
      <path
        d="M78 180c8 110 48 188 132 188s124-78 132-188c-18 18-74 28-132 28S96 198 78 180Z"
        fill="url(#bowl)"
      />
      <ellipse cx="210" cy="176" rx="128" ry="42" fill="#24382e" />
      <ellipse cx="210" cy="176" rx="108" ry="32" fill="url(#tea)" />
      <ellipse cx="186" cy="168" rx="34" ry="10" fill="#e8e2d6" opacity="0.22" />
      <path
        d="M92 214c28 12 88 22 118 22s90-10 118-22"
        fill="none"
        stroke="#b56a3a"
        strokeWidth="2"
        opacity="0.45"
      />
    </svg>
  );
}
