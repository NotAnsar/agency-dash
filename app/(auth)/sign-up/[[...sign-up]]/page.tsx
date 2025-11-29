import { SignUpForm } from '@/components/auth/sign-up-form';
import Logo from '@/components/Logo';

export default function SignUpPage() {
	return (
		<>
			<div className='flex flex-col space-y-2 '>
				<div className='flex gap-1.5 items-center'>
					<Logo className='text-foreground w-[26px] h-auto -rotate-45' />
					<h4 className='text-[28px] font-serif font-medium tracking-wide'>
						Agency Dash
					</h4>
				</div>

				<h1 className='text-4xl font-medium tracking-tight '>Welcome Back</h1>

				<p className='text-sm text-muted-foreground'>
					Sign In To Your Account Below
				</p>
			</div>

			<SignUpForm />
		</>
	);
}
