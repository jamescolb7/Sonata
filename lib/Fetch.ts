const base = process.env.BASE_URL as string;
export const BASE_URL = new URL(base);

export default async function Fetch(url: string): Promise<any> {
	const res = await fetch(`${BASE_URL}api/${url}`).catch((e) => {
		console.log(e);
	})
	if (!res) return;
	if (!res.ok) return { error: true };
	let json = await res.json();
	if (json?.error?.message) return { error: true };
	if (!json?.id && !json?.name && !json?.data && !json?.tracks) return { error: true };
	return json;
}

export async function FetchDeezer(url: string): Promise<any> {
	const res = await fetch(`https://api.deezer.com/${url}`).catch((e) => {
		console.log(e);
	})
	if (!res) return;
	if (!res.ok) return { error: true };
	let json = await res.json();
	if (json?.error?.message) return { error: true };
	if (!json?.id && !json?.name && !json?.data && !json?.tracks) return { error: true };
	return json;
}