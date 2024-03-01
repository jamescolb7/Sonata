import { CardCollection } from "@/components/Cards";
import List from "@/components/List";
import { Track } from '@/lib/Track';
import { Title, Muted } from "@/components/Text";
import { Separator } from "@/components/ui/separator";

interface Rows {
  title: string
  subtitle: string
  data: any[] | null
}

interface Playlist {
  tracks: {
    data: Track[]
  }
}

interface Chart {
  artists: {
    data: any[]
  }
}

async function getPopular(): Promise<Playlist> {
  const res = await fetch('https://api-music.inspare.cc/playlist/3155776842');
  return res.json();
}

async function getChart(): Promise<Chart> {
  const res = await fetch('https://api-music.inspare.cc/chart');
  return res.json();
}

export default async function Home() {
  const popularData = getPopular();
  const chartData = getChart();

  const [popular, chart] = await Promise.all([popularData, chartData]);

  const rows: Rows[] = [
    {
      title: "Popular Artists",
      subtitle: "Currently popular artists in your area.",
      data: chart.artists.data
    },
    {
      title: "Popular Songs",
      subtitle: "Currently popular songs in your area.",
      data: null
    }
  ]

  return (
    <>
      <div className="space-y-4">
        {rows.map((row, index) => {
          return (
            <div key={index}>
              <Title>{row.title}</Title>
              <Muted className="-mt-4 mb-4">{row.subtitle}</Muted>
              <Separator className="my-4"></Separator>
              {row.data && <CardCollection data={row.data}></CardCollection>}
            </div>
          )
        })}
        <List className="mt-0" data={popular.tracks.data}></List>
      </div>
    </>
  );
}
