import React, { useEffect, useState } from "react";
import Search from "./search";
import { Input } from "./ui/input";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";
import { useMatches } from "@remix-run/react";
import Player from "./player";

export default function Content({
  className,
  children
}: React.HTMLAttributes<HTMLElement>) {
  const matches = useMatches();

  let timeout: any;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  function keyPress(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return setSearchQuery('');
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setSidebarOpen(false);
      setSearchQuery(e.target.value);
    }, 200);
  }

  useEffect(() => {
    setSidebarOpen(false);
    setSearchQuery('');
  }, [matches[1]])

  return (
    <>
      <Sidebar className={`z-[11] w-80 top-0 mt-14 md:mt-0 fixed transition-all duration-300 ${sidebarOpen ? "right-0" : "-right-80"} md:visible md:sticky`} />
      <div className={cn(className, "flex flex-col w-full")}>
        <header className="sticky top-0 bg-background z-[12] flex justify-center border-b">
          <div className="flex items-center space-x-2 w-full h-16 px-4 mx-auto sm:px-6">
            <Input onChange={keyPress} type="text" placeholder="Search" className="w-full max-w-[400px]"></Input>
            <Button onClick={() => { setSidebarOpen(!sidebarOpen) }} className="visible md:invisible md:fixed" variant="outline"><Menu className="h-5 w-5"></Menu></Button>
          </div>
        </header>
        <div className="p-8 mb-[89px]">
          {searchQuery && <Search query={searchQuery}></Search>}
          {!searchQuery && children}
        </div>
      </div>
      <Player />
    </>
  )
}