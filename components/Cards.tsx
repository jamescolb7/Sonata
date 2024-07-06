import Image from "./Image";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface CardProps extends React.HTMLAttributes<HTMLElement> {
	title?: string,
	subtitle?: string,
	image?: string,
	aspectRatio?: "portrait" | "square",
	width?: number,
	height?: number
}

export function Card({
	className,
	title,
	image,
	subtitle,
	width,
	height,
	aspectRatio,
	...props
}: CardProps) {
	return (
		<div {...props} className={cn(`space-y-3`, className)} style={{ maxWidth: `${width}px` }}>
			<div className="overflow-hidden rounded-md">
				<Image
					src={image}
					alt={title}
					loading="lazy"
					width={width}
					height={height}
					className={cn(
						`object-cover transition-all hover:scale-105`,
						aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
					)}
				>
				</Image>
			</div>
			<div className="space-y-1 text-sm overflow-hidden">
				<h3 className="font-medium leading-none">{title}</h3>
				<p className="text-xs text-muted-foreground">{subtitle || "Artist"}</p>
			</div>
		</div>
	)
}

export function ScrollCard({
	className,
	children,
	...props
}: CardProps) {
	return (
		<Card className={cn("min-w-[180px] md:min-w-[100px] lg:min-w-0", className)} {...props}>{children}</Card>
	)
}

export function CardCollection({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<div {...props} className={className}>
			<ScrollArea className="overflow-hidden">
				<div className="flex max-w-max space-x-4 p-4">
					{children}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	)
}