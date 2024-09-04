import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import List from "~/components/list";

export async function loader({ params }: LoaderFunctionArgs) {
  const track = await fetch(`https://api.deezer.com/track/${params.id}`);
  const data = await track.json();
  return json(data);
}

export default function Track() {
  const track = useLoaderData<typeof loader>();

  return (
    <>
      <Header img={track.album.cover_big} title={track.title} type="Track" subtitle={track.artist.name}></Header>
      <List data={[track]}></List>
    </>
  )
}