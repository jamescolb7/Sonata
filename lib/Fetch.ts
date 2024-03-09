import axios from 'axios';

const base = process.env.BASE_URL as string;
export const BASE_URL = new URL(base);

export default async function Fetch(url: string): Promise<any> {
	let res = await axios.get(`${BASE_URL}/api/${url}`)
	return res.data;
}