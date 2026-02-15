'use client';

import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from 'react';
import { createClient } from './client';
import type { SupabaseClient, User, Session } from '@supabase/supabase-js';
import type { Database } from './types';

interface SupabaseContextState {
    supabase: SupabaseClient<Database>;
    user: User | null;
    session: Session | null;
    isLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextState | undefined>(undefined);

interface SupabaseProviderProps {
    children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
    const [supabase] = useState(() => createClient());
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error('Supabase getSession error:', error.message);
                    // Special handling for refresh token errors
                    if (error.message.includes('Refresh Token Not Found') || error.message.includes('invalid refresh token')) {
                        console.warn('Invalid refresh token detected. Signing out to clear stale session.');
                        await supabase.auth.signOut();
                        setSession(null);
                        setUser(null);
                    }
                } else {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
            } catch (err) {
                console.error('Unexpected error during Supabase session initialization:', err);
            } finally {
                setIsLoading(false);
            }
        };

        getInitialSession();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Supabase auth event:', event);
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const value = useMemo(
        () => ({
            supabase,
            user,
            session,
            isLoading,
        }),
        [supabase, user, session, isLoading]
    );

    return (
        <SupabaseContext.Provider value={value}>
            {children}
        </SupabaseContext.Provider>
    );
}

/**
 * Hook to access Supabase client instance
 */
export function useSupabase() {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context.supabase;
}

/**
 * Hook to access current authenticated user
 */
export function useUser() {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a SupabaseProvider');
    }
    return {
        user: context.user,
        session: context.session,
        isUserLoading: context.isLoading,
    };
}

/**
 * Hook to access the full Supabase context
 */
export function useSupabaseContext() {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error('useSupabaseContext must be used within a SupabaseProvider');
    }
    return context;
}
