'use client';

import Header from "@/components/Header";
import List from "@/components/List";
import { useQuery } from "@tanstack/react-query";

export default function Liked() {
	const { data } = useQuery({
		queryKey: ['tracks'],
		queryFn: async () => {
			return await (await fetch(`/api/library/liked`)).json();
		},
		staleTime: 0,
		refetchOnWindowFocus: false
	})

	if (!data) return;

	return (
		<>
			<Header img="/heart.png" title="Liked" type="Playlist" tracks={data}></Header>
			<List data={data}></List>
		</>
	)
}