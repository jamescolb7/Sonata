import { useSetAtom } from "jotai";
import { Muted } from "./text"
import { PlayerAtom, QueueAtom, QueueIndexAtom } from "~/lib/state";
import { formatTime } from "~/lib/utils";
import { Track } from "types/Track";

export default function List({ data }: { data: Track[] }) {
    const setPlayer = useSetAtom(PlayerAtom);
    const setQueue = useSetAtom(QueueAtom);
    const setQueueIndex = useSetAtom(QueueIndexAtom);

    function playTrack(i: number) {
        setQueue(data);
        setQueueIndex(i);
        setPlayer(data[i]);
    }

    return (
        <div className="space-y-1">
            {data.map((track, i) => {
                return (
                    <div onClick={() => playTrack(i)} className="flex gap-x-2 p-2 rounded-lg cursor-pointer transition-colors hover:bg-zinc-800" key={i}>
                        <img className="rounded-sm w-[50px]" src={track.album.cover_small}></img>
                        <div className="w-full">
                            <h3 className="text-lg primary-font line-clamp-1">{track.title}</h3>
                            <Muted className="line-clamp-1">{track.artist.name}</Muted>
                        </div>
                        <div>
                            <Muted>{track.duration && formatTime(track.duration)}</Muted>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}