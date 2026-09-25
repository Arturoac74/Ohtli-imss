import React from 'react';

interface OhtliSymbolProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'glyph-only' | 'light';
}

export const OhtliSymbol: React.FC<OhtliSymbolProps> = ({
  size = 44,
  className = '',
  variant = 'glyph-only',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Official Ohtli Náhuatl Circular Glyph Emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle with black border and white fill */}
          <circle cx="100" cy="100" r="92" fill="#FFFFFF" stroke="#000000" strokeWidth="12" />

          {/* 4 Diagonal Black Wedges (Quadrant Accents) with White Triangular Cutouts */}
          {/* Top-Right Wedge */}
          <path d="M 100 100 L 140 22 A 92 92 0 0 1 178 60 Z" fill="#000000" />
          <path d="M 100 100 L 152 35 L 165 48 Z" fill="#FFFFFF" />

          {/* Bottom-Right Wedge */}
          <path d="M 100 100 L 178 140 A 92 92 0 0 1 140 178 Z" fill="#000000" />
          <path d="M 100 100 L 165 152 L 152 165 Z" fill="#FFFFFF" />

          {/* Bottom-Left Wedge */}
          <path d="M 100 100 L 60 178 A 92 92 0 0 1 22 140 Z" fill="#000000" />
          <path d="M 100 100 L 48 165 L 35 152 Z" fill="#FFFFFF" />

          {/* Top-Left Wedge */}
          <path d="M 100 100 L 22 60 A 92 92 0 0 1 60 22 Z" fill="#000000" />
          <path d="M 100 100 L 35 48 L 48 35 Z" fill="#FFFFFF" />

          {/* 4 Cardinal Axes (Top, Right, Bottom, Left) with Volute Curls */}
          {/* Top Axis */}
          <path d="M 94 100 L 94 28 H 106 L 106 100 Z" fill="#000000" />
          {/* Top Volutes (Speech Scrolls) */}
          <path d="M 94 36 C 82 36 78 22 88 18 C 96 14 98 28 94 28" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 106 36 C 118 36 122 22 112 18 C 104 14 102 28 106 28" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />

          {/* Bottom Axis */}
          <path d="M 94 100 L 94 172 H 106 L 106 100 Z" fill="#000000" />
          {/* Bottom Volutes */}
          <path d="M 94 164 C 82 164 78 178 88 182 C 96 186 98 172 94 172" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 106 164 C 118 164 122 178 112 182 C 104 186 102 172 106 172" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />

          {/* Left Axis */}
          <path d="M 100 94 L 28 94 V 106 L 100 106 Z" fill="#000000" />
          {/* Left Volutes */}
          <path d="M 36 94 C 36 82 22 78 18 88 C 14 96 28 98 28 94" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 36 106 C 36 118 22 122 18 112 C 14 104 28 102 28 106" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />

          {/* Right Axis */}
          <path d="M 100 94 L 172 94 V 106 L 100 106 Z" fill="#000000" />
          {/* Right Volutes */}
          <path d="M 164 94 C 164 82 178 78 182 88 C 186 96 172 98 172 94" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 164 106 C 164 118 178 122 182 112 C 186 104 172 102 172 106" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />

          {/* Center Stepped Fret Box (Xicalcoliuhqui / Náhuatl motif) */}
          <path d="M 72 72 H 128 V 128 H 72 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="10" />
          <path d="M 80 80 H 108 V 92 H 92 V 108 H 120 V 120 H 80 Z" fill="#000000" />

          {/* Central Spiral */}
          <path
            d="M 100 100 C 92 100 86 94 86 86 C 86 76 96 70 106 70 C 120 70 130 82 130 98 C 130 116 112 128 94 128 C 74 128 60 110 60 90"
            stroke="#000000"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex items-center">
          {/* Lowercase 'htli' text matching the official Ohtli logo in guinda/maroon */}
          <span 
            className="text-3xl font-[#6B1D2F] font-[#6B1D2F] font-[#6B1D2F] tracking-tight leading-none text-[#6B1D2F]"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}
          >
            htli
          </span>
          <span className="ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-md bg-[#6B1D2F] text-white tracking-wider">
            2.0
          </span>
        </div>
      )}
    </div>
  );
};

