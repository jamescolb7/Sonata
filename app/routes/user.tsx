import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Muted, Title } from "~/components/text";
import { UserContext } from "~/middleware/middlewareAuth";

export const meta: MetaFunction = () => {
    return [
      { title: "User - Sonata" },
      { name: "description", content: "Your self-hosted music streaming platform." },
    ];
  };

export function loader({ context }: LoaderFunctionArgs) {
    const ctx = context as Record<string, any>;
    const user = ctx.get(UserContext);

    if (!user) return { username: null, createdAt: null };

    return {
        username: user.email,
        createdAt: user.createdAt
    }
}

export default function User() {
    const data = useLoaderData<typeof loader>();

    return (
        <>
            <Title>{data.username as string}</Title>
            <Muted>User since {data.createdAt}</Muted>
        </>
    )
}