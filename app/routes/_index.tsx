import { json, type MetaFunction } from "@remix-run/node";
import { ClientLoaderFunctionArgs, Link } from "@remix-run/react";

import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import { CardCollection, ScrollCard } from "~/components/cards";
import List from "~/components/list";
import { Muted, Title } from "~/components/text";
import { Separator } from "~/components/ui/separator";

export const meta: MetaFunction = () => {
  return [
    { title: "Home - Sonata" },
    // { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  const popular = await (await fetch("https://api.deezer.com/playlist/3155776842")).json();
  const chart = await (await fetch("https://api.deezer.com/chart")).json();

  return json({
    popular: popular,
    chart: chart,
  })
}

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args);

export default function Index() {
  const { chart, popular } = useCachedLoaderData<typeof loader>();

  return (
    <div className="space-y-4">
      <section>
        <Title>Popular Artists</Title>
        <Muted className="-mt-4 mb-4">Currently popular artists on Sonata.</Muted>
        <Separator className="my-4"></Separator>
        <CardCollection>
          {chart.artists.data.map((item: any, index: number) => {
            return (
              <Link key={index} to={`/artist/${item.id}`}>
                <ScrollCard title={item.name || item.title} image={item.picture_medium || item.cover_medium} subtitle={item.subtitle} width={220} height={220}></ScrollCard>
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
