import Header from "~/components/header";
import List from "~/components/list";
import { type Track } from "types/Track";
import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { cacheClientLoader, useCachedLoaderData } from "remix-client-cache";

export const meta: MetaFunction = ({ data }) => {
    const title = (data as { editorial: { name: string } }).editorial.name;

    return [
        { title: `${title} - Sonata` },
        { name: "description", content: "Your self-hosted music streaming platform." },
    ];
};

export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args);

export async function loader({ params }: LoaderFunctionArgs) {
    const editorial = await fetch(`https://api.deezer.com/editorial/${params.id}`);
    const editorialData = await editorial.json() as { id: number, name: string, picture_big: string };

    const tracks = await fetch(`https://api.deezer.com/editorial/${params.id}/charts?limit=100`);
    const tracksData = await tracks.json() as { tracks: { data: Track[] } };

    return json({
        editorial: editorialData,
        tracks: tracksData
    });
}

export default function Editorial() {
    const data = useCachedLoaderData<typeof loader>();

    return (
        <>
            <Header img={data.editorial.picture_big} title={data.editorial.name} type="Playlist" tracks={data.tracks.tracks.data}></Header>
            <List data={data.tracks.tracks.data}></List>
        </>
    )
}