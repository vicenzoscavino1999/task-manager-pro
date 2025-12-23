'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CheckSquare,
    LogOut,
    Menu,
    X,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Tasks', href: '/', icon: CheckSquare },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (!session) return null;

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <CheckSquare className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                            Task Manager Pro
                        </span>
                    </Link>
                </div>

                {/* Desktop navigation */}
                <div className="hidden md:flex md:items-center md:space-x-6">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center space-x-1 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* User menu */}
                <div className="hidden md:flex md:items-center md:space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{session.user?.name || session.user?.email}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t animate-slide-up">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium',
                                        isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        <div className="border-t pt-2 mt-2">
                            <div className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>{session.user?.name || session.user?.email}</span>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => signOut({ callbackUrl: '/login' })}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
