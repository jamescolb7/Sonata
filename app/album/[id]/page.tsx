import Header from "@/components/Header";
import List from "@/components/List";
import Fetch from "@/lib/Fetch";
import { type Album } from "@/types/Album";
import { Metadata } from "next";

const base = process.env.BASE_URL as string;
const base_url = new URL(base);

async function getData(id: string): Promise<Album> {
	return await Fetch(`album/${id}`);
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
		title: `${data.title} / Sonata`,
		description: `Album by ${data.artist.name} on Sonata`,
		openGraph: {
			images: [data.cover_big]
		}
	}
}

export default async function Album({ params }: Props) {
	const data = await getData(params.id);

	return (
		<>
			<Header img={data.cover_big} title={data.title} type="Album" subtitle={data.artist.name}></Header>
			<List data={data.tracks.data}></List>
		</>
	)
}