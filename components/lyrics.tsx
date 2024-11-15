import { Track } from "@/types/Track";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area"

function Lyrics({ data }: { data: { time: number, text: string }[] }) {
    const [time, setTime] = useState(0);
    const [selectedLyric, setSelectedLyric] = useState(-1);

    useEffect(() => {
        const changeTime = () => {
            setTime(document.querySelector('audio')?.currentTime || 0);
        }

        document.querySelector('audio')?.addEventListener('timeupdate', changeTime);

        return () => {
            document.querySelector('audio')?.removeEventListener('timeupdate', changeTime);
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
                    <h1 id={`lyric_${i}`} key={i} className={`transition text-2xl mb-3 font-semibold ${selectedLyric === i ? " opacity-100" : "opacity-50 scale-95"}`}>{lyric.text}</h1>
                )
            })}
        </>
    )
}

interface LyricsModalProps extends React.HTMLAttributes<HTMLElement> {
    open: boolean,
    set: React.Dispatch<React.SetStateAction<boolean>>,
    player: Partial<Track>
}

export default function LyricsModal({ open, set, player }: LyricsModalProps) {
    const [data, setData] = useState<[] | { time: number, text: string }[]>([]);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!open) return;

        const getData = async () => {
            const res = await fetch(`/api/lyrics/${player.id}`);
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
    }, [open, player.id])

    return (
        <Dialog open={open} onOpenChange={() => { set(!open) }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{player.title}</DialogTitle>
                    <DialogDescription>
                        by {player?.artist?.name}
                    </DialogDescription>
                    <ScrollArea className="h-[400px] rounded-sm border p-4">
                        {!failed && <Lyrics data={data} />}
                        {failed && <h1>No lyrics found for this track.</h1>}
                    </ScrollArea>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}