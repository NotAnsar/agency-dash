import { AgenciesTable } from '@/components/agencies-table';
import { getAgencies } from '@/lib/data';

export default async function AgenciesPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; search?: string }>;
}) {
	const params = await searchParams;
	const page = parseInt(params.page || '1');
	const search = params.search || '';

	const data = await getAgencies({ page, limit: 20, search });

	return (
		<div>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-gray-900'>Agencies</h1>
				<p className='text-gray-600'>View all agencies - unlimited access</p>
			</div>

			<AgenciesTable data={data} />
		</div>
	);
}
