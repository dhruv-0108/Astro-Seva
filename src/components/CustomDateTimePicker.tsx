'use client';

import React from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  label?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CustomDatePicker({ value, onChange, label = 'Date of Birth' }: CustomDatePickerProps) {
  const parseVal = (valStr: string) => {
    if (!valStr || !valStr.includes('-')) {
      return { year: 1995, month: 1, day: 1 };
    }
    const [y, m, d] = valStr.split('-').map(Number);
    return {
      year: y || 1995,
      month: m || 1,
      day: d || 1,
    };
  };

  const { year, month, day } = parseVal(value);

  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= 1930; y--) {
    years.push(y);
  }

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m, 0).getDate();
  };
  const maxDays = getDaysInMonth(year, month);
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  const handleYearChange = (newYear: number) => {
    const maxD = getDaysInMonth(newYear, month);
    const validDay = Math.min(day, maxD);
    const mStr = String(month).padStart(2, '0');
    const dStr = String(validDay).padStart(2, '0');
    onChange(`${newYear}-${mStr}-${dStr}`);
  };

  const handleMonthChange = (newMonth: number) => {
    const maxD = getDaysInMonth(year, newMonth);
    const validDay = Math.min(day, maxD);
    const mStr = String(newMonth).padStart(2, '0');
    const dStr = String(validDay).padStart(2, '0');
    onChange(`${year}-${mStr}-${dStr}`);
  };

  const handleDayChange = (newDay: number) => {
    const mStr = String(month).padStart(2, '0');
    const dStr = String(newDay).padStart(2, '0');
    onChange(`${year}-${mStr}-${dStr}`);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[12px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 stroke-[2] text-[#A14E15]" />
          <span>{label}</span>
        </label>
      )}

      <div className="grid grid-cols-3 gap-2">
        {/* Day Select */}
        <div className="relative">
          <select
            value={day}
            onChange={(e) => handleDayChange(Number(e.target.value))}
            className="w-full appearance-none bg-white border border-stone-200 rounded-2xl py-3.5 px-3 text-sm font-bold text-stone-900 outline-none focus:border-[#A14E15] focus:ring-2 focus:ring-amber-500/10 cursor-pointer shadow-2xs pr-8"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {String(d).padStart(2, '0')} (Day)
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-4 pointer-events-none" />
        </div>

        {/* Month Select */}
        <div className="relative">
          <select
            value={month}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="w-full appearance-none bg-white border border-stone-200 rounded-2xl py-3.5 px-3 text-sm font-bold text-stone-900 outline-none focus:border-[#A14E15] focus:ring-2 focus:ring-amber-500/10 cursor-pointer shadow-2xs pr-8"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {name.slice(0, 3)}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-4 pointer-events-none" />
        </div>

        {/* Year Select */}
        <div className="relative">
          <select
            value={year}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="w-full appearance-none bg-amber-50/70 border border-amber-300 rounded-2xl py-3.5 px-3 text-sm font-black text-[#59141D] outline-none focus:border-[#A14E15] focus:ring-2 focus:ring-amber-500/10 cursor-pointer shadow-2xs pr-8"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-amber-700 absolute right-2.5 top-4 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

interface CustomTimePickerProps {
  value: string; // HH:MM (24h format)
  onChange: (val: string) => void;
  label?: string;
}

export function CustomTimePicker({ value, onChange, label = 'Time of Birth' }: CustomTimePickerProps) {
  const parseVal = (valStr: string) => {
    if (!valStr || !valStr.includes(':')) {
      return { hour12: 12, min: 0, period: 'PM' as 'AM' | 'PM' };
    }
    const parts = valStr.split(':').map(Number);
    let h24 = parts[0];
    const m = parts[1] || 0;

    let period: 'AM' | 'PM' = 'AM';
    let h12 = h24;

    if (h24 >= 12) {
      period = 'PM';
      if (h24 > 12) h12 = h24 - 12;
    } else if (h24 === 0) {
      h12 = 12;
    }

    return { hour12: h12, min: m, period };
  };

  const { hour12, min, period } = parseVal(value);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const updateTime = (h12: number, m: number, p: 'AM' | 'PM') => {
    let h24 = h12;
    if (p === 'PM') {
      if (h12 < 12) h24 = h12 + 12;
    } else if (p === 'AM') {
      if (h12 === 12) h24 = 0;
    }

    const hStr = String(h24).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    onChange(`${hStr}:${mStr}`);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[12px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 stroke-[2] text-[#A14E15]" />
          <span>{label}</span>
        </label>
      )}

      <div className="grid grid-cols-3 gap-2">
        {/* Hour Select */}
        <div className="relative">
          <select
            value={hour12}
            onChange={(e) => updateTime(Number(e.target.value), min, period)}
            className="w-full appearance-none bg-white border border-stone-200 rounded-2xl py-3.5 px-3 text-sm font-bold text-stone-900 outline-none focus:border-[#A14E15] focus:ring-2 focus:ring-amber-500/10 cursor-pointer shadow-2xs pr-8"
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')} Hr
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-4 pointer-events-none" />
        </div>

        {/* Minute Select */}
        <div className="relative">
          <select
            value={min}
            onChange={(e) => updateTime(hour12, Number(e.target.value), period)}
            className="w-full appearance-none bg-white border border-stone-200 rounded-2xl py-3.5 px-3 text-sm font-bold text-stone-900 outline-none focus:border-[#A14E15] focus:ring-2 focus:ring-amber-500/10 cursor-pointer shadow-2xs pr-8"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, '0')} Min
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-4 pointer-events-none" />
        </div>

        {/* AM / PM Select */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => updateTime(hour12, min, e.target.value as 'AM' | 'PM')}
            className="w-full appearance-none bg-amber-100/70 border border-amber-300 rounded-2xl py-3.5 px-3 text-sm font-black text-[#59141D] outline-none focus:border-[#A14E15] focus:ring-2 focus:ring-amber-500/10 cursor-pointer shadow-2xs pr-8"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-amber-700 absolute right-2.5 top-4 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
