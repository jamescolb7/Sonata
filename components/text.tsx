import { cn } from "@/lib/utils";

export function Muted({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<p {...props} className={cn(className, "mx-2 md:mx-0 text-sm text-muted-foreground")}>{children}</p>
	)
}

export function Title({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<h1 {...props} className={cn(className, "mx-2 md:mx-0 font-bold text-3xl mb-5 primary-font")}>{children}</h1>
	)
}