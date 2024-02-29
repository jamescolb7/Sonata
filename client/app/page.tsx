import { CardCollection } from "@/components/Cards";
import { Title, Muted } from "@/components/Text";
import { Separator } from "@/components/ui/separator";

interface Rows {
  title: string
  subtitle: string
  data: any[]
}

const rows: Rows[] = [
  {
    title: "Recently Played",
    subtitle: "Your recently played songs.",
    data: []
  },
  {
    title: "Recommended",
    subtitle: "Recommended songs for you.",
    data: []
  }
]

export default function Home() {
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
      </div>
    </>
  );
}
