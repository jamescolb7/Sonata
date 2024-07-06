'use client';

import { CardCollection, ScrollCard } from "@/components/Cards";
import { Muted, Title } from "@/components/Text";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Track } from "@/types/Track";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

export default function Library() {
	const liked = useQuery({
		queryKey: ['liked'],
		queryFn: async () => {
			return await (await fetch(`/api/library/liked?limit=6`)).json();
		},
		staleTime: 0,
		refetchOnWindowFocus: false
	})

	const history = useQuery({
		queryKey: ['history'],
		queryFn: async () => {
			return await (await fetch(`/api/library/history`)).json();
		},
		staleTime: 0,
		refetchOnWindowFocus: false
	})

	const playlists = useQuery({
		queryKey: ['playlists'],
		queryFn: async () => {
			return await (await fetch(`/api/playlists/list`)).json();
		},
		staleTime: 0,
		refetchOnWindowFocus: false
	})

	return (
		<>
			<Title>Library</Title>
			<div className="space-y-4">
				<div>
					<Title className="!text-xl">Recently Played</Title>
					<Muted className="-mt-4 mb-4">Your most recently played songs.</Muted>
					<Separator className="my-4" />
					<CardCollection>
						{history.isLoading && <Spinner />}
						{!history.isLoading && history.data && <>
							{!history.data.length && <Muted className="text-center">Play some songs and they will appear here.</Muted>}
							{history.data.map((item: { track: Track }, index: number) => {
								return (
									<Link href={`/track/${item.track.id}`} key={index}>
										<ScrollCard title={item.track.title} image={item.track.album?.cover_medium} subtitle={"Track"} width={220} height={220}></ScrollCard>
									</Link>
								)
							})}
						</>}
					</CardCollection>
				</div>
				<div>
					<Title className="!text-xl">Liked Songs</Title>
					<Muted className="-mt-4 mb-4">Your currently liked songs.</Muted>
					<Separator className="my-4" />
					<CardCollection>
						{liked.isLoading && <Spinner />}
						{!liked.isLoading && liked.data && <>
							{!liked.data.length && <Muted className="text-center">Like some songs and they will appear here.</Muted>}
							{liked.data.length !== 0 && <Link href={`/library/liked`}>
								<ScrollCard title="View All" image="/arrow.png" subtitle="Show your liked songs" width={220} height={220}></ScrollCard>
							</Link>}
							{liked.data.map((item: Track, index: number) => {
								return (
									<Link href={`/track/${item.id}`} key={index}>
										<ScrollCard title={item.title} image={item.album?.cover_medium} subtitle={"Track"} width={220} height={220}></ScrollCard>
									</Link>
								)
							})}
						</>}
					</CardCollection>
				</div>
				<div>
					<Title className="!text-xl">Playlists</Title>
					<Muted className="-mt-4 mb-4">See all of your playlists.</Muted>
					<Separator className="my-4" />
					<CardCollection>
						<div className="cursor-pointer">
							<PlaylistCreate />
						</div>
						{playlists.isLoading && <Spinner />}
						{!playlists.isLoading && playlists.data && playlists.data.map((item: { id: string, name: string }, index: number) => {
							return (
								<Link href={`/library/playlist/${item.id}`} key={index}>
									<ScrollCard title={item.name} image="/playlist.png" subtitle="Playlist" width={220} height={220}></ScrollCard>
								</Link>
							)
						})}
					</CardCollection>
				</div>
			</div>
		</>
	)
}

function PlaylistCreate() {
	const input = useRef<HTMLInputElement>(null);

	async function submit() {
		if (!input?.current?.value) return;
		let res = await fetch(`/api/playlists/create/${input.current.value}`);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<ScrollCard title="Create" image="/plus.png" subtitle="Create a playlist" width={220} height={220}></ScrollCard>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create Playlist</DialogTitle>
					<DialogDescription>
						Create a new playlist.
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Label htmlFor="playlist_name" className="sr-only">
							Playlist Name
						</Label>
						<Input
							id="playlist_name"
							ref={input}
							defaultValue="Playlist Name"
						/>
					</div>
				</div>
				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button type="button" onClick={() => { submit() }} variant="default">
							Create
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}