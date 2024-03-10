const base = process.env.BASE_URL as string;
export const BASE_URL = new URL(base);

export default async function Fetch(url: string): Promise<any> {
	const res = await fetch(`${BASE_URL}api/${url}`).catch((e) => {
		throw new Error(e);
	})
	if (!res.ok) throw new Error('An Error Occurred');
	let json = await res.json();
	if (json?.error?.message) throw new Error('Not Found');
	if (!json?.id && !json?.data && !json?.tracks) throw new Error('Not Found')
	return json;
}