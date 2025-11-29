import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, request) => {
	const { userId } = await auth();
	const url = request.nextUrl;

	// If user is logged in and tries to access auth pages, redirect to dashboard
	if (
		userId &&
		(url.pathname === '/sign-in' ||
			url.pathname === '/sign-up' ||
			url.pathname === '/')
	) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// If user is not logged in and tries to access protected routes, redirect to sign-in
	if (!userId && !isPublicRoute(request)) {
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}

	// Allow the request to proceed
	return NextResponse.next();
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
