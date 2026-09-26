import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showTagline?: boolean;
  textColor?: 'dark' | 'light' | 'auto';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  textColor = 'auto',
  className = '',
}) => {
  // Dimensions based on size
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 34;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* High-fidelity Logo Icon Mark */}
      <div 
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-2xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="qGradIcon" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="65%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            <linearGradient id="headbandGradIcon" x1="60" y1="40" x2="140" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>

          {/* Top-Right Red Sparkles */}
          <path d="M 142 22 Q 142 32 152 32 Q 142 32 142 42 Q 142 32 132 32 Q 142 32 142 22 Z" fill="#DC2626" />
          <path d="M 156 36 Q 156 43 163 43 Q 156 43 156 50 Q 156 43 149 43 Q 156 43 156 36 Z" fill="#EF4444" />

          {/* Outer 'Q' Ring with Lower-Right Foot */}
          <path
            d="M 100 26 
               A 64 64 0 1 1 144 146
               L 158 160
               L 142 160
               L 132 150
               A 64 64 0 0 1 100 26 Z"
            fill="url(#qGradIcon)"
          />

          {/* Inner Speech Bubble (Clean White) */}
          <path
            d="M 98 44 
               C 66 44 46 62 46 88 
               C 46 102 54 114 66 122
               L 58 138 
               L 78 129 
               C 84 131 91 132 98 132 
               C 130 132 150 114 150 88 
               C 150 62 130 44 98 44 Z"
            fill="#FFFFFF"
          />

          {/* Robot Headset Headband */}
          <path
            d="M 68 76 C 68 58 80 48 98 48 C 116 48 128 58 128 76"
            stroke="url(#headbandGradIcon)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Ear Cups */}
          <rect x="58" y="70" width="13" height="26" rx="6.5" fill="#DC2626" />
          <rect x="125" y="70" width="13" height="26" rx="6.5" fill="#DC2626" />

          {/* Robot Face Display */}
          <rect x="73" y="66" width="50" height="34" rx="14" fill="#0F172A" />

          {/* Curved Happy Eyes */}
          <path d="M 81 83 Q 86 76 91 83" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 105 83 Q 110 76 115 83" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Mic Arm & Head */}
          <path d="M 130 88 Q 126 108 108 110" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <rect x="100" y="106" width="12" height="7" rx="3.5" fill="#DC2626" />
        </svg>
      </div>

      {/* Brand Wordmark & Optional Tagline */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline">
            <span
              className={`font-black tracking-tight ${
                textColor === 'light'
                  ? 'text-white'
                  : textColor === 'dark'
                  ? 'text-neutral-900'
                  : 'text-neutral-900 dark:text-white'
              } ${size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'}`}
            >
              Resolve
            </span>
            <span
              className={`font-black tracking-tight text-red-500 ${
                size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
              }`}
            >
              IQ
            </span>
          </div>

          {showTagline && (
            <span className="text-[10px] font-medium text-neutral-500 tracking-tight mt-0.5">
              Smarter Support. Faster Resolutions.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
