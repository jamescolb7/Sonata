import { useEffect, useState } from "react";
import { Title, Muted } from "./text";
import List from "./list";
import { Separator } from "./ui/separator";

export default function Search({ query }: { query: string }) {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch(`/api/search?q=${encodeURI(query)}`).then(res => res.json()).then((res) => {
			if (!res?.data) return;
			setData(res?.data);
		})
	}, [query])

	return (
		<>
			<Title>Searching for &quot;{query}&quot;</Title>
			<Muted className="-mt-4 mb-4">Returning {data?.length} results.</Muted>
			<Separator className="my-4"></Separator>
			<List data={data} />
		</>
	)
}