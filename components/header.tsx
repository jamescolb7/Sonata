"use client";

import { useSetAtom } from "jotai"
import Image from "./image"
import { Muted } from "./text"
import { Button } from "./ui/button"
import { PlayerAtom, QueueAtom, QueueIndexAtom } from "@/lib/state"
import { AudioLines, Shuffle } from "lucide-react";
import { Track } from "@/types/Track";

interface HeaderType extends React.HTMLAttributes<HTMLElement> {
	img: string
	type: string
	title: string
	subtitle?: string,
	tracks?: Track[]
}

export default function Header({
	img,
	type,
	title,
	subtitle,
	tracks
}: HeaderType) {
	const setPlayer = useSetAtom(PlayerAtom);
	const setQueue = useSetAtom(QueueAtom);
	const setQueueIndex = useSetAtom(QueueIndexAtom);

	const play = () => {
		if (!tracks) return;
		setPlayer(tracks[0]);
		setQueueIndex(0);
		setQueue(tracks);
	}

	const shuffle = () => {
		if (!tracks) return;
		for (let i = tracks.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[tracks[i], tracks[j]] = [tracks[j], tracks[i]];
		}
		setPlayer(tracks[0]);
		setQueueIndex(0);
		setQueue(tracks);
	}

	return (
		<>
			<div>
				<Image className="blurred" alt="" src={img}></Image>
				<div className="md:flex dark:border-zinc-800 pb-5 items-end text-center md:text-left space-y-3" style={{ marginTop: "-200px" }}>
					<Image src={img} alt="" className="noselect_image max-w-xs rounded-2xl drop-shadow-xl inline-block" style={{ maxWidth: 256 }}>
					</Image>
					<div className="md:inline-block md:ml-5">
						<h1 className="primary-font tracking-tight font-semibold text-4xl mb-1 lg:text-6xl xl:text-8xl relative drop-shadow-md text-white">{title}</h1>
						<Muted className="mb-1 ellipsis">
							{type} {subtitle && <>&bull; {subtitle}</>}
						</Muted>
						{tracks && tracks.length > 0 && <div className="flex flex-row gap-x-3 mt-4 justify-center md:justify-normal">
							<Button onClick={play}><AudioLines className="h-4 w-4 mr-1"></AudioLines> Play</Button>
							{tracks.length > 1 && <Button onClick={shuffle} variant="outline"><Shuffle className="h-4 w-4 mr-1"></Shuffle> Shuffle</Button>}
						</div>}
					</div>
				</div>
			</div>
		</>
	)
}