'use client';

import { Track } from '@/types/Track';
import { Track as PrismaTrack } from '@prisma/client';
import { PlayerAtom, QueueAtom, QueueIndexAtom, PlaylistDialog } from '@/lib/State';
import { useAtom } from 'jotai';
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { formatTime } from "@/lib/utils"
import Image from './Image';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: any[]
}

interface columnData extends Track {
	actions: string
}

const columnHelper = createColumnHelper<columnData>();

const columns = [
	columnHelper.accessor('album.cover_small', {
		header: "Song",
		cell: props => <Image loading="lazy" alt="" className="h-12 min-w-12 flex-none rounded-md" src={props.getValue()} />
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
	}),
] as Array<ColumnDef<unknown>>;

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [player, setPlayer] = useAtom(PlayerAtom);
	const [queue, setQueue] = useAtom(QueueAtom);
	const [queueIndex, setQueueIndex] = useAtom(QueueIndexAtom);
	const [playlistDialogOpen, setPlaylistDialogOpen] = useAtom(PlaylistDialog);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	const play = (index: number) => {
		let track: Track = data[index];
		setPlayer(track);
		setQueue(data);
		setQueueIndex(index);
	}

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
									play(rowIndex)
								}}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell, index: number) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<span className="sr-only">Open menu</span>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/track/${row.original.id}`)}
											>
												Copy Link
											</DropdownMenuItem>
											{/* <DropdownMenuSeparator />
											<DropdownMenuItem onClick={() => { setPlaylistDialogOpen(true) }}>Add to Playlist</DropdownMenuItem>
											<DropdownMenuItem onClick={() => { }}>Like Song</DropdownMenuItem> */}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
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
	data: Track[] | PrismaTrack[]
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