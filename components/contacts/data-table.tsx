'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
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
import { Button } from '@/components/ui/button';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	rateLimit?: {
		viewedToday: number;
		remaining: number;
		limit: number;
		percentage: number;
	};
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	currentSearch?: string;
}

export function ContactsDataTable<TData, TValue>({
	columns,
	data,
	rateLimit,
	pagination,
	currentSearch = '',
}: DataTableProps<TData, TValue>) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [searchValue, setSearchValue] = useState(currentSearch);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	// Handle server-side search
	const handleSearch = (value: string) => {
		setSearchValue(value);
	};

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams.toString());
		if (searchValue) {
			params.set('search', searchValue);
		} else {
			params.delete('search');
		}
		params.set('page', '1'); // Reset to page 1 on new search
		router.push(`?${params.toString()}`);
	};

	// Handle server-side pagination
	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', newPage.toString());
		router.push(`?${params.toString()}`);
	};

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
			<form onSubmit={handleSearchSubmit} className='flex gap-2 max-w-sm'>
				<Input
					placeholder='Search contacts...'
					value={searchValue}
					onChange={(e) => handleSearch(e.target.value)}
				/>
				<Button type='submit' variant='outline'>
					Search
				</Button>
			</form>

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

			{/* Server-side Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<div className='flex items-center justify-between'>
					<p className='text-sm text-muted-foreground'>
						Page {pagination.page} of {pagination.totalPages} (
						{pagination.total} total contacts)
					</p>
					<div className='flex items-center gap-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => handlePageChange(pagination.page - 1)}
							disabled={pagination.page <= 1}
						>
							Previous
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() => handlePageChange(pagination.page + 1)}
							disabled={
								pagination.page >= pagination.totalPages ||
								(rateLimit?.remaining ?? 0) <= 0
							}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
