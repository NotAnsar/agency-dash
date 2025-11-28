import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
	const { userId } = await auth();

	if (userId) {
		redirect('/dashboard');
	}

	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100'>
			<div className='text-center'>
				<h1 className='text-5xl font-bold text-gray-900 mb-4'>
					Agency Dashboard
				</h1>
				<p className='text-xl text-gray-600 mb-8'>
					Manage agencies and contacts efficiently
				</p>
				<div className='flex gap-4 justify-center'>
					<Link
						href='/sign-in'
						className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
					>
						Sign In
					</Link>
					<Link
						href='/sign-up'
						className='px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50'
					>
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
}
