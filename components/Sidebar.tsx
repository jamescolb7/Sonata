'use client';

import React from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { CogIcon, LucideIcon, PlayCircleIcon, LayoutGrid, LibraryBig, CircleUserRound } from "lucide-react";
import { cn } from '@/lib/utils';
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Sidebar({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();

	return (
		<>
			<aside className={cn('bg-background h-screen pb-12 border-r', className)}>
				<div className="space-y-4 py-4">
					<div className="px-3 py-2">
						<h2 className="mb-2 px-4 text-2xl font-semibold tracking-tight">
							Sonata
						</h2>
						<ScrollArea className="h-[300px] px-1">
							<div className="flex flex-col space-y-1">
								{links.map((link, index) => {
									let Icon = link.icon;
									return (
										<Link key={index} href={link.href}>
											<Button variant={pathname === link.href ? "default" : "ghost"} className="w-full justify-start">
												<Icon className="mr-2 h-4 w-4" /> {link.name}
											</Button>
										</Link>
									)
								})}
							</div>
						</ScrollArea>
					</div>
				</div>
			</aside>
		</>
	)
}