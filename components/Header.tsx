'use client';

import { useAtom, useSetAtom } from "jotai"
import Image from "./Image"
import { Muted } from "./Text"
import { Button } from "./ui/button"
import { PlayerAtom, QueueAtom, QueueIndexAtom } from "@/lib/State"
import { AudioLines, Shuffle } from "lucide-react";

interface HeaderType extends React.HTMLAttributes<HTMLElement> {
	img: string
	type: string
	title: string
	subtitle?: string,
	tracks?: any[]
}

export default function Header({
	className,
	img,
	type,
	title,
	subtitle,
	tracks
}: HeaderType) {
	const [player, setPlayer] = useAtom(PlayerAtom);
	const [queue, setQueue] = useAtom(QueueAtom);
	const setQueueIndex = useSetAtom(QueueIndexAtom);

	const play = () => {
		if (!tracks) return;
		setPlayer(tracks[0]);
		setQueueIndex(0);
		setQueue(tracks);
	}

	const shuffle = () => {
		if (!tracks) return;
		const arr = tracks.sort(() => Math.random() - 0.5);
		setPlayer(arr[0]);
		setQueueIndex(0);
		setQueue(arr);
	}

	return (
		<>
			<div>
				<Image className="blurred" alt="" src={img}></Image>
				<div className="md:flex dark:border-zinc-800 pb-5 items-end text-center md:text-left space-y-3" style={{ marginTop: "-200px" }}>
					<Image src={img} alt="" className="noselect_image max-w-xs rounded-2xl drop-shadow-xl inline-block" style={{ maxWidth: 256 }}>
					</Image>
					<div className="md:inline-block md:ml-5">
						<h1 className="tracking-tight font-semibold text-4xl mb-1 lg:text-6xl xl:text-8xl relative drop-shadow-md text-white">{title}</h1>
						<Muted className="mb-1 ellipsis">
							{type} {subtitle && <>&bull; {subtitle}</>}
						</Muted>
						{tracks && tracks.length > 0 && <div className="flex flex-row gap-x-3 mt-4 justify-center md:justify-normal">
							<Button onClick={play}><AudioLines className="h-4 w-4 mr-1"></AudioLines> Play</Button>
							<Button onClick={shuffle} variant="outline"><Shuffle className="h-4 w-4 mr-1"></Shuffle> Shuffle</Button>
						</div>}
					</div>
				</div>
			</div>
		</>
	)
}