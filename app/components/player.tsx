import { useAtom, useAtomValue } from "jotai";
import { cn } from "~/lib/utils";
import { Slider } from "./ui/slider";
import { Heart, HeartOffIcon, ListPlusIcon, Pause, Play, SkipBack, SkipForward, Volume, Volume1, Volume2, Mic2 } from "lucide-react";
import { PlayerAtom, PlaylistDialog, QueueAtom, QueueIndexAtom } from "~/lib/state";
import { Link } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Image from "./image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./ui/dialog"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Button } from "./ui/button";
import { Track } from "types/Track";
// import Lyrics from './lyrics';

const pad = (num: number) => num.toString().padStart(2, "0");

function formatTime(time: number | undefined) {
  if (time === undefined) return;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${pad(minutes)}:${pad(seconds)}`;
}

interface PlaylistModalProps extends React.HTMLAttributes<HTMLElement> {
  open: boolean,
  set: React.Dispatch<React.SetStateAction<boolean>>,
  player: Partial<Track>
}

function PlaylistModal({ open, set, player }: PlaylistModalProps) {
  const [data, setData] = useState<[] | { id: string, name: string }[]>([]);
  const [selected, setSelected] = useState("option_0");

  useEffect(() => {
    const getData = async () => {
      return
      const res = await fetch(`/api/playlists/list`);
      if (res.status !== 200) return;
      const json = await res.json();
      setData(json);
    }

    getData();
  }, [open])

  const save = async () => {
    if (selected === null) return;

    let index = selected ? selected.split('_')[1] as unknown as number : 0;

    setSelected("option_0");

    if (isNaN(index)) return;

    let playlist = data[index].id;

    let res = await fetch(`/api/playlists/set/${playlist}/${player.id}`);
    if (res.ok) {
      set(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => { set(!open) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            {data.length ? <>You are adding <b>{player.title}</b> to a playlist.</> : <>You do not currently have any playlists.</>}

          </DialogDescription>
          <div>
            <RadioGroup onValueChange={(e: any) => { setSelected(e) }} defaultValue={`option_0`} className="gap-0 mt-2 mb-3">
              {data.map((playlist, i) => {
                return (
                  <div key={i} className={`flex items-center space-x-2 p-4 hover:bg-secondary transition-colors ${i === 0 ? "border rounded-t-lg" : i + 1 === data.length ? "border rounded-b-lg border-t-0" : "border-x border-b"}`}>
                    <RadioGroupItem value={`option_${i}`} id={`option_${i}`} />
                    <Label htmlFor={`option_${i}`}>{playlist.name}</Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
          {data.length > 0 && <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={() => {
                if (data.length) return save();
                set(false)
              }} variant="default">
                Save
              </Button>
            </DialogClose>
          </DialogFooter>}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default function Player({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [player, setPlayer] = useAtom(PlayerAtom);
  const queue = useAtomValue(QueueAtom);
  const [queueIndex, setQueueIndex] = useAtom(QueueIndexAtom);

  const [paused, setPaused] = useState<boolean>(true);
  const [time, setTime] = useState<string | undefined>("00:00");
  const [duration, setDuration] = useState<string | undefined>("00:00");
  const [volume, setVolume] = useState<number>(100);
  const [progress, setProgress] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useAtom(PlaylistDialog);
  const [lyricsDialogOpen, setLyricsDialogOpen] = useState<boolean>(false);
  const [playerUrl, setPlayerUrl] = useState<string>("");

  const playerRef = useRef<HTMLAudioElement>(null);

  const changeVolume = (e: number[]) => {
    setVolume(e[0]);
    if (playerRef.current === null) return;
    playerRef.current.volume = volume / 100;
  }

  const skip = () => {
    if (queueIndex === null || !queue) return;
    if (queueIndex >= queue.length - 1) return;
    setPlayer(queue[queueIndex + 1]);
    setQueueIndex(queueIndex + 1);
  }

  const back = () => {
    if (!queueIndex || !queue) return;
    if (queueIndex <= 0) return;
    setPlayer(queue[queueIndex - 1]);
    setQueueIndex(queueIndex - 1);
  }

  const like = async () => {
    if (!player.id) return;
    await fetch(`/api/me/like/${player.id}`);
    setLiked(!liked);
  }

  const seek = async (e: any): Promise<void> => {
    if (!player.id) return;
    let time = playerRef.current?.duration;
    if (!time) return;
    if (playerRef.current === null) return;
    if (e.pageX === null || e.currentTarget === null) return;
    playerRef.current.currentTime = time * (e.pageX / e.currentTarget.offsetWidth);
  }

  useEffect(() => {
    let playerElem: HTMLAudioElement | null = null;

    if (playerRef.current) playerElem = playerRef.current;

    const handleTime = () => {
      let time = playerElem?.currentTime as number || 0;
      let duration = playerElem?.duration as number || 0;
      setTime(formatTime(time));
      setProgress(time / duration * 100)
    }

    const changeTrack = () => {
      setDuration(formatTime(playerElem?.duration));
    }

    playerElem?.addEventListener('loadedmetadata', changeTrack);
    playerElem?.addEventListener('timeupdate', handleTime);
    playerElem?.addEventListener('play', () => setPaused(false));
    playerElem?.addEventListener('pause', () => setPaused(true));

    if (player.id) {
      fetch(`/api/liked/${player.id}`).then(res => res.json()).then((data: { liked: boolean }) => {
        if (data.liked) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      }).catch(() => {
        setLiked(false);
      })

      //Quality
      const quality = localStorage.getItem('quality');

      setPlayerUrl(`/api/stream/deezer/${player.id}.${Number(quality) === 9 ? "flac" : "mp3"}${quality ? `?quality=${quality}` : ""}`);
    }

    if (player?.album?.cover_medium) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: player?.title,
        artist: player?.artist?.name,
        album: player?.album?.title,
        artwork: [
          {
            src: '/image?q=' + player?.album?.cover_medium,
            sizes: '250x250'
          }
        ]
      })

      navigator.mediaSession.setActionHandler('previoustrack', back);
      navigator.mediaSession.setActionHandler('nexttrack', skip);
      navigator.mediaSession.setActionHandler('play', () => {
        setPaused(!paused);
        playerRef?.current?.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        setPaused(!paused);
        playerRef?.current?.pause();
      });
    }

    return () => {
      playerElem?.removeEventListener('timeupdate', handleTime);
      playerElem?.removeEventListener('loadedmetadata', changeTrack);
      playerElem?.removeEventListener('play', () => setPaused(false));
      playerElem?.removeEventListener('pause', () => setPaused(true));
    }
  }, [player])

  const togglePlay = () => {
    setPaused(!paused);
    if (playerRef.current === null) return;
    switch (paused) {
      case true:
        playerRef.current.play();
        break;
      case false:
        playerRef.current.pause();
        break;
    }
  }

  return (
    <>
      <div {...props} className={cn(className, "fixed w-full bottom-0 border-t bg-background align-center z-[12] h-[89px]")}>
        <div className='w-full h-[6px]' onClick={seek}>
          <div className={`bg-primary rounded-sm h-full`} style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex flex-row flex-nowrap justify-between w-full py-3 px-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <Image className="h-11 w-11 sm:h-14 sm:w-14 rounded-md border indent-[-10000px]" src={player?.album ? player?.album?.cover_small : ""} alt="" />
            <div className="overflow-hidden">
              <Link to={`/album/${player?.album?.id}`}>
                <h3 className="text-base primary-font sm:text-lg font-semibold text-nowrap">
                  {player.title}
                </h3>
              </Link>
              <Link to={`/artist/${player?.artist?.id}`}>
                <p className="text-sm">
                  {player?.artist?.name}
                </p>
              </Link>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {liked ? <Heart fill="#fff" onClick={like} className="h-6 w-6" /> : <HeartOffIcon onClick={like} className="h-6 w-6" />}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like Song</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <ListPlusIcon onClick={() => {
                    if (player.id) setPlaylistDialogOpen(!playlistDialogOpen);
                  }} className="h-6 w-6" />
                </TooltipTrigger>
                <TooltipContent>
                  Add to Playlist
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center flex-row space-x-3 cursor-pointer">
            <SkipBack onClick={back} className="h-7 w-7 sm:h-8 sm:w-8 fixed invisible md:static md:visible" />
            {paused ? <Play onClick={togglePlay} className="h-7 w-7 sm:h-8 sm:w-8" /> : <Pause onClick={togglePlay} className="h-7 w-7 sm:h-8 sm:w-8" />}
            <SkipForward onClick={skip} className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <div className="flex items-center space-x-3 fixed invisible md:static md:visible">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Mic2 className="h-6 w-6 cursor-pointer" onClick={() => {
                    if (player.id) setLyricsDialogOpen(!lyricsDialogOpen)
                  }}></Mic2>
                </TooltipTrigger>
                <TooltipContent>
                  Live Lyrics
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {volume === 0 ? <Volume className="h-8 w-8" /> : volume < 50 ? <Volume1 className="h-8 w-8"></Volume1> : <Volume2 className="h-8 w-8"></Volume2>}
            <Slider className="w-[100px]" onValueChange={changeVolume} defaultValue={[volume]} max={100} step={0.01}></Slider>
            <p className="font-semibold">{time} / {duration}</p>
          </div>
        </div>
      </div>
      <PlaylistModal player={player} open={playlistDialogOpen} set={setPlaylistDialogOpen} />
      {/* <Lyrics player={player} open={lyricsDialogOpen} set={setLyricsDialogOpen} /> */}
      <audio ref={playerRef} onEnded={skip} src={playerUrl ?? ""} autoPlay></audio>
    </>
  )
}