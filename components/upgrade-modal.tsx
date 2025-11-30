'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UpgradeModal() {
	return (
		<div className='bg-card rounded-lg shadow-lg border p-8 text-center mx-auto'>
			<div className='flex justify-center mb-4'>
				<div className='bg-orange-100 dark:bg-orange-950 p-3 rounded-full'>
					<AlertCircle
						className='text-orange-600 dark:text-orange-500'
						size={32}
					/>
				</div>
			</div>

			<h2 className='text-2xl font-bold mb-2'>Daily Limit Reached</h2>

			<p className='text-muted-foreground mb-6'>
				{
					"You've viewed your maximum of 50 contacts today. Upgrade your plan to view unlimited contacts."
				}
			</p>

			<div className='space-y-3'>
				<Button className='w-full'>Upgrade Now</Button>
				<Button variant='outline' className='w-full'>
					Learn More
				</Button>
			</div>

			<p className='text-xs text-muted-foreground mt-4'>
				Your limit will reset at midnight
			</p>
		</div>
	);
}
