'use client';

import React from 'react';

interface PlanetPlacement {
  sign: number; // 0 to 11
  isRetrograde?: boolean;
}

interface NorthIndianChartProps {
  title: string;
  lagnaSign: number; // 0 to 11 (Aries = 0, Pisces = 11)
  planetsMap: Record<string, PlanetPlacement>;
  className?: string;
}

const PLANET_SHORT_NAMES: Record<string, string> = {
  Sun: 'Sun',
  Moon: 'Moon',
  Mars: 'Mars',
  Mercury: 'Merc',
  Jupiter: 'Jup',
  Venus: 'Ven',
  Saturn: 'Sat',
  Rahu: 'Rahu',
  Ketu: 'Ketu',
};

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  title,
  lagnaSign,
  planetsMap,
  className = '',
}) => {
  // House signs (1-indexed display sign number 1 to 12)
  const houseSigns: Record<number, number> = {};
  for (let h = 1; h <= 12; h++) {
    houseSigns[h] = ((lagnaSign + h - 1) % 12) + 1;
  }

  // Map planets to house numbers (1 to 12)
  const housePlanets: Record<number, { name: string; isRetro?: boolean }[]> = {};
  for (let h = 1; h <= 12; h++) housePlanets[h] = [];

  for (const [name, p] of Object.entries(planetsMap)) {
    if (!p) continue;
    const pSignIndex = p.sign;
    const house = ((pSignIndex - lagnaSign + 12) % 12) + 1;
    const displayName = PLANET_SHORT_NAMES[name] || name;
    housePlanets[house].push({ name: displayName, isRetro: p.isRetrograde });
  }

  // SVG Coordinates for 360x360 box
  const housePositions: Record<
    number,
    { sx: number; sy: number; px: number; py: number; textAnchor: 'start' | 'middle' | 'end' }
  > = {
    1: { sx: 180, sy: 75, px: 180, py: 120, textAnchor: 'middle' },
    2: { sx: 90, sy: 50, px: 70, py: 90, textAnchor: 'middle' },
    3: { sx: 50, sy: 90, px: 50, py: 135, textAnchor: 'middle' },
    4: { sx: 110, sy: 180, px: 65, py: 180, textAnchor: 'middle' },
    5: { sx: 50, sy: 270, px: 50, py: 230, textAnchor: 'middle' },
    6: { sx: 90, sy: 310, px: 70, py: 270, textAnchor: 'middle' },
    7: { sx: 180, sy: 285, px: 180, py: 240, textAnchor: 'middle' },
    8: { sx: 270, sy: 310, px: 290, py: 270, textAnchor: 'middle' },
    9: { sx: 310, sy: 270, px: 310, py: 230, textAnchor: 'middle' },
    10: { sx: 250, sy: 180, px: 295, py: 180, textAnchor: 'middle' },
    11: { sx: 310, sy: 90, px: 310, py: 135, textAnchor: 'middle' },
    12: { sx: 270, sy: 50, px: 290, py: 90, textAnchor: 'middle' },
  };

  return (
    <div className={`flex flex-col items-center bg-white border border-[#e8e2d5] rounded-xl p-3 shadow-sm ${className}`}>
      {/* Title */}
      <h3 className="text-sm font-bold text-[#cc6600] mb-2 tracking-wide text-center">
        {title}
      </h3>

      {/* Responsive SVG Chart */}
      <div className="w-full max-w-[340px] aspect-square relative">
        <svg viewBox="0 0 360 360" className="w-full h-full select-none">
          {/* Background fill */}
          <rect x="0" y="0" width="360" height="360" fill="#fffdfa" stroke="#d97706" strokeWidth="2.5" rx="6" />

          {/* Diagonals */}
          <line x1="0" y1="0" x2="360" y2="360" stroke="#d97706" strokeWidth="1.5" opacity="0.85" />
          <line x1="0" y1="360" x2="360" y2="0" stroke="#d97706" strokeWidth="1.5" opacity="0.85" />

          {/* Diamond */}
          <polygon points="180,0 0,180 180,360 360,180" fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.85" />

          {/* Center Om watermark */}
          <text x="180" y="185" textAnchor="middle" dominantBaseline="middle" fill="#f59e0b" opacity="0.08" fontSize="64" fontWeight="bold">
            🕉️
          </text>

          {/* Render House Signs and Planets */}
          {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((h) => {
            const pos = housePositions[h];
            const signNum = houseSigns[h];
            const planets = housePlanets[h];

            return (
              <g key={h}>
                {/* House Sign Number Badge */}
                <circle cx={pos.sx} cy={pos.sy - 3} r="9" fill="#fff0e0" stroke="#f97316" strokeWidth="0.75" />
                <text
                  x={pos.sx}
                  y={pos.sy - 3}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#c2410c"
                >
                  {signNum}
                </text>

                {/* Planets in this house */}
                {planets.map((p, idx) => {
                  const yOffset = pos.py + (idx - (planets.length - 1) / 2) * 16;
                  return (
                    <g key={idx}>
                      {/* Planet pill background */}
                      <rect
                        x={pos.px - 26}
                        y={yOffset - 7}
                        width="52"
                        height="14"
                        rx="4"
                        fill={p.isRetro ? '#fee2e2' : '#fef3c7'}
                        stroke={p.isRetro ? '#ef4444' : '#f59e0b'}
                        strokeWidth="0.75"
                      />
                      <text
                        x={pos.px}
                        y={yOffset}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="9"
                        fontWeight="bold"
                        fill={p.isRetro ? '#991b1b' : '#78350f'}
                      >
                        {p.name}{p.isRetro ? '(R)' : ''}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default NorthIndianChart;
