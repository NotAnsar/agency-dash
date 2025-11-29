'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Mail, Phone } from 'lucide-react';

interface Contact {
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
}

interface ContactsTableProps {
	data: {
		contacts: Contact[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		};
		rateLimit: {
			limitReached: boolean;
			viewedToday: number;
			remaining: number;
			limit: number;
			percentage: number;
		};
	};
}

export function ContactsTable({ data }: ContactsTableProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(searchParams.get('search') || '');

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams);
		if (search) {
			params.set('search', search);
		} else {
			params.delete('search');
		}
		params.set('page', '1');
		router.push(`?${params.toString()}`);
	};

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams);
		params.set('page', newPage.toString());
		router.push(`?${params.toString()}`);
	};

	return (
		<div>
			{/* Search */}
			<form onSubmit={handleSearch} className='mb-6'>
				<div className='relative'>
					<Search
						className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
						size={20}
					/>
					<input
						type='text'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder='Search contacts by name, email, or title...'
						className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>
			</form>

			{/* Table */}
			<div className='bg-white rounded-lg shadow overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full'>
						<thead className='bg-gray-50 border-b border-gray-200'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Name
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Title
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Agency
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Contact
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-200'>
							{data.contacts.map((contact) => (
								<tr key={contact.id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm font-medium text-gray-900'>
											{contact.first_name || ''} {contact.last_name || ''}
										</div>
										{contact.department && (
											<div className='text-xs text-gray-500'>
												{contact.department}
											</div>
										)}
									</td>
									<td className='px-6 py-4'>
										<div className='text-sm text-gray-900'>
											{contact.title || '-'}
										</div>
									</td>
									<td className='px-6 py-4'>
										{contact.agency ? (
											<div>
												<div className='text-sm text-gray-900'>
													{contact.agency.name}
												</div>
												<div className='text-xs text-gray-500'>
													{contact.agency.state || ''}
												</div>
											</div>
										) : (
											<span className='text-sm text-gray-400'>No agency</span>
										)}
									</td>
									<td className='px-6 py-4'>
										<div className='flex flex-col gap-1'>
											<a
												href={`mailto:${contact.email}`}
												className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800'
											>
												<Mail size={14} />
												{contact.email}
											</a>
											{contact.phone && (
												<a
													href={`tel:${contact.phone}`}
													className='flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800'
												>
													<Phone size={14} />
													{contact.phone}
												</a>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className='bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200'>
					<div className='text-sm text-gray-700'>
						Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to{' '}
						{Math.min(
							data.pagination.page * data.pagination.limit,
							data.pagination.total
						)}{' '}
						of {data.pagination.total} results
					</div>
					<div className='flex gap-2'>
						<button
							onClick={() => handlePageChange(data.pagination.page - 1)}
							disabled={data.pagination.page === 1}
							className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
						>
							Previous
						</button>
						<button
							onClick={() => handlePageChange(data.pagination.page + 1)}
							disabled={data.pagination.page === data.pagination.totalPages}
							className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
