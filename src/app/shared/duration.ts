export interface DurationParts {
  key: string;
  params: Record<string, number>;
}

/** The `duration.*` translation and params for a compact length, e.g. 70 minutes → "1h 10m". */
export function toDurationParts(totalMinutes: number): DurationParts {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return { key: "duration.minutes", params: { minutes } };
  }

  if (minutes === 0) {
    return { key: "duration.hours", params: { hours } };
  }

  return { key: "duration.hoursMinutes", params: { hours, minutes } };
}
