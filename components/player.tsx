import { CircleAlert, Heart, HeartOffIcon, ListPlusIcon, Mic2, Pause, Play, SkipBack, SkipForward, Volume, Volume1, Volume2 } from "lucide-react"
import Image from "./image"
import Link from "next/link";
import { PlayerAtom, QueueAtom, QueueIndexAtom } from "@/lib/state";
import { useAtom, useAtomValue } from "jotai";
import React, { memo, useEffect, useRef, useState } from "react";
import { Track } from "@/types/Track";
import { formatTime } from "@/lib/utils";
import { Slider } from "./ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "./ui/credenza";
import { Button } from "./ui/button";
import ListPlaylists from "./listPlaylists";
import Lyrics from "./lyrics";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

enum PlayerActions {
  Back,
  PausePlay,
  Skip
}

function ProgressBar({ audio, time }: { audio: React.RefObject<HTMLAudioElement | null>, time: number }) {
  const seek = (e: React.MouseEvent<HTMLElement>) => {
    if (!audio.current) return;
    const duration = audio.current.duration;
    if (!duration) return;
    if (!e.pageX || !e.currentTarget) return;
    audio.current.currentTime = duration * (e.pageX / e.currentTarget.offsetWidth);
  }

  return <div className="w-full h-[6px]" onClick={seek}>
    <div className="bg-primary rounded-sm h-full" style={{ width: audio.current ? `${time / audio.current.duration * 100}%` : "0%" }}></div>
  </div>
}

const TrackInfo = memo(function TrackInfo({ track }: { track: Partial<Track> }) {
  const [liked, setLiked] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<{ id?: string, name?: string }>({});
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);

  useEffect(() => {
    if (!track.id) return;
    fetch(`/api/liked/${track.id}`).then(res => res.json()).then((data: { liked: boolean, error?: string }) => {
      if (data.error) return setLiked(false);
      setLiked(data.liked);
    })
  }, [track])

  const like = () => {
    if (!track.id) return;
    fetch(`/api/like/${track.id}`).then((res) => {
      if (res.status == 201) return setLiked(true);
      return setLiked(false);
    }).catch(() => {
      setLiked(false);
    })
  }

  const addToPlaylist = () => {
    if (!selectedPlaylist.id || !selectedPlaylist.name || !track.id) return;
    fetch(`/api/playlists/set/${selectedPlaylist.id}/${track.id}`).catch(() => {
      console.log("Error occurred adding to playlist.")
    });
  }

  return <>
    <Image className="h-11 w-11 sm:h-14 sm:w-14 rounded-md border indent-[-10000px]" src={track?.album ? track?.album?.cover_small : ""} alt="" />
    <div className="overflow-hidden">
      <Link href={track.album?.id ? `/album/${track?.album?.id}` : ""}>
        <h3 className="text-base primary-font sm:text-lg font-semibold text-nowrap">
          {track.title}
        </h3>
      </Link>
      <Link href={track.artist?.id ? `/artist/${track?.artist?.id}` : ""}>
        <p className="text-sm">
          {track?.artist?.name}
        </p>
      </Link>
    </div>
    <TooltipProvider skipDelayDuration={500}>
      <Tooltip>
        <TooltipTrigger>
          {liked ? <Heart fill="#fff" onClick={like} className="h-6 w-6" /> : <HeartOffIcon onClick={like} className="h-6 w-6" />}
        </TooltipTrigger>
        <TooltipContent>
          Like Song
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <ListPlusIcon fill="#fff" onClick={() => setPlaylistModalOpen(true)} className="h-6 w-6" />
        </TooltipTrigger>
        <TooltipContent>
          Add to Playlist
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <Credenza open={playlistModalOpen} onOpenChange={setPlaylistModalOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>
            Add to Playlist
          </CredenzaTitle>
          <CredenzaDescription>
            {track.id ? <>Choose where to add <b>{track.title}</b>.</> : <>No track playing.</>}
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          {track.id ? <ListPlaylists setSelectedPlaylist={setSelectedPlaylist} /> : <Alert>
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Nothing Playing</AlertTitle>
            <AlertDescription>
              Play a song before you can add it to your playlist!
            </AlertDescription>
          </Alert>}
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            {(track.id && selectedPlaylist.id !== undefined) ? <Button onClick={addToPlaylist}>Save</Button> : <Button variant="outline">Close</Button>}
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  </>
})

