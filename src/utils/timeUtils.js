export function normalizeTime(timeStr) {
  return timeStr.trim() === "" ? "30" : timeStr;
} 