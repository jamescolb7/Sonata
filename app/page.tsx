import { CardCollection, ScrollCard } from "@/components/cards";
import List from "@/components/list";
import { Muted, Title } from "@/components/text";
import { Separator } from "@/components/ui/separator";
import { Artist } from "@/types/Artist";
import Link from "next/link";

export default async function Home() {
  async function getData() {
    const popular = await (await fetch("https://api.deezer.com/playlist/3155776842", { cache: "force-cache" })).json();
    const chart = await (await fetch("https://api.deezer.com/chart", { cache: "force-cache" })).json();

    return {
      popular: popular,
      chart: chart
    }
  }

  const { popular, chart } = await getData();

  return (
    <div className="space-y-4">
      <section>
        <Title>Popular Artists</Title>
        <Muted className="-mt-4 mb-4">Currently popular artists on Sonata.</Muted>
        <Separator className="my-4"></Separator>
        <CardCollection>
          {chart.artists.data.map((item: Artist, index: number) => {
            return (
              <Link key={index} href={`/artist/${item.id}`}>
                <ScrollCard title={item.name} image={item.picture_medium} subtitle="Artist" width={220} height={220}></ScrollCard>
              </Link>
            )
          })}
        </CardCollection>
      </section>
      <section>
        <Title>Popular Songs</Title>
        <Muted className="-mt-4 mb-4">Currently popular songs on Sonata.</Muted>
        <Separator className="my-4"></Separator>
        <List data={popular.tracks.data}></List>
      </section>
    </div>
  );
}
