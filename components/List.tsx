'use client';

import { Track } from '@/lib/Track';
import { PlayerAtom } from '@/lib/PlayerState';
import { useSetAtom } from 'jotai';
import {
	ColumnDef,
	createColumnHelper,
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
	data: any[]
}

const columnHelper = createColumnHelper<Track>();

const columns = [
	columnHelper.accessor('album.cover_small', {
		header: "Song",
		cell: props => <img loading="lazy" className="h-12 w-12 flex-none rounded-md" src={props.getValue()} />
	}),
	columnHelper.accessor('title', {
		header: "",
		cell: props => props.getValue()
	}),
	columnHelper.accessor('artist.name', {
		header: "Artist",
		cell: props => props.getValue()
	}),
	columnHelper.accessor('album.title', {
		header: "Album",
		cell: props => props.getValue()
	}),
	columnHelper.accessor('duration', {
		header: "Time",
		cell: props => formatTime(props.getValue())
	})
] as Array<ColumnDef<Track, unknown>>;

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	const setPlayer = useSetAtom(PlayerAtom);

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
								className='cursor-pointer'
								onClick={() => {
									setPlayer(row.original)
								}}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell, index) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
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