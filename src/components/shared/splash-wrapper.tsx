'use client';

import React, { useState, useEffect } from 'react';
import { SplashScreen } from './splash-screen';
import { usePathname, useRouter } from 'next/navigation';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // If we are on the root path, we might want to redirect after splash
        // but the actual redirect logic is better handled in the page or here.
    }, []);

    const handleSplashComplete = () => {
        setShowSplash(false);
        if (pathname === '/') {
            router.push('/hostels');
        }
    };

    return (
        <>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <div className={`transition-opacity duration-700 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
                {children}
            </div>
        </>
    );
}
