import { useEffect, useState } from "react";
import { CogIcon, LucideIcon, PlayCircleIcon, LayoutGrid, LibraryBig, CircleUserRound, ChevronDown, ListMusic, Heart } from "lucide-react";
import { Link, useMatches } from "@remix-run/react";
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
} from "./ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

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

export default function AppSidebar({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [playlists, setPlaylists] = useState<{
    id: string,
    name: string
  }[]>([]);

  const matches = useMatches();

  useEffect(() => {
    const getPlaylists = async () => {
      const playlistData = await fetch('/api/playlists/list');
      const data = await playlistData.json();

      setPlaylists(data);
    }

    getPlaylists();
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="mt-5 px-4 text-3xl font-bold tracking-tight fixed invisible md:visible md:static primary-font">
          Sonata
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton isActive={matches[1] && matches[1].pathname === item.href} asChild>
                    <Link to={item.href}>
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
                    <SidebarMenuButton asChild>
                      <Link to="/liked">
                        <Heart />
                        <span>Liked</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {playlists.map((playlist, index) => {
                    return (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton asChild>
                          <Link to={`/playlist/${playlist.id}`}>
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