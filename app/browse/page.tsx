import { Card } from "@/components/Cards";
import { Muted, Title } from "@/components/Text";
import { Separator } from "@/components/ui/separator";
import { FetchDeezer } from "@/lib/Fetch";
import Link from "next/link";

interface Editorial {
	id: number,
	name: string,
	picture_medium: string
}

async function getData(): Promise<{ data: Editorial[] }> {
	return await FetchDeezer(`editorial`);
}

export default async function Browse() {
	const data = await getData();

	return (
		<>
			<Title>Browse</Title>
			<Muted className="-mt-4 mb-4">Pre-made playlists for any genre you wish.</Muted>
			<Separator className="my-4"></Separator>
			<div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4 p-4">
				{data.data.map((item, index) => {
					return (
						<Link key={index} href={`/editorial/${item.id}`}>
							<Card title={item.name} image={item.picture_medium} subtitle="Playlist" width={220} height={220}></Card>
						</Link>
					)
				})}
			</div>
		</>
	)
}