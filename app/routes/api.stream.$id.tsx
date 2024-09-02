import { json, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({
    params
}: LoaderFunctionArgs) {
    return json({
        "test" : params.id
    })
}