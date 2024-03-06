import Header from "@/components/Header";
import List from "@/components/List";
import { Album } from "@/types/Album";
import { Metadata } from "next";

async function getData(id: string): Promise<Album> {
	const res = await fetch(`https://api-music.inspare.cc/album/${id}`)
	return res.json();
}

type Props = {
	params: {
		id: string
	}
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const data = await getData(params.id);
	return {
		title: data.title,
		description: `Album by ${data.artist.name}`,
		openGraph: {
			images: [data.cover_big]
		}
	}
}

export default async function Track({ params }: Props) {
	const data = await getData(params.id);

	return (
		<>
			<Header img={data.cover_big} title={data.title} type="Album" subtitle={data.artist.name}></Header>
			<List data={data.tracks.data}></List>
		</>
	)
}