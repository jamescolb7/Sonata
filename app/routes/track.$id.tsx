import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { type Track } from "types/Track";
import Header from "~/components/header";
import List from "~/components/list";

export const meta: MetaFunction = ({ data }) => {
  const title = (data as Track).title;

  return [
    { title: `${title} - Sonata` },
    { name: "description", content: "Your self-hosted music streaming platform." },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const track = await fetch(`https://api.deezer.com/track/${params.id}`);
  const data = await track.json() as Track;
  return json(data);
}

export default function Track() {
  const track = useLoaderData<typeof loader>();

  return (
    <>
      <Header tracks={[track]} img={track.album.cover_big} title={track.title} type="Track" subtitle={track.artist.name}></Header>
      <List data={[track]}></List>
    </>
  )
}