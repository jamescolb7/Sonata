import React, { useEffect, useState } from "react";
import Search from "./search";
import { Input } from "./ui/input";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";
import { useMatches } from "@remix-run/react";
import Player from "./player";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export default function Content({
  className,
  children
}: React.HTMLAttributes<HTMLElement>) {
  const [open, setOpen] = useState(true);

  const matches = useMatches();

  let timeout: any;

  const [searchQuery, setSearchQuery] = useState('');

  function keyPress(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return setSearchQuery('');
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setSearchQuery(e.target.value);
    }, 200);
  }

  useEffect(() => {
    setSearchQuery('');
  }, [matches[1]])

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await fetch(`/api/auth`);
      if (!loggedIn.ok) return;
      const data = await loggedIn.json();
      if (data.loggedIn) localStorage.setItem('loggedIn', "true");
    }

    checkLoggedIn();
  }, [])

  return (
    <>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar setOpen={setOpen} />
        <div className={cn(className, "flex flex-col w-full")}>
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
        <Player />
      </SidebarProvider>
    </>
  )
}