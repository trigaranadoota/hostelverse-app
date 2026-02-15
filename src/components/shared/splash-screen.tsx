'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

import Image from 'next/image';

interface SplashScreenProps {
    onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);
    const [isLogoVisible, setIsLogoVisible] = useState(false);
    const [isTextVisible, setIsTextVisible] = useState(false);

    useEffect(() => {
        // Phase 1: Fade in logo first
        const logoTimer = setTimeout(() => {
            setIsLogoVisible(true);
        }, 300);

        // Phase 2: Fade in text after logo
        const textTimer = setTimeout(() => {
            setIsTextVisible(true);
        }, 1300);

        // Phase 3: Wait and then fade out the whole screen
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
            // Give it time to finish the CSS transition before calling onComplete
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 500);
        }, 3500);

        return () => {
            clearTimeout(logoTimer);
            clearTimeout(textTimer);
            clearTimeout(hideTimer);
        };
    }, [onComplete]);

    if (!isVisible && !isLogoVisible && !isTextVisible) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-700 ease-in-out",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            <div className="flex flex-col items-center gap-8 px-4 max-w-sm">
                <div
                    className={cn(
                        "transition-all duration-1000 ease-out transform",
                        isLogoVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                    )}
                >
                    <Image
                        src="/logo.png"
                        alt="HostelVerse Logo"
                        width={180}
                        height={180}
                        priority
                        className="w-auto h-auto max-h-[180px] object-contain drop-shadow-sm"
                    />
                </div>

                <div className="text-center space-y-4">
                    <h1
                        className={cn(
                            "text-2xl md:text-3xl font-light tracking-tight text-gray-900 transition-all duration-1000 ease-out transform",
                            isTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                    >
                        {t('heroTitle')}
                    </h1>
                    <div
                        className={cn(
                            "h-[1px] bg-gray-100 mx-auto transition-all duration-1000 delay-300",
                            isTextVisible ? "w-24 opacity-100" : "w-0 opacity-0"
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
