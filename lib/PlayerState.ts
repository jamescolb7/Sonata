import { atom } from "jotai";
import { Track } from "../types/Track";

export const PlayerAtom = atom<Partial<Track>>({ title: "Not Playing" });
export const QueueAtom = atom<Track[]>([]);