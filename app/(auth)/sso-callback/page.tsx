'use client';

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function SSOCallback() {
	return (
		<>
			<AuthenticateWithRedirectCallback
				signInUrl='/sign-in'
				signUpUrl='/sign-up'
				signInForceRedirectUrl='/dashboard'
				signUpForceRedirectUrl='/dashboard'
			/>
			<div className='flex min-h-screen items-center justify-center'>
				<div className='text-center'>
					<Loader2 className='h-8 w-8 animate-spin mx-auto mb-4' />
					<p className='text-muted-foreground'>Completing sign in...</p>
				</div>
			</div>
		</>
	);
}
