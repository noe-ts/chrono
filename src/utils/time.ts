export const REVERT_SET_WINDOW_MS = 2000;

export function formatTime(ms: number): string {
  if (ms <= 0) {
    return '0';
  }

  if (ms >= 5000) {
    return String(Math.floor((ms + 999) / 1000));
  }

  return (Math.floor(ms / 100) / 10).toFixed(1);
}

export function adjustCorrectionTime(ms: number, direction: -1 | 1): number {
  let newTimeMs: number;

  if (ms < 5000) {
    const deciseconds = Math.floor(ms / 100);
    newTimeMs =
      direction === 1
        ? Math.min((deciseconds + 1) * 100, 5000)
        : Math.max((deciseconds - 1) * 100, 0);
  } else if (ms === 5000 && direction === -1) {
    newTimeMs = 4900;
  } else {
    newTimeMs = ms + direction * 1000;
  }

  return Math.max(0, Math.min(24 * 1000, newTimeMs));
}

export function adjustModeBSecondaryTime(ms: number, direction: -1 | 1): number {
  if (ms <= 0 && direction === -1) {
    return 24 * 1000;
  }

  if (ms >= 24 * 1000 && direction === 1) {
    return 0;
  }

  return adjustCorrectionTime(ms, direction);
}
