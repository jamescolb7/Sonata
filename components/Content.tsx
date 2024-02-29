'use client';

import { useState } from "react";
import Search from "./Search";
import { Input } from "./ui/input";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function Content({
	className,
	children
}: React.HTMLAttributes<HTMLElement>) {
	const [searchQuery, setSearchQuery] = useState('');

	return (
		<>
			<header className="sticky flex justify-center border-b">
				<div className="flex items-center w-full h-16 px-4 mx-auto sm:px-6">
					<Input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search" className="w-full max-w-[400px]"></Input>
				</div>
			</header>
			<div className=" p-8">
				{searchQuery && <Search query={searchQuery}></Search>}
				{!searchQuery && children}
			</div>
		</>
	)
}