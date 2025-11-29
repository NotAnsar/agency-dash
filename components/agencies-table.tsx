'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

interface Agency {
	id: string;
	name: string;
	state: string | null;
	state_code: string | null;
	type: string | null;
	population: number | null;
	website: string | null;
	phone: string | null;
}

interface AgenciesTableProps {
	data: {
		agencies: Agency[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		};
	};
}

export function AgenciesTable({ data }: AgenciesTableProps) {
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
						placeholder='Search agencies by name, state, or type...'
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
									State
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Type
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Population
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Contact
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-200'>
							{data.agencies.map((agency) => (
								<tr key={agency.id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm font-medium text-gray-900'>
											{agency.name}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-900'>
											{agency.state || '-'}
										</div>
										<div className='text-xs text-gray-500'>
											{agency.state_code || ''}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span className='px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded'>
											{agency.type || 'N/A'}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
										{agency.population
											? agency.population.toLocaleString()
											: '-'}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm'>
										{agency.website && (
											<a
												href={agency.website}
												target='_blank'
												rel='noopener noreferrer'
												className='text-blue-600 hover:text-blue-800'
											>
												Website
											</a>
										)}
										{agency.phone && (
											<div className='text-gray-500 text-xs'>
												{agency.phone}
											</div>
										)}
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
