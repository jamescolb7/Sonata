import { useAtom, useSetAtom } from "jotai";
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle } from "./ui/credenza";
import { CreatePlaylistModal, PlaylistsRefresh } from "@/lib/state";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function CreatePlaylist() {
	const router = useRouter();
	const pathname = usePathname();

	const [open, setOpen] = useAtom(CreatePlaylistModal);
	const [name, setName] = useState("");
	const [saving, setSaving] = useState(false);

	const setPlaylistsUpdate = useSetAtom(PlaylistsRefresh);

	const savePlaylist = async () => {
		if (!name) return;
		setSaving(true);
		const res = await fetch(`/api/playlists/create/${name}`);
		if (!res.ok || res.status !== 201) return;
		setSaving(false);
		setOpen(false);
		if (pathname.startsWith("/library")) router.refresh();
	}

	//Reset after saves
	useEffect(() => {
		setPlaylistsUpdate(new Date().getTime())
		setName("");
	}, [open, setPlaylistsUpdate])

	return <Credenza open={open} onOpenChange={setOpen}>
		<CredenzaContent>
			<CredenzaHeader>
				<CredenzaTitle>
					Create Playlist
				</CredenzaTitle>
				<CredenzaDescription>
					Create a new playlist on Sonata.
				</CredenzaDescription>
			</CredenzaHeader>
			<CredenzaBody>
				<Input id="playlistName" placeholder="Playlist Name" onInput={(e) => setName((e.target as HTMLInputElement).value)} type="text"></Input>
			</CredenzaBody>
			<CredenzaFooter>
				{name.length ? <Button onClick={savePlaylist} disabled={saving}>{saving ? "Saving..." : "Save"}</Button> : <CredenzaClose asChild>
					<Button variant="outline">Close</Button>
				</CredenzaClose>}
			</CredenzaFooter>
		</CredenzaContent>
	</Credenza>;
}
