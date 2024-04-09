import { Card } from "@/components/Cards";
import Header from "@/components/Header";
import List from "@/components/List";
import Fetch from "@/lib/Fetch";
import { Album } from "@/types/Album";
import { Artist } from "@/types/Artist";
import { type Track } from "@/types/Track";
import { Metadata } from "next";
import Link from "next/link";

const base = process.env.BASE_URL as string;
const base_url = new URL(base);

async function getData(id: string): Promise<Artist> {
	return await Fetch(`artist/${id}`)
}

async function getTopTracks(id: string): Promise<Track[]> {
	let res = await Fetch(`artist/${id}/top`);
	return res.data;
}

async function getAlbums(id: string): Promise<Album[]> {
	let res = await Fetch(`artist/${id}/albums`);
	return res.data;
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
		title: `${data.name} / Sonata`,
		description: `${data.name} on Sonata`,
		openGraph: {
			images: [data.picture_big]
		}
	}
}

export default async function Track({ params }: Props) {
	const dataData = getData(params.id);
	const tracksData = getTopTracks(params.id);
	const albumsData = getAlbums(params.id);

	const [data, tracks, albums] = await Promise.all([dataData, tracksData, albumsData]);

	return (
		<>
			<Header img={data.picture_big} title={data.name} type="Artist"></Header>
			<List data={tracks}></List>
			<div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4 p-4">
				{albums.map((album, index) => {
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