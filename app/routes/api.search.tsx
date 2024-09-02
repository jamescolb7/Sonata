import { json, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({
    request
}: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query) return;

    const req = await fetch(`https://api.deezer.com/search?q=${query}`);
    if (!req.ok) return;

    const data = await req.json();
    if (!data) return;

    return json(data)
}