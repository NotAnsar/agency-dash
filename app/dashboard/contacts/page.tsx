import { getContacts } from '@/lib/data';
import { ContactsTable } from '@/components/contacts-table';
import { UpgradeModal } from '@/components/upgrade-modal';

export default async function ContactsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; search?: string }>;
}) {
	const params = await searchParams;
	const page = parseInt(params.page || '1');
	const search = params.search || '';

	const data = await getContacts({ page, limit: 20, search });

	return (
		<div>
			<div className='mb-6 flex justify-between items-start'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Contacts</h1>
					<p className='text-gray-600'>
						{data.rateLimit.remaining} of 50 views remaining today
					</p>
				</div>

				{/* Rate Limit Progress */}
				<div className='text-right'>
					<div className='text-sm text-gray-600 mb-1'>
						{data.rateLimit.viewedToday} / {data.rateLimit.limit} used
					</div>
					<div className='w-48 h-2 bg-gray-200 rounded-full overflow-hidden'>
						<div
							className='h-full bg-blue-600'
							style={{ width: `${data.rateLimit.percentage}%` }}
						/>
					</div>
				</div>
			</div>

			{data.rateLimit.limitReached ? (
				<UpgradeModal />
			) : (
				<ContactsTable data={data} />
			)}
		</div>
	);
}
