import Header from "@/components/header";
import List from "@/components/list";
import { Track } from "@/types/Track";

async function getData(id: string) {
	const editorial = await fetch(`https://api.deezer.com/editorial/${id}`, { cache: "force-cache" });
	const data = await editorial.json();

	const tracks = await fetch(`https://api.deezer.com/editorial/${id}/charts?limit=100`, { cache: "force-cache" });
	const tracksData = await tracks.json() as { tracks: { data: Track[] } };

	return {
		editorial: data,
		tracks: tracksData
	};
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;
	const { editorial } = await getData(id);

	return {
		title: `${editorial.name} - Sonata`,
		description: `Listen to ${editorial.name} on Sonata`,
		openGraph: {
			images: [`/image?q=${editorial.picture_big}`]
		}
	}
}

export default async function Editorial({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;

	const { editorial, tracks } = await getData(id);

	return (
		<>
			<Header img={editorial.picture_big} title={editorial.name} type="Playlist" tracks={tracks.tracks.data}></Header>
			<List data={tracks.tracks.data}></List>
		</>
	)
}