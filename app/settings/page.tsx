import { Title } from "@/components/text";
import { AudioLines, type LucideIcon, UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const settings: {
	name: string,
	description: string,
	route: string,
	icon: LucideIcon
}[] = [
		{
			name: "Profile",
			description: "Change your profile information.",
			route: "/user",
			icon: UserCircle,
		},
		{
			name: "Audio",
			description: "Change settings related to your audio experience.",
			route: "/settings/audio",
			icon: AudioLines
		}
	]

export default function Settings() {
	return (
		<>
			<Title className="!mb-2">Settings</Title>
			<div className="grid grid-row gap-x-4 gap-y-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
				{settings.map((setting, i) => {
					const Icon = setting.icon;

					return (
						<Link key={i} href={setting.route}>
							<Card>
								<CardHeader>
									<Icon className='h-8 w-8'></Icon>
								</CardHeader>
								<CardContent>
									<CardTitle>{setting.name}</CardTitle>
									<CardDescription>{setting.description}</CardDescription>
								</CardContent>
							</Card>
						</Link>
					)
				})}
			</div>
		</>
	)
}