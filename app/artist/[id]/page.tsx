async function getData(id: string) {
	const res = await fetch(`http://localhost:3000/api/artist/${id}`)
	return res.json();
}

export default async function Track({ params }: { params: { id: string } }) {
	const data = await getData(params.id);

	return (
		<h1>{data?.name}</h1>
	)
}