const Controls = memo(function Controls({ playing, action }: { playing: boolean, action: (e: number) => void }) {
  return (
    <>
      <SkipBack onClick={() => action(PlayerActions.Back)} className="h-7 w-7 sm:h-8 sm:w-8 fixed invisible md:static md:visible" />
      <div onClick={() => action(PlayerActions.PausePlay)}>
        {playing ? <Pause className="h-7 w-7 sm:h-8 sm:w-8" /> : <Play className="h-7 w-7 sm:h-8 sm:w-8" />}
      </div>
      <SkipForward onClick={() => action(PlayerActions.Skip)} className="h-7 w-7 sm:h-8 sm:w-8" />
    </>
  )
})

function Time({ audio, time }: { audio: React.RefObject<HTMLAudioElement | null>, time: number }) {
  return (
    <p className="font-semibold">{audio.current && audio.current.duration > 0 ? `${formatTime(time)} / ${formatTime(audio.current.duration)}` : "-:-- / -:--"}</p>
  )
}

const Actions = memo(function Actions({ audio, track }: { audio: React.RefObject<HTMLAudioElement | null>, track: Partial<Track> }) {
  const [volume, setVolume] = useState(100);

  const changeVolume = (e: number[]) => {
    setVolume(e[0]);
    if (!audio.current) return;
    audio.current.volume = volume / 100;
  }

  return <>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Credenza>
            <CredenzaTrigger asChild>
              <Mic2 className="h-6 w-6 cursor-pointer"></Mic2>
            </CredenzaTrigger>
            <CredenzaContent>
              <CredenzaHeader>
                <CredenzaTitle>
                  {track.title === "Not Playing" ? "Live Lyrics" : track.title}
                </CredenzaTitle>
                <CredenzaDescription>
                  {track.artist?.name ? `By ${track.artist.name}` : "Play a song to see live lyrics below. You must be signed in."}
                </CredenzaDescription>
              </CredenzaHeader>
              <CredenzaBody>
                <Lyrics track={track} />
              </CredenzaBody>
            </CredenzaContent>
          </Credenza>
        </TooltipTrigger>
        <TooltipContent>
          Live Lyrics
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    {volume === 0 ? <Volume className="h-8 w-8" /> : volume < 50 ? <Volume1 className="h-8 w-8"></Volume1> : <Volume2 className="h-8 w-8"></Volume2>}
    <Slider className="w-[100px]" onValueChange={changeVolume} defaultValue={[volume]} max={100} step={0.01}></Slider>
  </>
})

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const queue = useAtomValue(QueueAtom);
  const [track, setTrack] = useAtom(PlayerAtom);
  const [queueIndex, setQueueIndex] = useAtom(QueueIndexAtom);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playerAction = (action: number) => {
    switch (action) {
      case PlayerActions.Back:
        if (queueIndex === null || !queue) return;
        if (queueIndex <= 0) return;
        setTrack(queue[queueIndex - 1]);
        setQueueIndex(queueIndex - 1);
        break;
      case PlayerActions.PausePlay:
        setPlaying(!playing);
        if (!audioRef.current) return;
        if (playing) return audioRef.current.pause();
        audioRef.current.play();
        break;
      case PlayerActions.Skip:
        if (queueIndex === null || !queue) return;
        if (queueIndex >= queue.length - 1) return;
        setTrack(queue[queueIndex + 1]);
        setQueueIndex(queueIndex + 1);
        break;
    }
  }

  useEffect(() => {
    if (track.album?.cover_big) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist?.name,
        album: track.album?.title,
        artwork: [
          {
            src: `/image?q=${track.album?.cover_big}`
          }
        ]
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => playerAction(PlayerActions.Back));
      navigator.mediaSession.setActionHandler('nexttrack', () => playerAction(PlayerActions.Skip));
      navigator.mediaSession.setActionHandler('play', () => {
        setPlaying(!playing);
        audioRef?.current?.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        setPlaying(!playing);
        audioRef?.current?.pause();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  return <>
    <div className="fixed w-full bottom-0 border-t bg-background align-center z-[12] h-[89px]">
      <ProgressBar audio={audioRef} time={time} />
      <div className="flex justify-between md:grid md:grid-cols-3 w-full pb-3 h-full px-4">
        <div className="flex items-center space-x-3 overflow-hidden">
          <TrackInfo track={track} />
        </div>
        <div className="justify-center flex items-center flex-row space-x-3 cursor-pointer">
          <Controls playing={playing} action={playerAction} />
        </div>
        <div className="justify-end flex items-center space-x-3 fixed invisible md:static md:visible">
          <Actions audio={audioRef} track={track} />
          <Time audio={audioRef} time={time} />
        </div>
      </div>
    </div>
    <audio ref={audioRef} src={track.id ? `/api/stream/deezer/${track.id}.mp3?quality=1` : undefined} autoPlay onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} onEnded={() => playerAction(PlayerActions.Skip)}></audio>
  </>
}