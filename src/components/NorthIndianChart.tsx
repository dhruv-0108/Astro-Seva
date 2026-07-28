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

  // Exact centroids and sign badge positions in 360x360 SVG box
  const houseConfig: Record<
    number,
    { sx: number; sy: number; cx: number; cy: number }
  > = {
    1: { sx: 180, sy: 32, cx: 180, cy: 105 },
    2: { sx: 90, sy: 20, cx: 90, cy: 52 },
    3: { sx: 20, sy: 90, cx: 55, cy: 90 },
    4: { sx: 45, sy: 180, cx: 110, cy: 180 },
    5: { sx: 20, sy: 270, cx: 55, cy: 270 },
    6: { sx: 90, sy: 340, cx: 90, cy: 308 },
    7: { sx: 180, sy: 328, cx: 180, cy: 255 },
    8: { sx: 270, sy: 340, cx: 270, cy: 308 },
    9: { sx: 340, sy: 270, cx: 305, cy: 270 },
    10: { sx: 315, sy: 180, cx: 250, cy: 180 },
    11: { sx: 340, sy: 90, cx: 305, cy: 90 },
    12: { sx: 270, sy: 20, cx: 270, cy: 52 },
  };

  // Helper to render plain planet text (without card/pill rect background)
  const renderHousePlanets = (houseNum: number, planets: { name: string; isRetro?: boolean }[]) => {
    if (!planets || planets.length === 0) return null;
    const cfg = houseConfig[houseNum];
    const spacing = 14;

    // 1 or 2 planets: vertical stack
    if (planets.length <= 2) {
      return (
        <g>
          {planets.map((p, idx) => {
            const py = cfg.cy + (idx - (planets.length - 1) / 2) * spacing;
            return (
              <text
                key={idx}
                x={cfg.cx}
                y={py}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                fontWeight="bold"
                fill={p.isRetro ? '#b91c1c' : '#7c2d12'}
              >
                {p.name}{p.isRetro ? '(R)' : ''}
              </text>
            );
          })}
        </g>
      );
    }

    // 3+ planets: 2-column compact grid
    const cols = 2;
    const colSpacing = 38;
    const rowSpacing = 14;
    const totalRows = Math.ceil(planets.length / cols);

    return (
      <g>
        {planets.map((p, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const px = cfg.cx + (col - 0.5) * colSpacing;
          const py = cfg.cy + (row - (totalRows - 1) / 2) * rowSpacing;

          return (
            <text
              key={idx}
              x={px}
              y={py}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fontWeight="bold"
              fill={p.isRetro ? '#b91c1c' : '#7c2d12'}
            >
              {p.name}{p.isRetro ? '(R)' : ''}
            </text>
          );
        })}
      </g>
    );
  };

  return (
    <div className={`flex flex-col items-center bg-white border border-[#e8e2d5] rounded-2xl p-4 shadow-sm w-full ${className}`}>
      {/* Title */}
      <h3 className="text-base font-bold text-[#cc6600] mb-3 tracking-wide text-center">
        {title}
      </h3>

      {/* Large Responsive SVG Chart */}
      <div className="w-full max-w-[500px] aspect-square relative">
        <svg viewBox="0 0 360 360" className="w-full h-full select-none">
          {/* Background fill */}
          <rect x="0" y="0" width="360" height="360" fill="#fffdfa" stroke="#d97706" strokeWidth="2.5" rx="8" />

          {/* Main Diagonals */}
          <line x1="0" y1="0" x2="360" y2="360" stroke="#d97706" strokeWidth="1.5" opacity="0.85" />
          <line x1="0" y1="360" x2="360" y2="0" stroke="#d97706" strokeWidth="1.5" opacity="0.85" />

          {/* Inner Diamond */}
          <polygon points="180,0 0,180 180,360 360,180" fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.85" />

          {/* Watermark Om Symbol */}
          <text x="180" y="185" textAnchor="middle" dominantBaseline="middle" fill="#f59e0b" opacity="0.06" fontSize="72" fontWeight="bold">
            🕉️
          </text>

          {/* Render 12 House Sign Badges and Planets */}
          {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((h) => {
            const cfg = houseConfig[h];
            const signNum = houseSigns[h];
            const planets = housePlanets[h];

            return (
              <g key={h}>
                {/* House Sign Number Badge */}
                <circle cx={cfg.sx} cy={cfg.sy} r="9" fill="#fff0e0" stroke="#f97316" strokeWidth="0.75" />
                <text
                  x={cfg.sx}
                  y={cfg.sy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#c2410c"
                >
                  {signNum}
                </text>

                {/* Planets (Plain text, no background card rect) */}
                {renderHousePlanets(h, planets)}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default NorthIndianChart;
