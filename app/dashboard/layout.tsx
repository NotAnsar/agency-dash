import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId } = await auth();

	if (!userId) {
		redirect('/sign-in');
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<nav className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between h-16 items-center'>
						<div className='flex items-center gap-8'>
							<Link
								href='/dashboard'
								className='text-xl font-bold text-gray-900'
							>
								Agency Dashboard
							</Link>
							<div className='flex gap-4'>
								<Link
									href='/dashboard/agencies'
									className='text-gray-600 hover:text-gray-900'
								>
									Agencies
								</Link>
								<Link
									href='/dashboard/contacts'
									className='text-gray-600 hover:text-gray-900'
								>
									Contacts
								</Link>
							</div>
						</div>
						<UserButton afterSignOutUrl='/' />
					</div>
				</div>
			</nav>
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{children}
			</main>
		</div>
	);
}
