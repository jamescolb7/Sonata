import { cn } from "@/lib/utils"

export function Muted({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<p {...props} className={cn(className, "text-sm text-muted-foreground")}>{children}</p>
	)
}

export function Title({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<h1 {...props} className={cn(className, "font-semibold text-3xl mb-5")}>{children}</h1>
	)
}