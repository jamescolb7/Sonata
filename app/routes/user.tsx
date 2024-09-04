import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Muted, Title } from "~/components/text";

export function loader({ context }: LoaderFunctionArgs) {
    return {
        username: context.username
    }
}

export default function User() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <Title>{data.username as string}</Title>
            <Muted>User since</Muted>
        </>
    )
}