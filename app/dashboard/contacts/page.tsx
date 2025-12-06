import { getContacts } from '@/lib/data';
import { ContactsDataTable } from '@/components/contacts/data-table';
import { columns } from '@/components/contacts/columns';
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

	if (data.rateLimit.limitReached) {
		return (
			<div className='space-y-6'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Contacts</h1>
					<p className='text-muted-foreground mt-2'>Daily limit reached</p>
				</div>
				<UpgradeModal />
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Contacts</h1>
				<p className='text-muted-foreground mt-2'>
					View contact information - {data.rateLimit.remaining} of 50 views
					remaining today
				</p>
			</div>

			<ContactsDataTable
				columns={columns}
				data={data.contacts}
				rateLimit={data.rateLimit}
				pagination={data.pagination}
				currentSearch={search}
			/>
		</div>
	);
}
