export function FloralTopLeft() {
  return (
    <svg className="absolute top-0 left-0 opacity-30 pointer-events-none" width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="40" rx="18" ry="25" fill="#E7B7B7" opacity="0.5" transform="rotate(-20 30 40)" />
      <ellipse cx="55" cy="20" rx="14" ry="20" fill="#E7B7B7" opacity="0.4" transform="rotate(10 55 20)" />
      <ellipse cx="10" cy="70" rx="12" ry="18" fill="#A8B197" opacity="0.35" transform="rotate(-35 10 70)" />
      <ellipse cx="80" cy="35" rx="10" ry="16" fill="#E7B7B7" opacity="0.3" transform="rotate(25 80 35)" />
      <ellipse cx="35" cy="90" rx="14" ry="10" fill="#A8B197" opacity="0.3" transform="rotate(-10 35 90)" />
      <circle cx="55" cy="55" r="8" fill="#E7B7B7" opacity="0.5" />
      <circle cx="30" cy="40" r="5" fill="#fff" opacity="0.6" />
      <circle cx="55" cy="20" r="4" fill="#fff" opacity="0.5" />
      <path d="M5 120 Q30 100 60 120 Q90 140 120 110" stroke="#A8B197" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M10 140 Q25 130 45 145" stroke="#E7B7B7" strokeWidth="1.2" fill="none" opacity="0.4" />
      <ellipse cx="100" cy="70" rx="12" ry="8" fill="#E7B7B7" opacity="0.25" transform="rotate(30 100 70)" />
      <ellipse cx="15" cy="160" rx="16" ry="10" fill="#A8B197" opacity="0.2" transform="rotate(-15 15 160)" />
    </svg>
  );
}

export function FloralTopRight() {
  return (
    <svg className="absolute top-0 right-0 opacity-30 pointer-events-none" width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="190" cy="40" rx="18" ry="25" fill="#E7B7B7" opacity="0.5" transform="rotate(20 190 40)" />
      <ellipse cx="165" cy="20" rx="14" ry="20" fill="#E7B7B7" opacity="0.4" transform="rotate(-10 165 20)" />
      <ellipse cx="210" cy="70" rx="12" ry="18" fill="#A8B197" opacity="0.35" transform="rotate(35 210 70)" />
      <ellipse cx="140" cy="35" rx="10" ry="16" fill="#E7B7B7" opacity="0.3" transform="rotate(-25 140 35)" />
      <ellipse cx="185" cy="90" rx="14" ry="10" fill="#A8B197" opacity="0.3" transform="rotate(10 185 90)" />
      <circle cx="165" cy="55" r="8" fill="#E7B7B7" opacity="0.5" />
      <circle cx="190" cy="40" r="5" fill="#fff" opacity="0.6" />
      <circle cx="165" cy="20" r="4" fill="#fff" opacity="0.5" />
      <path d="M215 120 Q190 100 160 120 Q130 140 100 110" stroke="#A8B197" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M210 140 Q195 130 175 145" stroke="#E7B7B7" strokeWidth="1.2" fill="none" opacity="0.4" />
      <ellipse cx="120" cy="70" rx="12" ry="8" fill="#E7B7B7" opacity="0.25" transform="rotate(-30 120 70)" />
      <ellipse cx="205" cy="160" rx="16" ry="10" fill="#A8B197" opacity="0.2" transform="rotate(15 205 160)" />
    </svg>
  );
}

export function YarnBall({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="#E7B7B7" opacity="0.7" />
      <circle cx="40" cy="40" r="35" stroke="#c49090" strokeWidth="1" fill="none" />
      <path d="M10 30 Q25 20 40 25 Q55 30 70 20" stroke="#c49090" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M8 40 Q25 35 40 40 Q55 45 72 38" stroke="#c49090" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M10 50 Q28 48 40 55 Q55 58 70 50" stroke="#c49090" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M15 60 Q30 62 40 65 Q52 64 65 60" stroke="#c49090" strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M40 5 Q45 25 40 40 Q35 55 40 75" stroke="#c49090" strokeWidth="1.2" fill="none" opacity="0.4" />
      <path d="M20 12 Q35 28 35 40 Q35 55 22 68" stroke="#c49090" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M60 12 Q45 28 45 40 Q45 55 58 68" stroke="#c49090" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="40" cy="40" r="6" fill="#fff" opacity="0.2" />
      <path d="M40 5 Q55 8 60 12" stroke="#E7B7B7" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 12 L65 5" stroke="#E7B7B7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SmallFlower({ color = "#E7B7B7" }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <ellipse
          key={i}
          cx="16"
          cy="8"
          rx="4"
          ry="7"
          fill={color}
          opacity="0.7"
          transform={`rotate(${angle} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="5" fill="#FDF0F0" />
      <circle cx="16" cy="16" r="3" fill={color} opacity="0.9" />
    </svg>
  );
}
