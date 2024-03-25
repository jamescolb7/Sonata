import { Title } from "@/components/Text"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EarIcon, LucideIcon, UserCircle } from "lucide-react";
import Link from 'next/link';

interface SettingsType {
	name: string,
	description: string,
	route: string,
	icon: LucideIcon
}

const settings: SettingsType[] = [
	{
		name: "Profile",
		description: "Change your profile information.",
		route: "/user",
		icon: UserCircle,
	},
	{
		name: "Quality",
		description: "Change your music quality.",
		route: "quality",
		icon: EarIcon
	}
]

export default function Settings() {
	return (
		<>
			<Title>Settings</Title>
			<div className="grid grid-row gap-x-4 gap-y-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
				{settings.map((setting, index) => {
					let Icon = setting.icon;

					return (
						<Link key={index} href={setting.route.startsWith('/') ? setting.route : `/settings/${setting.route}`}>
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