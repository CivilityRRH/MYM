import React from 'react';

interface MindYourMannersLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'light' | 'dark';
}

export const MindYourMannersLogo: React.FC<MindYourMannersLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  variant = 'dark',
}) => {
  const sizeMap = {
    sm: { width: 220 },
    md: { width: 340 },
    lg: { width: 460 },
    xl: { width: 580 },
  };

  const dims = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      <svg
        viewBox="0 0 600 270"
        className="w-full max-w-full h-auto drop-shadow-[0_4px_25px_rgba(212,175,55,0.3)]"
        style={{ maxWidth: dims.width }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Rich Metallic Gold Linear Gradient */}
          <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="20%" stopColor="#E6C260" />
            <stop offset="45%" stopColor="#C69214" />
            <stop offset="65%" stopColor="#FDF0A6" />
            <stop offset="85%" stopColor="#A87508" />
            <stop offset="100%" stopColor="#F3D375" />
          </linearGradient>

          {/* Deep Bevel Gold Gradient for Shadows/Folds */}
          <linearGradient id="goldShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DFB243" />
            <stop offset="50%" stopColor="#966700" />
            <stop offset="100%" stopColor="#573B00" />
          </linearGradient>

          {/* Bright Highlight Gold */}
          <linearGradient id="goldHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B3810F" />
            <stop offset="50%" stopColor="#FFF8D6" />
            <stop offset="100%" stopColor="#D4A017" />
          </linearGradient>

          {/* Crisp Silver/White Chrome or Warm Dark Charcoal for Title Text */}
          <linearGradient id="silverChrome" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={variant === 'light' ? '#2D2823' : '#FFFFFF'} />
            <stop offset="60%" stopColor={variant === 'light' ? '#1A1714' : '#EEEEEE'} />
            <stop offset="100%" stopColor={variant === 'light' ? '#0F0D0B' : '#CCCCCC'} />
          </linearGradient>
        </defs>

        {/* --- GEOMETRIC 'M' EMBLEM & HANDSHAKE --- */}
        <g transform="translate(0, 0)">
          {/* Outer Left M Leg */}
          <path
            d="M 205 50 L 228 35 L 228 130 L 205 112 Z"
            fill="url(#goldMetallic)"
          />

          {/* Left Upper Slanted Roof Bar with Hollow Slit */}
          <path
            d="M 228 35 L 285 75 L 270 86 L 228 56 Z"
            fill="url(#goldHighlight)"
          />
          {/* Cutout slit in left upper roof */}
          <polygon points="238,47 272,71 264,77 238,57" fill={variant === 'light' ? '#FAF8F5' : '#000000'} />

          {/* Outer Right M Leg */}
          <path
            d="M 395 50 L 372 35 L 372 130 L 395 112 Z"
            fill="url(#goldMetallic)"
          />

          {/* Right Upper Slanted Roof Bar with Hollow Slit */}
          <path
            d="M 372 35 L 315 75 L 330 86 L 372 56 Z"
            fill="url(#goldHighlight)"
          />
          {/* Cutout slit in right upper roof */}
          <polygon points="362,47 328,71 336,77 362,57" fill={variant === 'light' ? '#FAF8F5' : '#000000'} />

          {/* Bottom V Chevron Frame Enclosing Handshake */}
          <path
            d="M 228 130 L 300 178 L 372 130 L 354 118 L 300 154 L 246 118 Z"
            fill="url(#goldMetallic)"
          />

          {/* Inner Shadow V Layer */}
          <path
            d="M 246 118 L 300 154 L 354 118 L 344 110 L 300 138 L 256 110 Z"
            fill="url(#goldShadow)"
          />

          {/* --- HANDSHAKE CENTER PIECE --- */}
          {/* Left Forearm / Sleeve */}
          <path
            d="M 252 82 L 272 96 L 262 108 L 242 94 Z"
            fill="url(#goldMetallic)"
          />

          {/* Right Forearm / Sleeve */}
          <path
            d="M 348 82 L 328 96 L 338 108 L 358 94 Z"
            fill="url(#goldMetallic)"
          />

          {/* Clasping Top Thumb & Hand */}
          <path
            d="M 272 96 C 280 88, 298 84, 310 94 C 316 99, 312 106, 302 108 C 290 110, 278 102, 272 96 Z"
            fill="url(#goldHighlight)"
          />

          {/* Bottom Fingers Wrapped Around Hand (4 Distinct Fingers) */}
          {/* Finger 1 */}
          <path d="M 280 108 L 290 120 L 298 116 L 288 104 Z" fill="url(#goldMetallic)" />
          {/* Finger 2 */}
          <path d="M 288 111 L 298 123 L 306 119 L 296 107 Z" fill="url(#goldMetallic)" />
          {/* Finger 3 */}
          <path d="M 296 114 L 306 126 L 314 122 L 304 110 Z" fill="url(#goldMetallic)" />
          {/* Finger 4 */}
          <path d="M 304 117 L 314 129 L 322 125 L 312 113 Z" fill="url(#goldMetallic)" />

          {/* Handshake Center Gold Outline Highlights */}
          <path
            d="M 270 95 Q 300 82 320 100"
            stroke="url(#goldHighlight)"
            strokeWidth="2.5"
            fill="none"
          />
        </g>

        {/* --- BRAND NAME: MIND YOUR MANNERS --- */}
        {/* Initial M, Y, M are stylized larger caps matching the photo */}
        <g transform="translate(300, 218)">
          <text
            textAnchor="middle"
            fill="url(#silverChrome)"
            fontFamily="'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif"
            fontWeight="700"
            letterSpacing="1.5"
          >
            <tspan fontSize="36" dy="0">M</tspan>
            <tspan fontSize="28" dy="-2">IND </tspan>
            <tspan fontSize="36" dy="2">Y</tspan>
            <tspan fontSize="28" dy="-2">OUR </tspan>
            <tspan fontSize="36" dy="2">M</tspan>
            <tspan fontSize="28" dy="-2">ANNERS</tspan>
          </text>
        </g>

        {/* Horizontal Underline Accent Line */}
        <line
          x1="105"
          y1="232"
          x2="495"
          y2="232"
          stroke="url(#goldMetallic)"
          strokeWidth="1.8"
        />

        {/* --- TAGLINE: TRAIN • HIRE • IMPRESS • SUSTAIN --- */}
        {showTagline && (
          <text
            x="300"
            y="256"
            textAnchor="middle"
            fill="url(#goldMetallic)"
            fontFamily="'Cinzel', 'Montserrat', 'JetBrains Mono', sans-serif"
            fontSize="13.5"
            fontWeight="800"
            letterSpacing="3.5"
          >
            TRAIN • HIRE • IMPRESS • SUSTAIN
          </text>
        )}
      </svg>
    </div>
  );
};

