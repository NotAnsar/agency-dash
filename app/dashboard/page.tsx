import { auth, currentUser } from '@clerk/nextjs/server';
import { syncUser } from '@/lib/user';

export default async function DashboardPage() {
	const { userId } = await auth();
	const user = await currentUser();

	// Sync user to database
	await syncUser();

	return (
		<div>
			<h1 className='text-3xl font-bold text-gray-900 mb-2'>
				Welcome back, {user?.firstName || 'User'}! with ID {userId}
			</h1>
			<p className='text-gray-600 mb-8'>
				Manage your agencies and contacts from here.
			</p>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-xl font-semibold mb-2'>Agencies</h2>
					<p className='text-gray-600'>View all agencies without limits</p>
				</div>

				<div className='bg-white p-6 rounded-lg shadow'>
					<h2 className='text-xl font-semibold mb-2'>Contacts</h2>
					<p className='text-gray-600'>View up to 50 contacts per day</p>
				</div>
			</div>
		</div>
	);
}
