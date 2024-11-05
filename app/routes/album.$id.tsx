import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";
import { type Album } from "types/Album";
import Header from "~/components/header";
import List from "~/components/list";

export const meta: MetaFunction = ({ data }) => {
  const title = (data as Album).title;

  return [
    { title: `${title} - Sonata` },
    { name: "description", content: "Your self-hosted music streaming platform." },
  ];
};

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args);

export async function loader({ params }: LoaderFunctionArgs) {
  const album = await fetch(`https://api.deezer.com/album/${params.id}`);
  const albumData = await album.json() as Album;

  return json(albumData);
}

export default function Album() {
  const album = useCachedLoaderData<typeof loader>();

  return (
    <>
      <Header tracks={album.tracks.data} img={album.cover_big} title={album.title} type="Album" subtitle={album.artist.name}></Header>
      <List data={album.tracks.data}></List>
    </>
  )
}