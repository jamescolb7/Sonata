"use client";

import { useSetAtom } from "jotai";
import { PlayerAtom, QueueAtom, QueueIndexAtom } from "@/lib/state";
import { formatTime } from "@/lib/utils";
import { Track } from "@/types/Track";
import Image from "./image";

export default function List({ data }: { data: Track[] }) {
	const setPlayer = useSetAtom(PlayerAtom);
	const setQueue = useSetAtom(QueueAtom);
	const setQueueIndex = useSetAtom(QueueIndexAtom);

	function playTrack(i: number) {
		setQueue(data);
		setQueueIndex(i);
		setPlayer(data[i]);
	}

	return (
		<div className="space-y-1">
			{data.map((track, i) => {
				return (
					<div onClick={() => playTrack(i)} className="flex gap-x-2 p-2 rounded-lg cursor-pointer transition-colors hover:bg-zinc-800" key={i}>
						<Image className="rounded-sm w-[50px]" alt={track.album.title} src={track.album.cover_small}></Image>
						<div className="w-full">
							<div className="flex gap-x-2">
								<h3 className="text-lg primary-font line-clamp-1">{track.title}</h3>
								<div className="aspect-square self-center">
									{track.explicit_lyrics && <div className="bg-primary text-background aspect-square rounded-[3px] font-black text-sm px-1">E</div>}
								</div>
							</div>
							<p className="line-clamp-1 text-sm text-muted-foreground">{track.artist.name}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">{track.duration && formatTime(track.duration)}</p>
						</div>
					</div>
				)
			})}
		</div>
	)
}