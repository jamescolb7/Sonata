/* eslint-disable @next/next/no-img-element */
'use client';

import { useAtom } from "jotai";
import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";
import { Pause, Play, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { PlayerAtom, QueueAtom, QueueIndexAtom } from "@/lib/PlayerState";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const pad = (num: number) => num.toString().padStart(2, "0");

function formatTime(time: number | undefined) {
	if (time === undefined) return;
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${pad(minutes)}:${pad(seconds)}`;
}

export default function Player({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const [player, setPlayer] = useAtom(PlayerAtom);
	const [queue, setQueue] = useAtom(QueueAtom);
	const [queueIndex, setQueueIndex] = useAtom(QueueIndexAtom);

	const [paused, setPaused] = useState<boolean>(true);
	const [time, setTime] = useState<string | undefined>("00:00");
	const [duration, setDuration] = useState<string | undefined>("00:00");
	const [volume, setVolume] = useState<number>(100);

	const playerRef = useRef<HTMLAudioElement>(null);

	const changeVolume = (e: number[]) => {
		setVolume(e[0]);
		if (playerRef.current === null) return;
		playerRef.current.volume = volume / 100;
	}

	const skip = () => {
		if (!queueIndex || !queue) return;
		if (queueIndex >= queue.length - 1) return;
		setPlayer(queue[queueIndex + 1]);
		setQueueIndex(queueIndex + 1);
	}

	useEffect(() => {
		let playerElem: HTMLAudioElement | null = null;

		if (playerRef.current) playerElem = playerRef.current;

		const handleTime = () => {
			setTime(formatTime(playerElem?.currentTime));
		}

		const changeTrack = () => {
			setDuration(formatTime(playerElem?.duration));
		}

		playerElem?.addEventListener('loadedmetadata', changeTrack);
		playerElem?.addEventListener('timeupdate', handleTime);
		playerElem?.addEventListener('play', () => setPaused(false));
		playerElem?.addEventListener('pause', () => setPaused(true));

		return () => {
			playerElem?.removeEventListener('timeupdate', handleTime);
			playerElem?.removeEventListener('loadedmetadata', changeTrack);
			playerElem?.removeEventListener('play', () => setPaused(false));
			playerElem?.removeEventListener('pause', () => setPaused(true));
		}
	}, [])

	const togglePlay = () => {
		setPaused(!paused);
		if (playerRef.current === null) return;
		switch (paused) {
			case true:
				playerRef.current.play();
				break;
			case false:
				playerRef.current.pause();
				break;
		}
	}

	return (
		<>
			<div {...props} className={cn(className, "fixed w-full py-4 bottom-0 border-t bg-background align-center px-4")}>
				<div className="flex flex-row flex-nowrap justify-between w-full">
					<div className="flex items-center space-x-3">
						<img className="h-14 w-14 rounded-md border indent-[-10000px]" src={player?.album ? player?.album?.cover_small : ""} alt="" />
						<div>
							<Link href={`/album/${player?.album?.id}`}>
								<h3 className="text-lg font-semibold">
									{player.title}
								</h3>
							</Link>
							<Link href={`/artist/${player?.artist?.id}`}>
								<p className="text-sm">
									{player?.artist?.name}
								</p>
							</Link>
						</div>
					</div>
					<div className="flex items-center flex-row space-x-3 cursor-pointer">
						<SkipBack className="h-8 w-8" />
						{paused ? <Play onClick={togglePlay} className="h-8 w-8" /> : <Pause onClick={togglePlay} className="h-8 w-8" />}
						<SkipForward onClick={skip} className="h-8 w-8" />
					</div>
					<div className="flex items-center space-x-3 fixed invisible md:static md:visible">
						<Volume1 className="h-8 w-8" />
						<Slider className="w-[100px]" onValueChange={changeVolume} defaultValue={[volume]} max={100} step={0.01}></Slider>
						<p className="font-semibold">{time} / {duration}</p>
					</div>
				</div>
			</div>
			<audio ref={playerRef} onEnded={skip} src={``} autoPlay></audio>
		</>
	)
}