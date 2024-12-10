import { Card } from "@/components/cards";
import Header from "@/components/header";
import List from "@/components/list";
import { Album } from "@/types/Album";
import { type Artist } from "@/types/Artist";
import { Track } from "@/types/Track";
import Link from "next/link";

async function getData(id: string) {
	const artistData = await fetch(`https://api.deezer.com/artist/${id}`, { cache: "force-cache" });
	const data = await artistData.json() as Artist;

	const tracks = await fetch(`https://api.deezer.com/artist/${id}/top?limit=7`, { cache: "force-cache" });
	const tracksData = await tracks.json() as { data: Track[] };

	const albums = await fetch(`https://api.deezer.com/artist/${id}/albums?limit=50`, { cache: "force-cache" });
	const albumsData = await albums.json() as { data: Album[] };

	return {
		data: data,
		tracks: tracksData,
		albums: albumsData
	}
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;
	const { data } = await getData(id);

	return {
		title: `${data.name} - Sonata`,
		description: `Listen to ${data.name} on Sonata`,
		openGraph: {
			images: [`/image?q=${data.picture_big}`]
		}
	}
}

export default async function Artist({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;

	const { data, tracks, albums } = await getData(id);

	return (
		<>
			<Header img={data.picture_big} title={data.name} type="Artist"></Header>
			<List data={tracks.data}></List>
			<div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4 p-4">
				{albums.data.map((album, index) => {
					return (
						<Link key={index} href={`/album/${album.id}`}>
							<Card title={album.title} image={album.cover_medium} subtitle="Album" width={220} height={220}></Card>
						</Link>
					)
				})}
			</div>
		</>
	)
}