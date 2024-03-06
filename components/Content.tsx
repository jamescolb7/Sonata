'use client';

import { useEffect, useState } from "react";
import Search from "./Search";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Content({
	className,
	children
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();

	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		setSearchQuery('');
	}, [pathname])

	return (
		<div className={cn(className, "flex flex-col w-full")}>
			<header className="sticky top-0 bg-background z-[12] flex justify-center border-b">
				<div className="flex items-center w-full h-16 px-4 mx-auto sm:px-6">
					<Input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search" className="w-full max-w-[400px]"></Input>
				</div>
			</header>
			<div className=" p-8">
				{searchQuery && <Search query={searchQuery}></Search>}
				{!searchQuery && children}
			</div>
		</div>
	)
}