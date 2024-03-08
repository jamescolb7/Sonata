import { Response } from "express";
import { Readable } from "stream";

export default async function Proxy(res: Response, url: string) {
	const data = await fetch(url)
	const json = await data.json();
	return res.send(json);
}