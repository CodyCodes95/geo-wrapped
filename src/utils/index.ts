export function getCountryFlagEmoji(countryCode: string | undefined) {
  if (!countryCode) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Helper function to get timestamp range for a given month in 2024
export function getMonthTimestampRange(month: string | null) {
  if (!month) {
    return {
      start: new Date("2024-01-01T00:00:00Z"),
      end: new Date("2024-12-31T23:59:59Z"),
    };
  }

  const monthIndex = new Date(`${month} 1, 2024`).getMonth();
  const start = new Date(2024, monthIndex, 1);
  const end = new Date(2024, monthIndex + 1, 0, 23, 59, 59);

  return { start, end };
}
