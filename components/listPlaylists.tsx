import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

export default function ListPlaylists({ setSelectedPlaylist }: { setSelectedPlaylist: React.Dispatch<React.SetStateAction<{ id?: string, name?: string }>> }) {
	const [playlists, setPlaylists] = useState<[] | { id: string, name: string }[]>([]);

	useEffect(() => {
		fetch("/api/playlists/list").then(res => res.json()).then(data => {
			if (data.error) return;
			setPlaylists(data);
		}).catch(() => { })
	}, [])

	const updateSelection = (e: string) => {
		const index = e.split("_")[1] as unknown as number || 0;
		setSelectedPlaylist(playlists[index]);
	}

	return <>
		{playlists.length === 0 && <p>You do not have any playlists.</p>}
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
	</>
}