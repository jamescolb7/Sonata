import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ListPlus } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { CreatePlaylistModal, PlaylistsRefresh } from "@/lib/state";

export default function ListPlaylists({ setSelectedPlaylist }: { setSelectedPlaylist: React.Dispatch<React.SetStateAction<{ id?: string, name?: string }>> }) {
	const [playlists, setPlaylists] = useState<[] | { id: string, name: string }[]>([]);
	const playlistsRefresh = useAtomValue(PlaylistsRefresh);
	const setCreatePlaylistModalOpen = useSetAtom(CreatePlaylistModal)

	useEffect(() => {
		fetch("/api/playlists/list").then(res => res.json()).then(data => {
			if (data.error) return;
			setPlaylists(data);
			//Auto select first playlist as default
			setSelectedPlaylist(data[0]);
		}).catch(() => { })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playlistsRefresh])

	const updateSelection = (e: string) => {
		const index = e.split("_")[1] as unknown as number || 0;
		setSelectedPlaylist(playlists[index]);
	}

	return <>
		{playlists.length > 0 && <RadioGroup onValueChange={updateSelection} defaultValue="option_0" className="gap-0 mt-2 mb-3">
			{playlists.map((playlist, i) => {
				return (
					<Label key={i} htmlFor={`option_${i}`} className={`flex items-center space-x-2 p-4 hover:bg-secondary transition-colors ${i === 0 ? "border rounded-t-lg" : i + 1 === playlists.length ? "border rounded-b-lg border-t-0" : "border-x border-b"}`}>
						<RadioGroupItem value={`option_${i}`} id={`option_${i}`} />
						<Label htmlFor={`option_${i}`}>{playlist.name}</Label>
					</Label>
				)
			})}
		</RadioGroup>}

		<div onClick={() => setCreatePlaylistModalOpen(true)} className="flex items-center cursor-pointer space-x-2 p-4 hover:bg-secondary transition-colors border rounded-lg">
			<ListPlus className="h-4 w-4" />
			<p className="text-sm font-medium leading-none">Create New</p>
		</div>
	</>
}