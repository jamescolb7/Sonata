import { Response } from "express";

async function Deezer(url: string) {
	const data = await fetch(`https://api.deezer.com${url}`);
	const json = await data.json();
	return json;
}

export default async function Proxy(type: "deezer" | "spotify", res: Response, url: string) {
	if (type === "deezer") {
		let data = await Deezer(url);
		return res.send(data);
	}
}