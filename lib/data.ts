import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import {
	syncUser,
	canViewContacts,
	logContactView,
	getUserStats,
} from '@/lib/user';

// Get Agencies (Unlimited)
export async function getAgencies({
	page = 1,
	limit = 20,
	search = '',
}: {
	page?: number;
	limit?: number;
	search?: string;
}) {
	const { userId } = await auth();

	if (!userId) {
		throw new Error('Unauthorized');
	}

	const skip = (page - 1) * limit;

	const where = search
		? {
				OR: [
					{ name: { contains: search, mode: 'insensitive' as const } },
					{ state: { contains: search, mode: 'insensitive' as const } },
					{ type: { contains: search, mode: 'insensitive' as const } },
				],
		  }
		: {};

	const [agencies, total] = await Promise.all([
		prisma.agency.findMany({
			where,
			skip,
			take: limit,
			orderBy: { name: 'asc' },
		}),
		prisma.agency.count({ where }),
	]);

	return {
		agencies,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}

// Get Contacts (Rate Limited - 50/day)
export async function getContacts({
	page = 1,
	limit = 20,
	search = '',
}: {
	page?: number;
	limit?: number;
	search?: string;
}) {
	const { userId } = await auth();

	if (!userId) {
		throw new Error('Unauthorized');
	}

	// Sync user to database
	await syncUser();

	// Check rate limit
	const { canView, remaining } = await canViewContacts(userId);

	if (!canView) {
		const stats = await getUserStats(userId);
		return {
			contacts: [],
			pagination: { page: 1, limit: 0, total: 0, totalPages: 0 },
			rateLimit: {
				limitReached: true,
				viewedToday: stats.viewedToday,
				remaining: 0,
				limit: stats.limit,
				percentage: stats.percentage,
			},
		};
	}

	// Limit results to remaining views
	const effectiveLimit = Math.min(limit, remaining);
	const skip = (page - 1) * effectiveLimit;

	const where = search
		? {
				OR: [
					{ first_name: { contains: search, mode: 'insensitive' as const } },
					{ last_name: { contains: search, mode: 'insensitive' as const } },
					{ email: { contains: search, mode: 'insensitive' as const } },
					{ title: { contains: search, mode: 'insensitive' as const } },
				],
		  }
		: {};

	const [contacts, total] = await Promise.all([
		prisma.contact.findMany({
			where,
			skip,
			take: effectiveLimit,
			orderBy: { last_name: 'asc' },
			include: {
				agency: {
					select: {
						name: true,
						state: true,
					},
				},
			},
		}),
		prisma.contact.count({ where }),
	]);

	// Log the view
	await logContactView(userId, contacts.length);

	// Get updated stats
	const stats = await getUserStats(userId);

	return {
		contacts,
		pagination: {
			page,
			limit: effectiveLimit,
			total,
			totalPages: Math.ceil(total / effectiveLimit),
		},
		rateLimit: {
			limitReached: false,
			viewedToday: stats.viewedToday,
			remaining: stats.remaining,
			limit: stats.limit,
			percentage: stats.percentage,
		},
	};
}

// Get User Stats
export async function getCurrentUserStats() {
	const { userId } = await auth();

	if (!userId) {
		throw new Error('Unauthorized');
	}

	await syncUser();
	return await getUserStats(userId);
}
