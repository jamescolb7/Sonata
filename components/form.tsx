'use client';

import { useActionState } from "react";

export default function Form({ children, action }: { children: React.ReactNode; action: (prevState: unknown, formData: FormData) => Promise<{ error: string | null }> }) {
	const [state, formAction] = useActionState(action, {
		error: null
	});
	return (
		<form action={formAction}>
			{children}
			<p>{state?.error}</p>
		</form>
	);
}

export interface ActionResult {
	error: string | null;
}