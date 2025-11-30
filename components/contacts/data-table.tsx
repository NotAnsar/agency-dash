'use client';

import { useState } from 'react';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PaginationTable } from '@/components/data-table/pagination';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	rateLimit?: {
		viewedToday: number;
		remaining: number;
		limit: number;
		percentage: number;
	};
}

export function ContactsDataTable<TData, TValue>({
	columns,
	data,
	rateLimit,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
		initialState: {
			pagination: {
				pageSize: 20,
			},
		},
	});

	return (
		<div className='space-y-4'>
			{/* Rate Limit Info */}
			{rateLimit && (
				<div className='rounded-lg border bg-card p-4'>
					<div className='flex items-center justify-between mb-2'>
						<span className='text-sm font-medium'>Daily Usage</span>
						<span className='text-sm text-muted-foreground'>
							{rateLimit.viewedToday} / {rateLimit.limit}
						</span>
					</div>
					<Progress value={rateLimit.percentage} className='h-2' />
					<p className='text-xs text-muted-foreground mt-2'>
						{rateLimit.remaining} views remaining today
					</p>
				</div>
			)}

			{/* Search */}
			<Input
				placeholder='Filter by name...'
				value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
				onChange={(event) =>
					table.getColumn('name')?.setFilterValue(event.target.value)
				}
				className='max-w-sm'
			/>

			{/* Table */}
			<div className='rounded-md border'>
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
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<PaginationTable table={table} />
		</div>
	);
}
