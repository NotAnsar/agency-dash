'use client';

import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function SignUpForm() {
	const { signUp, setActive, isLoaded } = useSignUp();
	const router = useRouter();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [code, setCode] = useState('');
	const [verifying, setVerifying] = useState(false);
	const [errors, setErrors] = useState<{
		firstName?: string;
		lastName?: string;
		email?: string;
		password?: string;
		code?: string;
		general?: string;
	}>({});
	const [isLoading, setIsLoading] = useState(false);

	// Handle OAuth sign up
	const signUpWithGoogle = async () => {
		if (!isLoaded) return;

		try {
			await signUp.authenticateWithRedirect({
				strategy: 'oauth_google',
				redirectUrl: '/sso-callback',
				redirectUrlComplete: '/dashboard',
			});
		} catch (err: unknown) {
			console.error('OAuth error:', err);
			setErrors({ general: 'Failed to sign up with Google' });
		}
	};

	// Handle email/password sign up
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded) return;

		setErrors({});
		setIsLoading(true);

		// Validation
		const newErrors: typeof errors = {};
		if (!firstName) newErrors.firstName = 'First name is required';
		if (!lastName) newErrors.lastName = 'Last name is required';
		if (!email) newErrors.email = 'Email is required';
		if (!password) newErrors.password = 'Password is required';
		if (password && password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setIsLoading(false);
			return;
		}

		try {
			await signUp.create({
				firstName,
				lastName,
				emailAddress: email,
				password,
			});

			// Send verification email
			await signUp.prepareEmailAddressVerification({
				strategy: 'email_code',
			});

			setVerifying(true);
		} catch (err: unknown) {
			console.error('Sign up error:', err);
			const errorMessage =
				err &&
				typeof err === 'object' &&
				'errors' in err &&
				Array.isArray(err.errors)
					? err.errors[0]?.message
					: 'Failed to create account';
			setErrors({ general: errorMessage });
		} finally {
			setIsLoading(false);
		}
	};

	// Handle verification
	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded) return;

		setIsLoading(true);
		setErrors({});

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code,
			});

			if (completeSignUp.status === 'complete') {
				await setActive({ session: completeSignUp.createdSessionId });
				router.push('/dashboard');
			}
		} catch (err: unknown) {
			console.error('Verification error:', err);
			const errorMessage =
				err &&
				typeof err === 'object' &&
				'errors' in err &&
				Array.isArray(err.errors)
					? err.errors[0]?.message
					: 'Invalid verification code';
			setErrors({ code: errorMessage });
			setIsLoading(false);
		}
	};

	// Show verification form
	if (verifying) {
		return (
			<form className='grid gap-4' onSubmit={handleVerify}>
				<div className='space-y-2'>
					<Label>Verification Code</Label>
					<Input
						type='text'
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder='Enter 6-digit code'
						maxLength={6}
						className='bg-transparent text-center text-2xl tracking-widest'
					/>
					<p className='text-xs text-muted-foreground'>
						Check your email for the verification code
					</p>
					{errors.code && (
						<p className='text-sm font-medium text-destructive'>
							{errors.code}
						</p>
					)}
				</div>

				<Button type='submit' disabled={isLoading}>
					{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
					Verify Email
				</Button>

				<Button
					type='button'
					variant='ghost'
					onClick={() => setVerifying(false)}
					className='text-sm'
				>
					Back to sign up
				</Button>
			</form>
		);
	}

	// Show sign up form
	return (
		<div className='grid gap-4'>
			{/* Google OAuth */}
			<Button
				type='button'
				variant='outline'
				onClick={signUpWithGoogle}
				className='w-full'
			>
				<svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
					<path
						fill='currentColor'
						d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
					/>
					<path
						fill='currentColor'
						d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
					/>
					<path
						fill='currentColor'
						d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
					/>
					<path
						fill='currentColor'
						d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
					/>
				</svg>
				Continue with Google
			</Button>

			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-background px-2 text-muted-foreground'>Or</span>
				</div>
			</div>

			{/* Email/Password Form */}
			<form className='grid gap-4' onSubmit={handleSubmit}>
				<div className='grid grid-cols-2 gap-4'>
					{/* First Name */}
					<div className='space-y-2'>
						<Label className={cn(errors.firstName ? 'text-destructive' : '')}>
							First Name
						</Label>
						<Input
							type='text'
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder='John'
							className={cn(
								'bg-transparent',
								errors.firstName
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						{errors.firstName && (
							<p className='text-sm font-medium text-destructive'>
								{errors.firstName}
							</p>
						)}
					</div>

					{/* Last Name */}
					<div className='space-y-2'>
						<Label className={cn(errors.lastName ? 'text-destructive' : '')}>
							Last Name
						</Label>
						<Input
							type='text'
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							placeholder='Doe'
							className={cn(
								'bg-transparent',
								errors.lastName
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						{errors.lastName && (
							<p className='text-sm font-medium text-destructive'>
								{errors.lastName}
							</p>
						)}
					</div>
				</div>

				{/* Email */}
				<div className='space-y-2'>
					<Label className={cn(errors.email ? 'text-destructive' : '')}>
						Email
					</Label>
					<Input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='name@example.com'
						className={cn(
							'bg-transparent',
							errors.email
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					{errors.email && (
						<p className='text-sm font-medium text-destructive'>
							{errors.email}
						</p>
					)}
				</div>

				{/* Password */}
				<div className='space-y-2'>
					<Label className={cn(errors.password ? 'text-destructive' : '')}>
						Password
					</Label>
					<Input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='********'
						autoComplete='new-password'
						className={cn(
							'bg-transparent',
							errors.password
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					{errors.password && (
						<p className='text-sm font-medium text-destructive'>
							{errors.password}
						</p>
					)}
					<p className='text-xs text-muted-foreground'>
						Must be at least 8 characters
					</p>
				</div>

				{/* General Error */}
				{errors.general && (
					<p className='text-sm font-medium text-destructive'>
						{errors.general}
					</p>
				)}

				{/* Submit Button */}
				<Button type='submit' disabled={isLoading}>
					{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
					Create Account
				</Button>
			</form>

			{/* Links */}
			<div className='text-center text-sm text-muted-foreground'>
				Already have an account?{' '}
				<Link
					href='/sign-in'
					className='text-foreground font-medium hover:underline'
				>
					Sign in
				</Link>
			</div>
		</div>
	);
}
