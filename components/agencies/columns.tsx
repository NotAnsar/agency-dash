'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ExternalLink } from 'lucide-react';

export type Agency = {
	id: string;
	name: string;
	state: string | null;
	state_code: string | null;
	type: string | null;
	population: number | null;
	website: string | null;
	phone: string | null;
};

export const columns: ColumnDef<Agency>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Name
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			return <div className='font-medium px-2'>{row.getValue('name')}</div>;
		},
	},
	{
		accessorKey: 'state',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					State
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const state = row.original.state;
			const stateCode = row.original.state_code;
			return (
				<div className='flex flex-col px-2'>
					<span>{state || '-'}</span>
					{stateCode && (
						<span className='text-xs text-muted-foreground'>{stateCode}</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => {
			const type = row.getValue('type') as string | null;
			if (!type) return '-';
			return (
				<span className='inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary'>
					{type}
				</span>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: 'population',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Population
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const population = row.getValue('population') as number | null;
			return population ? population.toLocaleString() : '-';
		},
	},
	{
		id: 'website',
		header: 'Website',
		cell: ({ row }) => {
			const agency = row.original;
			if (!agency.website) return null;

			return (
				<Button variant='ghost' size='sm' asChild>
					<a href={agency.website} target='_blank' rel='noopener noreferrer'>
						<ExternalLink className='h-4 w-4' />
					</a>
				</Button>
			);
		},
	},
];
