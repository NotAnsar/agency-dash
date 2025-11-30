import { auth, currentUser } from '@clerk/nextjs/server';
import { syncUser, getUserStats } from '@/lib/user';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Building2, Users, Eye, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
	const { userId } = await auth();
	const user = await currentUser();

	if (!userId) return null;

	// Sync user to database
	await syncUser();
	const stats = await getUserStats(userId);

	// Get counts
	const [agenciesCount, contactsCount] = await Promise.all([
		prisma.agency.count(),
		prisma.contact.count(),
	]);

	return (
		<div className='space-y-8'>
			{/* Welcome Section */}
			<div>
				<h1 className='text-3xl font-bold mb-2'>
					Welcome back, {user?.firstName || 'User'}!
				</h1>
				<p className='text-muted-foreground'>
					Manage your agencies and contacts from here.
				</p>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{/* Total Agencies */}
				<div className='bg-card p-6 rounded-lg shadow border'>
					<div className='flex items-center justify-between mb-4'>
						<div className='p-2 bg-primary/10 rounded-lg'>
							<Building2 className='h-6 w-6 text-primary' />
						</div>
					</div>
					<h3 className='text-2xl font-bold'>{agenciesCount}</h3>
					<p className='text-sm text-muted-foreground mt-1'>Total Agencies</p>
				</div>

				{/* Total Contacts */}
				<div className='bg-card p-6 rounded-lg shadow border'>
					<div className='flex items-center justify-between mb-4'>
						<div className='p-2 bg-primary/10 rounded-lg'>
							<Users className='h-6 w-6 text-primary' />
						</div>
					</div>
					<h3 className='text-2xl font-bold'>{contactsCount}</h3>
					<p className='text-sm text-muted-foreground mt-1'>Total Contacts</p>
				</div>

				{/* Views Today */}
				<div className='bg-card p-6 rounded-lg shadow border'>
					<div className='flex items-center justify-between mb-4'>
						<div className='p-2 bg-primary/10 rounded-lg'>
							<Eye className='h-6 w-6 text-primary' />
						</div>
					</div>
					<h3 className='text-2xl font-bold'>{stats.viewedToday}</h3>
					<p className='text-sm text-muted-foreground mt-1'>
						Views Today ({stats.remaining} left)
					</p>
				</div>

				{/* Total Views */}
				<div className='bg-card p-6 rounded-lg shadow border'>
					<div className='flex items-center justify-between mb-4'>
						<div className='p-2 bg-primary/10 rounded-lg'>
							<TrendingUp className='h-6 w-6 text-primary' />
						</div>
					</div>
					<h3 className='text-2xl font-bold'>{stats.totalViewed}</h3>
					<p className='text-sm text-muted-foreground mt-1'>Total Views</p>
				</div>
			</div>

			{/* Quick Access Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Link
					href='/dashboard/agencies'
					className='bg-card p-6 rounded-lg shadow border hover:border-primary transition-colors group'
				>
					<div className='flex items-start gap-4'>
						<div className='p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'>
							<Building2 className='h-6 w-6 text-primary' />
						</div>
						<div className='flex-1'>
							<h2 className='text-xl font-semibold mb-2'>Agencies</h2>
							<p className='text-muted-foreground'>
								View all {agenciesCount} agencies without limits
							</p>
						</div>
					</div>
				</Link>

				<Link
					href='/dashboard/contacts'
					className='bg-card p-6 rounded-lg shadow border hover:border-primary transition-colors group'
				>
					<div className='flex items-start gap-4'>
						<div className='p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'>
							<Users className='h-6 w-6 text-primary' />
						</div>
						<div className='flex-1'>
							<h2 className='text-xl font-semibold mb-2'>Contacts</h2>
							<p className='text-muted-foreground'>
								View up to 50 contacts per day • {stats.remaining} remaining
							</p>
						</div>
					</div>
				</Link>
			</div>

			{/* Usage Progress */}
			<div className='bg-card p-6 rounded-lg shadow border'>
				<h3 className='font-semibold mb-4'>Daily Usage</h3>
				<div className='space-y-2'>
					<div className='flex items-center justify-between text-sm'>
						<span className='text-muted-foreground'>Contact Views</span>
						<span className='font-medium'>
							{stats.viewedToday} / {stats.limit}
						</span>
					</div>
					<div className='w-full bg-secondary rounded-full h-2 overflow-hidden'>
						<div
							className='bg-primary h-full transition-all duration-300'
							style={{ width: `${stats.percentage}%` }}
						/>
					</div>
					<p className='text-xs text-muted-foreground'>
						{stats.percentage >= 100
							? 'Daily limit reached. Resets at midnight.'
							: `${stats.remaining} views remaining today.`}
					</p>
				</div>
			</div>
		</div>
	);
}
