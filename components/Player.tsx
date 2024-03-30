/* eslint-disable @next/next/no-img-element */
'use client';

import { useAtom } from "jotai";
import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";
import { Heart, HeartOffIcon, ListPlusIcon, Pause, Play, SkipBack, SkipForward, Volume, Volume1, Volume2 } from "lucide-react";
import { PlayerAtom, QueueAtom, QueueIndexAtom } from "@/lib/PlayerState";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const pad = (num: number) => num.toString().padStart(2, "0");

function formatTime(time: number | undefined) {
	if (time === undefined) return;
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${pad(minutes)}:${pad(seconds)}`;
}

interface PlayerProps extends React.HTMLAttributes<HTMLElement> {
	playerUrl: string | null
}

export default function Player({
	className,
	playerUrl,
	...props
}: PlayerProps) {
	const [player, setPlayer] = useAtom(PlayerAtom);
	const [queue, setQueue] = useAtom(QueueAtom);
	const [queueIndex, setQueueIndex] = useAtom(QueueIndexAtom);

	const [paused, setPaused] = useState<boolean>(true);
	const [time, setTime] = useState<string | undefined>("00:00");
	const [duration, setDuration] = useState<string | undefined>("00:00");
	const [volume, setVolume] = useState<number>(100);
	const [progress, setProgress] = useState<number>(0);
	const [liked, setLiked] = useState<boolean>(false);

	const playerRef = useRef<HTMLAudioElement>(null);

	const changeVolume = (e: number[]) => {
		setVolume(e[0]);
		if (playerRef.current === null) return;
		playerRef.current.volume = volume / 100;
	}

	const skip = () => {
		if (queueIndex === null || !queue) return;
		if (queueIndex >= queue.length - 1) return;
		setPlayer(queue[queueIndex + 1]);
		setQueueIndex(queueIndex + 1);
	}

	const back = () => {
		if (!queueIndex || !queue) return;
		if (queueIndex <= 0) return;
		setPlayer(queue[queueIndex - 1]);
		setQueueIndex(queueIndex - 1);
	}

	const like = async () => {
		if (!player.id) return;
		await fetch(`/api/me/like/${player.id}`);
		setLiked(!liked);
	}

	useEffect(() => {
		let playerElem: HTMLAudioElement | null = null;

		if (playerRef.current) playerElem = playerRef.current;

		const handleTime = () => {
			let time = playerElem?.currentTime as number || 0;
			let duration = playerElem?.duration as number || 0;
			setTime(formatTime(time));
			setProgress(time / duration * 100)
		}

		const changeTrack = () => {
			setDuration(formatTime(playerElem?.duration));
		}

		playerElem?.addEventListener('loadedmetadata', changeTrack);
		playerElem?.addEventListener('timeupdate', handleTime);
		playerElem?.addEventListener('play', () => setPaused(false));
		playerElem?.addEventListener('pause', () => setPaused(true));

		fetch(`/api/me/liked/${player.id}`).then(res => res.json()).then((data: { liked: boolean }) => {
			if (data.liked) {
				setLiked(true);
			} else {
				setLiked(false);
			}
		}).catch(() => {
			setLiked(false);
		})

		if (player?.album?.cover_medium) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: player?.title,
				artist: player?.artist?.name,
				album: player?.album?.title,
				artwork: [
					{
						src: player?.album?.cover_medium,
						sizes: '250x250'
					}
				]
			})

			navigator.mediaSession.setActionHandler('previoustrack', back);
			navigator.mediaSession.setActionHandler('nexttrack', skip);
			navigator.mediaSession.setActionHandler('play', () => {
				setPaused(!paused);
				playerRef?.current?.play();
			});
			navigator.mediaSession.setActionHandler('pause', () => {
				setPaused(!paused);
				playerRef?.current?.pause();
			});
		}

		return () => {
			playerElem?.removeEventListener('timeupdate', handleTime);
			playerElem?.removeEventListener('loadedmetadata', changeTrack);
			playerElem?.removeEventListener('play', () => setPaused(false));
			playerElem?.removeEventListener('pause', () => setPaused(true));
		}
	}, [player])

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
			<div {...props} className={cn(className, "fixed w-full bottom-0 border-t bg-background align-center ")}>
				<div className='w-full h-[5px]'>
					<div className={`bg-white rounded-sm h-full`} style={{ width: `${progress}%` }}></div>
				</div>
				<div className="flex flex-row flex-nowrap justify-between w-full py-3 px-4">
					<div className="flex items-center space-x-3">
						<img className="h-14 w-14 rounded-md border indent-[-10000px]" src={player?.album ? player?.album?.cover_small : ""} alt="" />
						<div className="overflow-hidden">
							<Link href={`/album/${player?.album?.id}`}>
								<h3 className="text-lg font-semibold text-nowrap">
									{player.title}
								</h3>
							</Link>
							<Link href={`/artist/${player?.artist?.id}`}>
								<p className="text-sm">
									{player?.artist?.name}
								</p>
							</Link>
						</div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									{liked ? <Heart fill="#fff" onClick={like} className="h-6 w-6" /> : <HeartOffIcon onClick={like} className="h-6 w-6" />}
								</TooltipTrigger>
								<TooltipContent>
									<p>Like Song</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<ListPlusIcon className="h-6 w-6" />
								</TooltipTrigger>
								<TooltipContent>
									Add to Playlist
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<div className="flex items-center flex-row space-x-3 cursor-pointer">
						<SkipBack onClick={back} className="h-8 w-8 fixed invisible md:static md:visible" />
						{paused ? <Play onClick={togglePlay} className="h-8 w-8" /> : <Pause onClick={togglePlay} className="h-8 w-8" />}
						<SkipForward onClick={skip} className="h-8 w-8" />
					</div>
					<div className="flex items-center space-x-3 fixed invisible md:static md:visible">
						{volume === 0 ? <Volume className="h-8 w-8" /> : volume < 50 ? <Volume1 className="h-8 w-8"></Volume1> : <Volume2 className="h-8 w-8"></Volume2>}
						<Slider className="w-[100px]" onValueChange={changeVolume} defaultValue={[volume]} max={100} step={0.01}></Slider>
						<p className="font-semibold">{time} / {duration}</p>
					</div>
				</div>
			</div>
			<audio ref={playerRef} onEnded={skip} src={`${playerUrl ? `${playerUrl}/${player.id}.mp3` : player?.preview}`} autoPlay></audio>
		</>
	)
}