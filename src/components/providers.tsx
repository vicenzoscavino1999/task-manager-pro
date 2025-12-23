'use client';

import { SessionProvider } from 'next-auth/react';
import { Navbar } from '@/components/layout/navbar';

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
            </div>
        </SessionProvider>
    );
}
