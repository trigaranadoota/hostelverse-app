'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
    onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);
    const [isTextVisible, setIsTextVisible] = useState(false);

    useEffect(() => {
        // Phase 1: Fade in text
        const textTimer = setTimeout(() => {
            setIsTextVisible(true);
        }, 100);

        // Phase 2: Wait and then fade out the whole screen
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
            // Give it time to finish the CSS transition before calling onComplete
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 500);
        }, 2500);

        return () => {
            clearTimeout(textTimer);
            clearTimeout(hideTimer);
        };
    }, [onComplete]);

    if (!isVisible && !isTextVisible) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            <div className="text-center px-4">
                <h1
                    className={cn(
                        "text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-gray-900 transition-all duration-1000 ease-out transform",
                        isTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                >
                    {t('heroTitle')}
                </h1>
                <div
                    className={cn(
                        "mt-4 h-[1px] bg-gray-200 mx-auto transition-all duration-1000 delay-300",
                        isTextVisible ? "w-24 opacity-100" : "w-0 opacity-0"
                    )}
                />
            </div>
        </div>
    );
};
