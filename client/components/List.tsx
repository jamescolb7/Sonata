import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { formatTime } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: Track[]
}

const columns: ColumnDef<any>[] = [
	{
		accessorKey: "album.cover_medium",
		header: "Song",
	},
	{
		accessorKey: "title",
		header: ""
	},
	{
		accessorKey: "artist.name",
		header: "Artist",
	},
	{
		accessorKey: "album.title",
		header: "Album",
	},
	{
		accessorFn: (row) => {
			let time = row.duration;
			return formatTime(time);
		},
		header: "Time"
	}
]

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row, rowIndex) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell, index) => (
									<TableCell key={cell.id}>
										{index > 0 && flexRender(cell.column.columnDef.cell, cell.getContext())}
										{index === 0 && <>
											<div>
												<img loading="lazy" className="h-12 w-12 flex-none rounded-md" src={data[rowIndex]?.album.cover_medium}>
												</img>
											</div>
										</>}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}

interface Track {
	id: number,
	title: string,
	album: {
		title: string,
		cover_medium: string
	},
	artist: {
		name: string
	},
	duration: number
}

interface Props extends React.HTMLAttributes<HTMLElement> {
	data: Track[]
}

export default function List({
	className,
	data,
	...props
}: Props) {
	return (
		<>
			<DataTable columns={columns} data={data}></DataTable>
		</>
	)
}