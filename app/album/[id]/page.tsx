import Header from "@/components/header";
import List from "@/components/list";

async function getData(id: string) {
	const album = await fetch(`https://api.deezer.com/album/${id}`, { cache: "force-cache" });
	const data = await album.json();
	return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;
	const album = await getData(id);

	return {
		title: `${album.title} - Sonata`,
		description: `Listen to ${album.title} by ${album.artist.name} on Sonata`,
		openGraph: {
			images: [`/image?q=${album.cover_big}`]
		}
	}
}

export default async function Album({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;

	const album = await getData(id);

	return (
		<>
			<Header tracks={album.tracks.data} img={album.cover_big} title={album.title} type="Album" subtitle={album.artist.name}></Header>
			<List data={album.tracks.data}></List>
		</>
	)
}