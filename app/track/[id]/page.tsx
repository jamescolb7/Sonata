import Header from "@/components/Header";
import List from "@/components/List";
import Fetch from "@/lib/Fetch";
import { type Track } from "@/types/Track";
import { Metadata } from "next";

const base = process.env.BASE_URL as string;
const base_url = new URL(base);

async function getData(id: string): Promise<Track> {
	return await Fetch(`track/${id}`);
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
		description: `Track by ${data.artist.name} on Sonata`,
		openGraph: {
			images: [data.album.cover_big]
		}
	}
}

export default async function Track({ params }: Props) {
	const data = await getData(params.id);

	return (
		<>
			<Header img={data.album.cover_big} title={data.title} type="Track" subtitle={data.artist.name}></Header>
			<List data={[data]}></List>
		</>
	)
}