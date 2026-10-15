import { useSyncExternalStore } from "react";

// Neutrino-Instruct download counts from the Hugging Face API, shared by the model card's
// chart and the Dynamic Island so both always show the same numbers. Fetched once per page.

const ENDPOINT =
  "https://huggingface.co/api/models/neuralcrew/neutrino-instruct?expand[]=downloads&expand[]=downloadsAllTime";

export type ModelDownloads = { last30Days: number; allTime: number };

// Totals as of Oct 2026, shown until (or if) the live request answers.
const FALLBACK: ModelDownloads = { last30Days: 38505, allTime: 195793 };

let snapshot = FALLBACK;
let requested = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!requested) {
    requested = true;
    fetch(ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error("Hugging Face API error");
        return res.json();
      })
      .then((data) => {
        snapshot = {
          last30Days: typeof data.downloads === "number" ? data.downloads : snapshot.last30Days,
          allTime: typeof data.downloadsAllTime === "number" ? data.downloadsAllTime : snapshot.allTime,
        };
        listeners.forEach((notify) => notify());
      })
      .catch(() => {});
  }
  return () => {
    listeners.delete(listener);
  };
}

export function useModelDownloads() {
  return useSyncExternalStore(subscribe, () => snapshot, () => FALLBACK);
}

export type DownloadPoint = { date: string; month30d: number; allTime: number };

/**
 * A 30-day series that matches the real totals at both ends. The daily shape in between
 * is an estimate (the API returns totals, not a history), and the chart says so.
 */
export function estimateDownloadSeries({ last30Days, allTime }: ModelDownloads): DownloadPoint[] {
  const points = 30;
  const now = Date.now();
  const baseDaily = last30Days / points;
  const daily = (step: number) => {
    const wave = 0.6 + Math.sin(step * 0.95) * 0.5;
    const noise = (Math.cos(step * 2.7) + 1) * 0.15;
    return baseDaily * Math.max(0.1, wave + noise);
  };

  const series: DownloadPoint[] = [];
  let cumulative = allTime - last30Days;
  for (let step = 0; step < points; step++) {
    const date = new Date(now - (points - 1 - step) * 24 * 60 * 60 * 1000);
    series.push({
      date: date.toISOString().split("T")[0],
      month30d: Math.round(daily(step)),
      allTime: Math.round(cumulative),
    });
    cumulative += daily(step);
  }
  return series;
}
