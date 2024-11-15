import { Card } from "@/components/cards";
import { Muted, Title } from "@/components/text";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next"
import Link from "next/link";

export const metadata: Metadata = {
	title: "Browse - Sonata",
	description: "Your self-hosted music streaming platform."
}

export default async function Browse() {
	async function getData() {
		const browse = await fetch(`https://api.deezer.com/editorial`, { cache: "force-cache" });
		const browseData: { data: { id: number, name: string, picture_medium: string }[] } = await browse.json();

		return browseData;
	}

	const data = await getData();

	return (
		<>
			<Title>Browse</Title>
			<Muted className="-mt-4 mb-4">Pre-made playlists for any genre you wish.</Muted>
			<Separator className="my-4"></Separator>
			<div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4 p-4">
				{data.data.map((item, index) => {
					return (
						<Link key={index} href={`/browse/${item.id}`}>
							<Card title={item.name} image={item.picture_medium} subtitle="Playlist" width={220} height={220}></Card>
						</Link>
					)
				})}
			</div>
		</>
	)
}