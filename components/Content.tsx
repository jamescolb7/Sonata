'use client';

import { useEffect, useState } from "react";
import Search from "./Search";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Content({
	className,
	children
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		setSidebarOpen(false);
		setSearchQuery('');
	}, [pathname])

	return (
		<>
			<Sidebar className={`z-[11] w-80 top-0 ${sidebarOpen ? "" : "invisible"} mt-14 md:mt-0 fixed md:visible md:sticky`} />
			<div className={cn(className, "flex flex-col w-full")}>
				<header className="sticky top-0 bg-background z-[12] flex justify-center border-b">
					<div className="flex items-center space-x-2 w-full h-16 px-4 mx-auto sm:px-6">
						<Input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search" className="w-full max-w-[400px]"></Input>
						<Button onClick={() => { setSidebarOpen(!sidebarOpen) }} className="visible md:invisible md:fixed" variant="outline"><Menu className="h-5 w-5"></Menu></Button>
					</div>
				</header>
				<div className=" p-8">
					{searchQuery && <Search query={searchQuery}></Search>}
					{!searchQuery && children}
				</div>
			</div>
		</>
	)
}