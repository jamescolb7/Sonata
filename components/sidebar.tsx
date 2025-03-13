'use client';

import { useEffect, useState } from "react";
import { CogIcon, LucideIcon, PlayCircleIcon, LayoutGrid, LibraryBig, CircleUserRound, ChevronDown, ListMusic, Heart } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "./ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtomValue } from "jotai";
import { PlaylistsRefresh } from "@/lib/state";

type LinksType = {
	name: string,
	href: string,
	icon: LucideIcon
}

const links: LinksType[] = [
	{
		name: "Listen Now",
		href: "/",
		icon: PlayCircleIcon
	},
	{
		name: "Browse",
		href: "/browse",
		icon: LayoutGrid
	},
	{
		name: "Library",
		href: "/library",
		icon: LibraryBig
	},
	{
		name: "User",
		href: "/user",
		icon: CircleUserRound
	},
	{
		name: "Settings",
		href: "/settings",
		icon: CogIcon
	}
]

export default function AppSidebar() {
	const [playlists, setPlaylists] = useState<{
		id: string,
		name: string
	}[]>([]);

	const pathname = usePathname();
	const { setOpenMobile } = useSidebar();
	const playlistsRefresh = useAtomValue(PlaylistsRefresh);

	useEffect(() => {
		const getPlaylists = async () => {
			const playlistData = await fetch('/api/playlists/list');
			if (!playlistData.ok) return;

			const data = await playlistData.json();

			setPlaylists(data);
		}

		getPlaylists();
	}, [playlistsRefresh])

	return (
		<Sidebar>
			<SidebarHeader>
				<h2 className="mt-5 px-4 text-3xl font-bold tracking-tighter fixed invisible md:visible md:static primary-font">
					Sonata
				</h2>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{links.map((item, index) => (
								<SidebarMenuItem key={index}>
									<SidebarMenuButton onClick={() => { setOpenMobile(false) }} isActive={pathname === item.href} asChild>
										<Link href={item.href}>
											<item.icon />
											<span>{item.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<Collapsible defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger>
								Playlists
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton onClick={() => { setOpenMobile(false) }} asChild>
											<Link href="/liked">
												<Heart />
												<span>Liked</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									{playlists.map((playlist, index) => {
										return (
											<SidebarMenuItem key={index}>
												<SidebarMenuButton onClick={() => { setOpenMobile(false) }} asChild>
													<Link href={`/playlist/${playlist.id}`}>
														<ListMusic></ListMusic>
														<span>{playlist.name}</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										)
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
			</SidebarContent>
		</Sidebar>
	)
}