import tzlookup from 'tz-lookup';

export interface TimezoneResolution {
  tzOffset: number;
  timeZone: string;
  isDST: boolean;
  formattedOffset: string;
}

/**
 * Derives IANA Timezone String and exact historical UTC offset (including DST)
 * for a given birth date, birth time, and geocoded coordinates.
 */
export function resolveHistoricalTimezone(
  dateStr: string, // YYYY-MM-DD
  timeStr: string, // HH:MM
  lat: number,
  lng: number
): TimezoneResolution {
  try {
    // 1. Get IANA Timezone ID from coordinates
    const timeZone = tzlookup(lat, lng) || 'Asia/Kolkata';

    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const [hourStr, minStr] = timeStr.split(':');

    const year = parseInt(yearStr || '2000', 10);
    const month = parseInt(monthStr || '1', 10);
    const day = parseInt(dayStr || '1', 10);
    const hour = parseInt(hourStr || '12', 10);
    const minute = parseInt(minStr || '0', 10);

    // 2. Draft Date object in UTC
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

    // 3. Format wall-clock time in target timeZone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(utcDate);
    const map: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== 'literal') {
        map[p.type] = parseInt(p.value, 10);
      }
    }

    const targetHour = map.hour === 24 ? 0 : map.hour;
    const formattedMs = Date.UTC(
      map.year,
      map.month - 1,
      map.day,
      targetHour,
      map.minute,
      map.second || 0
    );

    const tzOffset = (formattedMs - utcDate.getTime()) / (1000 * 60 * 60);

    // 4. Determine DST status by comparing with January offset
    const janMs = Date.UTC(year, 0, 15, 12, 0);
    const janParts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(janMs);
    const janMap: Record<string, number> = {};
    for (const p of janParts) {
      if (p.type !== 'literal') janMap[p.type] = parseInt(p.value, 10);
    }
    const janFormattedMs = Date.UTC(
      janMap.year,
      janMap.month - 1,
      janMap.day,
      janMap.hour === 24 ? 0 : janMap.hour,
      janMap.minute
    );
    const janOffset = (janFormattedMs - janMs) / (1000 * 60 * 60);

    const isDST = Math.abs(tzOffset - janOffset) > 0.1 && tzOffset > janOffset;

    // 5. Format readable UTC string (e.g. UTC +05:30, UTC -04:00)
    const sign = tzOffset >= 0 ? '+' : '-';
    const absOffset = Math.abs(tzOffset);
    const offsetHours = Math.floor(absOffset);
    const offsetMins = Math.round((absOffset - offsetHours) * 60);
    const formattedOffset = `UTC ${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMins
      .toString()
      .padStart(2, '0')}`;

    return { tzOffset, timeZone, isDST, formattedOffset };
  } catch (err) {
    console.error('Timezone resolution error:', err);
    return {
      tzOffset: 5.5,
      timeZone: 'Asia/Kolkata',
      isDST: false,
      formattedOffset: 'UTC +05:30',
    };
  }
}
