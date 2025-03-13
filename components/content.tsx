'use client';

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import Sidebar from "./sidebar";
import { Input } from "./ui/input";
import Search from "./search";
import Player from "./player";
import { usePathname } from "next/navigation";
import CreatePlaylist from "./playlistCreate";

export default function Content({ children }: { children: React.ReactNode }) {
	const [searchQuery, setSearchQuery] = useState("");

	const pathname = usePathname();

	let timeout: ReturnType<typeof setTimeout> = setTimeout(() => { });

	function keyPress(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.value) setSearchQuery("");
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			setSearchQuery(e.target.value);
		}, 200)
	}

	useEffect(() => {
		setSearchQuery("");
	}, [pathname])

	return (
		<>
			<SidebarProvider>
				<Sidebar />
				<div className="flex flex-col w-full">
					<header className="sticky top-0 bg-background z-[12] flex justify-center border-b">
						<div className="flex items-center gap-x-2 w-full h-16 px-4 sm:px-6">
							<SidebarTrigger />
							<Input onChange={keyPress} type="text" placeholder="Search" className="w-full max-w-[400px]"></Input>
						</div>
					</header>
					<div className="p-8 mb-[89px]">
						{searchQuery && <Search query={searchQuery}></Search>}
						{!searchQuery && children}
					</div>
				</div>
				<CreatePlaylist />
				<Player />
			</SidebarProvider>
		</>
	)
}