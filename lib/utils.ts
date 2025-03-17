import { Track } from "@/types/Track";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const pad = (num: number) => num.toString().padStart(2, "0");

export function formatTime(time: number) {
  if (isNaN(time)) return `0:00`
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function ShuffleTracks(tracks: Track[]): Track[] | [] {
  const t = JSON.parse(JSON.stringify(tracks));
  if (!t) return [];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}