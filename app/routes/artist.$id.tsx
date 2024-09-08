import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { ClientLoaderFunctionArgs, Link } from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import { Album } from "types/Album";
import { type Artist } from "types/Artist";
import { Track } from "types/Track";
import { Card } from "~/components/cards";
import Header from "~/components/header";
import List from "~/components/list";

export const meta: MetaFunction = ({ data }) => {
  const title = (data as { data: Artist }).data.name;

  return [
    { title: `${title} - Sonata` },
    { name: "description", content: "Your self-hosted music streaming platform." },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const artistData = await fetch(`https://api.deezer.com/artist/${params.id}`);
  const data = await artistData.json() as Artist;

  const tracks = await fetch(`https://api.deezer.com/artist/${params.id}/top?limit=7`);
  const tracksData = await tracks.json() as { data: Track[] };

  const albums = await fetch(`https://api.deezer.com/artist/${params.id}/albums?limit=50`);
  const albumsData = await albums.json() as { data: Album[] };

  return json({
    data: data,
    tracks: tracksData,
    albums: albumsData
  });
}

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args);

export default function Artist() {
  const artist = useCachedLoaderData<typeof loader>();

  return (
    <>
      <Header img={artist.data.picture_big} title={artist.data.name} type="Artist"></Header>
      <List data={artist.tracks.data}></List>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4 p-4">
        {artist.albums.data.map((album, index) => {
          return (
            <Link key={index} to={`/album/${album.id}`}>
              <Card title={album.title} image={album.cover_medium} subtitle="Album" width={220} height={220}></Card>
            </Link>
          )
        })}
      </div>
    </>
  )
}