'use client';

import { AlertCircle } from 'lucide-react';

export function UpgradeModal() {
	return (
		<div className='bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto'>
			<div className='flex justify-center mb-4'>
				<div className='bg-orange-100 p-3 rounded-full'>
					<AlertCircle className='text-orange-600' size={32} />
				</div>
			</div>

			<h2 className='text-2xl font-bold text-gray-900 mb-2'>
				Daily Limit Reached
			</h2>

			<p className='text-gray-600 mb-6'>
				{
					"You've viewed your maximum of 50 contacts today. Upgrade your plan to view unlimited contacts."
				}
			</p>

			<div className='space-y-3'>
				<button className='w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700'>
					Upgrade Now
				</button>
				<button className='w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200'>
					Learn More
				</button>
			</div>

			<p className='text-xs text-gray-500 mt-4'>
				Your limit will reset at midnight
			</p>
		</div>
	);
}
