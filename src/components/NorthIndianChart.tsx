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
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
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

  // Centroids & Sign Badge positions in 360x360 SVG box
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

  // Render plain planet text in a single clean vertical column inside house boundaries
  const renderHousePlanets = (houseNum: number, planets: { name: string; isRetro?: boolean }[]) => {
    if (!planets || planets.length === 0) return null;
    const cfg = houseConfig[houseNum];
    const count = planets.length;
    const spacing = count > 3 ? 13 : 15;
    const fontSize = count > 3 ? 10 : 11;

    return (
      <g>
        {planets.map((p, idx) => {
          const py = cfg.cy + (idx - (count - 1) / 2) * spacing;
          return (
            <text
              key={idx}
              x={cfg.cx}
              y={py}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={fontSize}
              fontWeight="700"
              fill={p.isRetro ? '#B91C1C' : '#1C1917'}
            >
              {p.name}{p.isRetro ? '(R)' : ''}
            </text>
          );
        })}
      </g>
    );
  };

  return (
    <div className={`flex flex-col items-center bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full max-w-[540px] ${className}`}>
      {/* Title */}
      <h3 className="text-base font-bold text-stone-900 mb-5 tracking-wide text-center uppercase tracking-wider text-xs">
        {title}
      </h3>

      {/* SVG Chart */}
      <div className="w-full aspect-square relative">
        <svg viewBox="0 0 360 360" className="w-full h-full select-none">
          {/* Background fill */}
          <rect x="0" y="0" width="360" height="360" fill="#FAF9F5" stroke="#B45309" strokeWidth="2" rx="12" />

          {/* Main Diagonals */}
          <line x1="0" y1="0" x2="360" y2="360" stroke="#B45309" strokeWidth="1.25" opacity="0.75" />
          <line x1="0" y1="360" x2="360" y2="0" stroke="#B45309" strokeWidth="1.25" opacity="0.75" />

          {/* Inner Diamond */}
          <polygon points="180,0 0,180 180,360 360,180" fill="none" stroke="#B45309" strokeWidth="1.25" opacity="0.75" />

          {/* Render 12 House Sign Badges and Planets */}
          {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((h) => {
            const cfg = houseConfig[h];
            const signNum = houseSigns[h];
            const planets = housePlanets[h];

            return (
              <g key={h}>
                {/* House Sign Number Badge */}
                <circle cx={cfg.sx} cy={cfg.sy} r="9" fill="#FFFBEB" stroke="#B45309" strokeWidth="0.75" />
                <text
                  x={cfg.sx}
                  y={cfg.sy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#B45309"
                >
                  {signNum}
                </text>

                {/* Planets */}
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
