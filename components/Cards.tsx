/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLElement> {
	title: string,
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
				<img
					src={image}
					alt={title}
					width={width}
					height={height}
					className={cn(
						`object-cover transition-all hover:scale-105`,
						aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
					)}
				>
				</img>
			</div>
			<div className="space-y-1 text-sm overflow-hidden">
				<h3 className="font-medium leading-none">{title}</h3>
				<p className="text-xs text-muted-foreground">{subtitle || "Artist"}</p>
			</div>
		</div>
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