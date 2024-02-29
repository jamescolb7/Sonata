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
		<div className={cn("space-y-3", className)}>
			<div className="overflow-hidden rounded-md">
				<img
					src={image}
					alt={title}
					width={width}
					height={height}
					className={cn(
						`h-[${height}px] w-[${width}px] object-cover transition-all hover:scale-105`,
						aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
					)}
				>
				</img>
			</div>
			<div className="space-y-1 text-sm overflow-hidden">
				<h3 className="font-medium leading-none">{title}</h3>
				<p className="text-xs text-muted-foreground">{subtitle || "Track"}</p>
			</div>
		</div>
	)
}

interface CollectionProps extends React.HTMLAttributes<HTMLElement> {
	data: any[]
}

export function CardCollection({
	data,
	className,
	...props
}: CollectionProps) {
	return (
		<div className="relative">
			<ScrollArea>
				<div className="flex w-max space-x-4 p-4">
					{data.map((item, index) => {
						return (
							<Card title={item?.expand?.track?.title} image={item?.expand?.track?.data?.album?.cover_medium} width={220} height={220} key={index}></Card>
						)
					})}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	)
}