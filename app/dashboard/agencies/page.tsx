import { getAgencies } from '@/lib/data';
import { AgenciesDataTable } from '@/components/agencies/data-table';
import { columns } from '@/components/agencies/columns';

export default async function AgenciesPage() {
	const data = await getAgencies({ page: 1, limit: 1000, search: '' });

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Agencies</h1>
				<p className='text-muted-foreground mt-2'>
					Browse all {data.agencies.length} agencies - unlimited access
				</p>
			</div>

			<AgenciesDataTable columns={columns} data={data.agencies} />
		</div>
	);
}
// import { AgenciesTable } from '@/components/agencies-table';
// import { getAgencies } from '@/lib/data';

// export default async function AgenciesPage({
// 	searchParams,
// }: {
// 	searchParams: Promise<{ page?: string; search?: string }>;
// }) {
// 	const params = await searchParams;
// 	const page = parseInt(params.page || '1');
// 	const search = params.search || '';

// 	const data = await getAgencies({ page, limit: 20, search });

// 	return (
// 		<div>
// 			<div className='mb-6'>
// 				<h1 className='text-3xl font-bold text-gray-900'>Agencies</h1>
// 				<p className='text-gray-600'>View all agencies - unlimited access</p>
// 			</div>

// 			<AgenciesTable data={data} />
// 		</div>
// 	);
// }
