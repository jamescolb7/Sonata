import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { history, liked, playlists } from "drizzle/schema";
import { Track } from "types/Track";
import { CardCollection, ScrollCard } from "~/components/cards";
import Header from "~/components/header";
import List from "~/components/list";
import { Muted, Title } from "~/components/text";
import { Separator } from "~/components/ui/separator";
import { UserContext } from "~/middleware/middlewareAuth";

export const meta: MetaFunction = () => {
    return [
        { title: "Liked - Sonata" },
        { name: "description", content: "Your self-hosted music streaming platform." },
    ];
};

export async function loader({ context }: LoaderFunctionArgs) {
    const ctx = context as Record<string, any>;
    const userData = ctx.get(UserContext);

    const tracks = [];

    const likedData = await db.query.liked.findMany({
        with: {
            track: {
                with: {
                    album: true,
                    artist: true
                }
            },
        },
        where: eq(liked.userId, userData.id)
    })

    for (let i = 0; i < likedData.length; i++) {
        tracks.push(likedData[i].track);
    }

    return tracks;
}

export default function Liked() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <Header tracks={data} img="/heart.png" title="Liked" type="Playlist" subtitle="Created by you"></Header>
            <List data={data as unknown as Track[]}></List>
        </>
    )
}