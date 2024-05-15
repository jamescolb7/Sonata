'use client';

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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollCard } from "@/components/Cards";
import { useRef } from "react";

interface CreateProps extends React.HTMLAttributes<HTMLElement> {
	action: (id: string | null) => Promise<void>
}

export default function PlaylistCreate({ action }: CreateProps) {
	const input = useRef<HTMLInputElement>(null);

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
						<Button type="button" onClick={() => { action(input?.current?.value || null) }} variant="default">
							Create
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}