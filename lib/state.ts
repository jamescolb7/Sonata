import { atom } from "jotai";
import { Track } from "@/types/Track";

export const PlayerAtom = atom<Partial<Track>>({ title: "Not Playing" });
export const QueueAtom = atom<Track[]>([]);
export const QueueIndexAtom = atom<number | null>(null);
export const CreatePlaylistModal = atom<boolean>(false);
export const PlaylistsRefresh = atom<number>(0);
export const ShuffleQueueAtom = atom<Track[]>([]);