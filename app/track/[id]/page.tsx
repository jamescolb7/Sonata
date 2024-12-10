import Header from "@/components/header";
import List from "@/components/list";

async function getData(id: string) {
	const track = await fetch(`https://api.deezer.com/track/${id}`, { cache: "force-cache" });
	const data = await track.json();
	return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;
	const track = await getData(id);

	return {
		title: `${track.title} - Sonata`,
		description: `Listen to ${track.title} by ${track.artist.name} on Sonata`,
		openGraph: {
			images: [`/image?q=${track.album.cover_big}`]
		}
	}
}

export default async function Track({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;

	const track = await getData(id);

	return (
		<>
			<Header tracks={[track]} img={track.album.cover_big} title={track.title} type="Track" subtitle={track.artist.name}></Header>
			<List data={[track]}></List>
		</>
	)
}