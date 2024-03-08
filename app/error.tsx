'use client';

import { Title } from "@/components/Text";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
	return (
		<>
			<Title>Something went wrong!</Title>
			<div className="flex flex-col space-y-2">
				<code>
					{error.toString()}
				</code>
				<Button variant="outline" onClick={() => reset()}>Try Again</Button>
			</div>
		</>
	)
}