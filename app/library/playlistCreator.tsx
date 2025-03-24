"use client";

import { ScrollCard } from "@/components/cards";
import { CreatePlaylistModal } from "@/lib/state";
import { useSetAtom } from "jotai";

export default function PlaylistCreator() {
	const set = useSetAtom(CreatePlaylistModal);

	return <ScrollCard className="cursor-pointer" onClick={() => set(true)} title="Create New" image="/plus.png" subtitle="Playlist" width={220} height={220}></ScrollCard>
}