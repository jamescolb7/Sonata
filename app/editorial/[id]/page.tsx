import Header from "@/components/Header";
import List from "@/components/List";
import Fetch from "@/lib/Fetch";
import { type Track } from "@/types/Track";
import { Metadata } from "next";

const base = process.env.BASE_URL as string;
const base_url = new URL(base);

async function getData(id: string): Promise<{
	id: number,
	name: string,
	picture_big: string
}> {
	return await Fetch(`editorial/${id}`);
}

async function getTracks(id: string): Promise<{ tracks: { data: Track[] } }> {
	return await Fetch(`editorial/${id}/charts?limit=100`);
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
		description: `Editorial playlist on Sonata`,
		openGraph: {
			images: [data.picture_big]
		}
	}
}

export default async function Editorial({ params }: Props) {
	const data = await getData(params.id);
	const tracks = await getTracks(params.id);

	return (
		<>
			<Header img={data.picture_big} title={data.name} type="Album" ></Header>
			<List data={tracks.tracks.data}></List>
		</>
	)
}