import React from "react";
import { Button } from "./ui/button";
import { CogIcon, LucideIcon, PlayCircleIcon, LayoutGrid, LibraryBig, CircleUserRound } from "lucide-react";
import { cn } from '~/lib/utils';
import { Link, useMatches } from "@remix-run/react";

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
  className
}: React.HTMLAttributes<HTMLElement>) {
  const matches = useMatches();

  return (
    <>
      <aside className={cn('bg-background h-screen pb-12 border-l md:border-r', className)}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-3xl font-bold tracking-tight fixed invisible md:visible md:static mb-3 primary-font">
              Sonata
            </h2>
            <div className="flex flex-col space-y-1">
              {links.map((link, index) => {
                let Icon = link.icon;
                return (
                  <Link key={index} to={link.href}>
                    <Button variant={matches[1] ? matches[1].pathname === link.href ? "default" : "ghost" : "ghost"} className="w-full justify-start">
                      <Icon className="mr-2 h-4 w-4" /> {link.name}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}