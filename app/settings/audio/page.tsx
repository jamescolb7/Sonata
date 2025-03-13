"use client";

import { useEffect, useState } from "react";
import { Muted, Title } from "@/components/text";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useRouter } from "next/navigation";

export default function SettingsAudio() {
	const router = useRouter();

	const [quality, setQuality] = useState("3");

	const [availablePlugins, setPlugins] = useState<{ name: string, value: string }[] | []>([]);
	const [plugin, setPlugin] = useState("");

	useEffect(() => {
		const localQuality = localStorage.getItem('quality');
		if (localQuality) setQuality(localQuality);

		fetch("/api/plugins").then(async res => {
			if (!res.ok || res.status !== 200) return;

			const data = await res.json();
			setPlugins(data);

			const localPlugin = localStorage.getItem('plugin');
			if (localPlugin) {
				setPlugin(localPlugin);
			} else {
				setPlugin(data[0].value);
			}
		})
	}, [])

	const saveSettings = () => {
		localStorage.setItem('quality', quality);
		localStorage.setItem('plugin', plugin);
		router.back();
	}

	return (
		<>
			<Title className="!mb-2">Audio</Title>
			<Muted>Change settings related to your audio experience.</Muted>
			<div className="max-w-[500px] flex flex-col space-y-3 mt-3">
				<Card>
					<CardContent className="p-6 space-y-5">
						<div className="space-y-1.5">
							<div>
								<h3 className="font-bold">Audio Quality</h3>
								<CardDescription>Change the quality of the audio.</CardDescription>
							</div>
							<Select onValueChange={setQuality} value={quality}>
								<SelectTrigger className="w-[180px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="9">1411 Kbps (FLAC)</SelectItem>
									<SelectItem value="3">320 Kbps (MP3)</SelectItem>
									<SelectItem value="1">128 Kbps (MP3)</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1.5">
							<div>
								<h3 className="font-bold">Audio Plugin (Advanced)</h3>
								<CardDescription>Change where your music comes from.</CardDescription>
							</div>
							<Select onValueChange={setPlugin} value={plugin} disabled={availablePlugins.length === 0}>
								<SelectTrigger className="w-[180px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{availablePlugins.length === 0 ? <SelectItem value="deezer">Loading...</SelectItem> : availablePlugins.map((plugin, i) => {
										return <SelectItem key={i} value={plugin.value}>{plugin.name} {i === 0 && "(Default)"}</SelectItem>
									})}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>
				<div className="flex space-x-3">
					<Button onClick={saveSettings} className="w-full">Submit</Button>
					<Button onClick={router.back} variant="outline" className="w-full">Back</Button>
				</div>
			</div>
		</>
	)
}