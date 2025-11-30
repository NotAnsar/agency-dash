'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Mail, Phone } from 'lucide-react';

export type Contact = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	email: string;
	phone: string | null;
	title: string | null;
	department: string | null;
	agency: {
		name: string;
		state: string | null;
	} | null;
};

export const columns: ColumnDef<Contact>[] = [
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
			const firstName = row.original.first_name;
			const lastName = row.original.last_name;
			const department = row.original.department;

			return (
				<div className='flex flex-col'>
					<span className='font-medium'>
						{firstName || ''} {lastName || ''}
					</span>
					{department && (
						<span className='text-xs text-muted-foreground'>{department}</span>
					)}
				</div>
			);
		},
		accessorFn: (row) => `${row.first_name || ''} ${row.last_name || ''}`,
	},
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => {
			return <div>{row.getValue('title') || '-'}</div>;
		},
	},
	{
		accessorKey: 'agency',
		header: 'Agency',
		cell: ({ row }) => {
			const agency = row.original.agency;
			if (!agency)
				return <span className='text-muted-foreground'>No agency</span>;

			return (
				<div className='flex flex-col'>
					<span>{agency.name}</span>
					{agency.state && (
						<span className='text-xs text-muted-foreground'>
							{agency.state}
						</span>
					)}
				</div>
			);
		},
		accessorFn: (row) => row.agency?.name || '',
	},
	{
		id: 'contact',
		header: 'Contact',
		cell: ({ row }) => {
			const email = row.original.email;
			const phone = row.original.phone;

			return (
				<div className='flex flex-col gap-1'>
					<a
						href={`mailto:${email}`}
						className='flex items-center gap-1 text-sm text-primary hover:underline'
					>
						<Mail className='h-3 w-3' />
						{email}
					</a>
					{phone && (
						<a
							href={`tel:${phone}`}
							className='flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
						>
							<Phone className='h-3 w-3' />
							{phone}
						</a>
					)}
				</div>
			);
		},
	},
];
