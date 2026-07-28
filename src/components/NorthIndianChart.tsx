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
    1: { sx: 180, sy: 35, cx: 180, cy: 105 },
    2: { sx: 90, sy: 22, cx: 90, cy: 54 },
    3: { sx: 25, sy: 90, cx: 55, cy: 90 },
    4: { sx: 45, sy: 180, cx: 110, cy: 180 },
    5: { sx: 25, sy: 270, cx: 55, cy: 270 },
    6: { sx: 90, sy: 338, cx: 90, cy: 306 },
    7: { sx: 180, sy: 325, cx: 180, cy: 255 },
    8: { sx: 270, sy: 338, cx: 270, cy: 306 },
    9: { sx: 335, sy: 270, cx: 305, cy: 270 },
    10: { sx: 315, sy: 180, cx: 250, cy: 180 },
    11: { sx: 335, sy: 90, cx: 305, cy: 90 },
    12: { sx: 270, sy: 22, cx: 270, cy: 54 },
  };

  // Helper to layout planet pill badges inside each house boundary
  const renderHousePlanets = (houseNum: number, planets: { name: string; isRetro?: boolean }[]) => {
    if (!planets || planets.length === 0) return null;
    const cfg = houseConfig[houseNum];
    const pillW = 38;
    const pillH = 13;
    const spacing = 15;

    // Single or double planet vertical stack
    if (planets.length <= 2) {
      return (
        <g>
          {planets.map((p, idx) => {
            const py = cfg.cy + (idx - (planets.length - 1) / 2) * spacing;
            return (
              <g key={idx}>
                <rect
                  x={cfg.cx - pillW / 2}
                  y={py - pillH / 2}
                  width={pillW}
                  height={pillH}
                  rx="3"
                  fill={p.isRetro ? '#fee2e2' : '#fffbeb'}
                  stroke={p.isRetro ? '#ef4444' : '#d97706'}
                  strokeWidth="0.75"
                />
                <text
                  x={cfg.cx}
                  y={py + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="8.5"
                  fontWeight="bold"
                  fill={p.isRetro ? '#991b1b' : '#92400e'}
                >
                  {p.name}{p.isRetro ? '(R)' : ''}
                </text>
              </g>
            );
          })}
        </g>
      );
    }

    // 3 or 4 planets: 2-column compact grid
    const cols = 2;
    const colSpacing = 36;
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
            <g key={idx}>
              <rect
                x={px - 17}
                y={py - 6}
                width="34"
                height="12"
                rx="3"
                fill={p.isRetro ? '#fee2e2' : '#fffbeb'}
                stroke={p.isRetro ? '#ef4444' : '#d97706'}
                strokeWidth="0.75"
              />
              <text
                x={px}
                y={py + 0.5}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="8"
                fontWeight="bold"
                fill={p.isRetro ? '#991b1b' : '#92400e'}
              >
                {p.name}{p.isRetro ? '®' : ''}
              </text>
            </g>
          );
        })}
      </g>
    );
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

          {/* Main Diagonal lines */}
          <line x1="0" y1="0" x2="360" y2="360" stroke="#d97706" strokeWidth="1.5" opacity="0.85" />
          <line x1="0" y1="360" x2="360" y2="0" stroke="#d97706" strokeWidth="1.5" opacity="0.85" />

          {/* Inner Diamond */}
          <polygon points="180,0 0,180 180,360 360,180" fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.85" />

          {/* Watermark Om Symbol */}
          <text x="180" y="185" textAnchor="middle" dominantBaseline="middle" fill="#f59e0b" opacity="0.07" fontSize="64" fontWeight="bold">
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
                <circle cx={cfg.sx} cy={cfg.sy} r="8.5" fill="#fff0e0" stroke="#f97316" strokeWidth="0.75" />
                <text
                  x={cfg.sx}
                  y={cfg.sy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9.5"
                  fontWeight="bold"
                  fill="#c2410c"
                >
                  {signNum}
                </text>

                {/* Planets inside house boundary */}
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
