import { Card } from "@/components/Cards";
import Header from "@/components/Header";
import List from "@/components/List";
import { Album } from "@/types/Album";
import { Artist } from "@/types/Artist";
import { Track } from "@/types/Track";
import { Metadata } from "next";
import Link from "next/link";

const base = process.env.BASE_URL as string;
const base_url = new URL(base);

interface Data {
	data: Artist,
	tracks: Track[],
	albums: Album[]
}

async function getData(id: string): Promise<Data> {
	const res = await fetch(`${base}/api/artist/${id}`).catch((e) => {
		throw new Error(e);
	})
	if (!res.ok) throw new Error('An error occurred when contacting the API.');
	let json = await res.json();
	if (json?.error?.message || !json.name) throw new Error('The item you requested was not found.');

	const tracks = await fetch(`${base}/api/artist/${id}/top`)
	if (!res.ok) throw new Error('An error occurred when contacting the API.');
	let t_json = await tracks.json();
	if (t_json?.error?.message || !t_json?.data) throw new Error('The item you requested was not found.');

	const albums = await fetch(`${base}/api/artist/${id}/albums`)
	if (!res.ok) throw new Error('An error occurred when contacting the API.');
	let albums_json = await albums.json();
	if (albums_json?.error?.message || !albums_json?.data) throw new Error('The item you requested was not found.');

	return {
		data: json,
		tracks: t_json.data,
		albums: albums_json.data
	};
}

type Props = {
	params: {
		id: string
	}
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const data = await getData(params.id);

	return {
		metadataBase: base_url,
		title: `${data.data.name} / Sonata`,
		description: `${data.data.name} on Sonata`,
		openGraph: {
			images: [data.data.picture_big]
		}
	}
}

export default async function Track({ params }: Props) {
	const data = await getData(params.id);

	return (
		<>
			<Header img={data.data.picture_big} title={data.data.name} type="Artist"></Header>
			<List data={data.tracks}></List>
			<div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 space-x-4 space-y-4 p-4">
				{data.albums.map((album, index) => {
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