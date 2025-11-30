import Header from '@/components/Header';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

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
		<div className='min-h-screen bg-background'>
			<Header />
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{children}
			</main>
		</div>
	);
}
