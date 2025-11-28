// lib/user.ts
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export const DAILY_CONTACT_LIMIT = 50;

/**
 * Syncs Clerk user to database
 * Call this when user signs in or accesses the app
 */
export async function syncUser() {
	const clerkUser = await currentUser();

	if (!clerkUser) {
		return null;
	}

	// Check if user exists in database
	let user = await prisma.user.findUnique({
		where: { id: clerkUser.id },
	});

	// Create or update user
	if (!user) {
		user = await prisma.user.create({
			data: {
				id: clerkUser.id,
				email: clerkUser.emailAddresses[0]?.emailAddress || '',
				first_name: clerkUser.firstName,
				last_name: clerkUser.lastName,
				image_url: clerkUser.imageUrl,
			},
		});
	} else {
		// Update user info in case it changed
		user = await prisma.user.update({
			where: { id: clerkUser.id },
			data: {
				email: clerkUser.emailAddresses[0]?.emailAddress || '',
				first_name: clerkUser.firstName,
				last_name: clerkUser.lastName,
				image_url: clerkUser.imageUrl,
			},
		});
	}

	return user;
}

/**
 * Gets the number of contacts viewed today by user
 */
export async function getContactsViewedToday(userId: string): Promise<number> {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const logs = await prisma.contactViewLog.findMany({
		where: {
			user_id: userId,
			viewed_at: {
				gte: today,
				lt: tomorrow,
			},
		},
	});

	// Sum up all the counts
	return logs.reduce((total, log) => total + log.count, 0);
}

/**
 * Checks if user can view more contacts today
 */
export async function canViewContacts(userId: string): Promise<{
	canView: boolean;
	viewedToday: number;
	remaining: number;
}> {
	const viewedToday = await getContactsViewedToday(userId);
	const remaining = Math.max(0, DAILY_CONTACT_LIMIT - viewedToday);

	return {
		canView: viewedToday < DAILY_CONTACT_LIMIT,
		viewedToday,
		remaining,
	};
}

/**
 * Logs contact views for rate limiting
 */
export async function logContactView(
	userId: string,
	count: number = 1
): Promise<void> {
	await prisma.contactViewLog.create({
		data: {
			user_id: userId,
			count,
		},
	});
}

/**
 * Gets user's contact viewing stats
 */
export async function getUserStats(userId: string) {
	const viewedToday = await getContactsViewedToday(userId);
	const remaining = Math.max(0, DAILY_CONTACT_LIMIT - viewedToday);

	// Get total contacts ever viewed
	const totalLogs = await prisma.contactViewLog.findMany({
		where: { user_id: userId },
	});
	const totalViewed = totalLogs.reduce((total, log) => total + log.count, 0);

	return {
		viewedToday,
		remaining,
		totalViewed,
		limit: DAILY_CONTACT_LIMIT,
		percentage: (viewedToday / DAILY_CONTACT_LIMIT) * 100,
	};
}
