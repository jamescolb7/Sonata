import { Track } from "@/types/Track";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area"

function LyricsCollection({ data }: { data: { time: number, text: string }[] }) {
    const [time, setTime] = useState(0);
    const [selectedLyric, setSelectedLyric] = useState(-1);

    const audio = document.querySelector("audio");

    useEffect(() => {
        const changeTime = () => {
            setTime(audio?.currentTime || 0);
        }

        audio?.addEventListener('timeupdate', changeTime);

        return () => {
            audio?.removeEventListener('timeupdate', changeTime);
        }
    }, []);

    useEffect(() => {
        document.querySelector(`#lyric_${selectedLyric}`)?.scrollIntoView({ behavior: "smooth" });
    }, [selectedLyric])

    return (
        <>
            {data.map((lyric, i) => {
                if (data[i + 1] && time >= lyric.time && time < data[i + 1].time) {
                    if (selectedLyric !== i) setSelectedLyric(i);
                };
                return (
                    <h1 id={`lyric_${i}`} key={i} onClick={() => {
                        if (audio === null) return;
                        audio.currentTime = lyric.time;
                    }} className={`transition text-2xl mb-3 cursor-pointer font-semibold ${selectedLyric === i ? " opacity-100" : "opacity-50 scale-95"}`}>{lyric.text}</h1>
                )
            })}
        </>
    )
}

interface LyricsModalProps extends React.HTMLAttributes<HTMLElement> {
    track: Partial<Track>
}

export default function Lyrics({ track }: LyricsModalProps) {
    const [data, setData] = useState<[] | { time: number, text: string }[]>([]);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!open) return;

        const getData = async () => {
            const res = await fetch(`/api/lyrics/${track.id}`);
            const json = await res.json();

            if (json.syncedLyrics) {
                setFailed(false);

                const lyrics = [];

                const split = json.syncedLyrics.split('\n');

                for (let i = 0; i < split.length; i++) {
                    const str = split[i];
                    const match = str.match(/\[(.*?)\]\s*(.*)/);
                    const time = match[1].split(':');
                    const text = match[2];
                    lyrics.push({
                        time: Number(time[0]) * 60 + Number(time[1]),
                        text: text
                    });
                }

                setData(lyrics);
            } else {
                setFailed(true);
            }
        }

        getData();
    }, [track.id])

    return (
        <ScrollArea className="h-[400px] rounded-sm border p-4">
            {!failed && <LyricsCollection data={data} />}
            {failed && <h1>No lyrics found for this track.</h1>}
        </ScrollArea>
    )
}