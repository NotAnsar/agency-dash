'use client';

import Link from 'next/link';
import { Menu, Home, Building2, Users } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import { ModeToggle } from '@/components/ModeToggle';
import Logo from '@/components/Logo';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);

	const navLinks = [
		{ href: '/dashboard', label: 'Dashboard', icon: Home },
		{ href: '/dashboard/agencies', label: 'Agencies', icon: Building2 },
		{ href: '/dashboard/contacts', label: 'Contacts', icon: Users },
	];

	return (
		<nav className='bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 shadow-sm border-b sticky top-0 z-30'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16 items-center'>
					{/* Logo */}
					<Link
						href='/dashboard'
						className='text-lg sm:text-xl font-bold flex gap-1.5 items-center hover:opacity-80 transition-opacity'
					>
						<Logo />
						<span className='hidden sm:inline'>Agency Dash</span>
						<span className='sm:hidden'>Dashboard</span>
					</Link>

					{/* Desktop Navigation */}
					<div className='hidden lg:flex items-center gap-1'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className='px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors'
							>
								{link.label}
							</Link>
						))}
					</div>

					{/* Right Side Actions */}
					<div className='flex items-center gap-2 sm:gap-4'>
						<div className='hidden sm:block'>
							<ModeToggle variant='ghost' />
						</div>
						<UserButton />

						{/* Mobile Menu */}
						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger className='lg:hidden p-2 hover:bg-accent rounded-md transition-colors'>
								<Menu className='h-5 w-5' />
								<span className='sr-only'>Open menu</span>
							</SheetTrigger>
							<SheetContent side='right' className='w-80'>
								<SheetHeader>
									<div className='flex items-center justify-between'>
										<SheetTitle>Menu</SheetTitle>
										{/* <button
											onClick={() => setIsOpen(false)}
											className='p-2 hover:bg-accent rounded-md transition-colors'
										>
											<X className='h-5 w-5' />
											<span className='sr-only'>Close menu</span>
										</button> */}
									</div>
								</SheetHeader>

								<div className='flex flex-col gap-2 mt-6'>
									{navLinks.map((link) => {
										const Icon = link.icon;
										return (
											<Link
												key={link.href}
												href={link.href}
												className='flex items-center gap-3 px-4 py-3 text-base hover:bg-accent rounded-lg transition-colors group'
												onClick={() => setIsOpen(false)}
											>
												<Icon className='h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors' />
												<span className='font-medium'>{link.label}</span>
											</Link>
										);
									})}

									<div className='border-t mt-4 pt-4'>
										<div className='flex items-center justify-between px-4 py-2'>
											<span className='text-sm text-muted-foreground'>
												Theme
											</span>
											<ModeToggle variant='ghost' />
										</div>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</nav>
	);
}
