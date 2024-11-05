import { Card } from "~/components/cards";
import { Muted, Title } from "~/components/text";
import { Separator } from "~/components/ui/separator";
import { ClientLoaderFunctionArgs, Link } from "@remix-run/react";
import { json, type MetaFunction } from "@remix-run/node";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

interface Editorial {
  id: number,
  name: string,
  picture_medium: string
}

export const meta: MetaFunction = () => {
  return [
    { title: "Browse - Sonata" },
    { name: "description", content: "Your self-hosted music streaming platform." },
  ];
};

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args);

export async function loader() {
  const browse = await fetch(`https://api.deezer.com/editorial`);
  const browseData = await browse.json();

  return json(browseData);
}

export default function Browse() {
  const data = useCachedLoaderData() as { data: Editorial[] };

  return (
    <>
      <Title>Browse</Title>
      <Muted className="-mt-4 mb-4">Pre-made playlists for any genre you wish.</Muted>
      <Separator className="my-4"></Separator>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4 p-4">
        {data.data.map((item, index) => {
          return (
            <Link key={index} to={`/editorial/${item.id}`}>
              <Card title={item.name} image={item.picture_medium} subtitle="Playlist" width={220} height={220}></Card>
            </Link>
          )
        })}
      </div>
    </>
  )
}