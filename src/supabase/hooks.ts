'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabase, useUser } from './provider';
import type { Hostel as AppHostel, Review as AppReview, UserProfile, Wishlist as AppWishlist } from '@/lib/types';

// Database row types (matching our schema)
interface DbHostel {
    id: string;
    name: string;
    address: string;
    contact: string;
    location_lat: number;
    location_lng: number;
    rent: number;
    deposit: number;
    fee_includes: string[];
    registration_fee: number;
    registration_deadline: string;
    verification_ai: boolean;
    verification_human: boolean;
    gender: 'male' | 'female' | 'mixed';
    room_sharing: 'single' | 'double' | 'multiple';
    created_at: string;
    updated_at: string;
}

interface DbHostelImage {
    id: string;
    hostel_id: string;
    url: string;
    alt: string;
    hint: string;
    display_order: number;
    created_at: string;
}

interface DbHostelAmenity {
    id: string;
    hostel_id: string;
    name: string;
    icon: string;
    created_at: string;
}

interface DbHostelFloor {
    id: string;
    hostel_id: string;
    level: number;
    created_at: string;
    hostel_rooms?: DbHostelRoom[];
}

interface DbHostelRoom {
    id: string;
    floor_id: string;
    name: string;
    status: 'available' | 'occupied' | 'maintenance';
    created_at: string;
}

interface DbReview {
    id: string;
    hostel_id: string;
    user_id: string;
    text: string;
    food_rating: number;
    cleanliness_rating: number;
    management_rating: number;
    safety_rating: number;
    image_url: string | null;
    user_display_name: string;
    user_photo_url: string | null;
    created_at: string;
}

interface DbProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string | null;
    date_of_birth: string | null;
    preferred_language: string;
    address: string | null;
    pin_code: string | null;
    country: string | null;
    state: string | null;
    category: string | null;
    annual_income: number | null;
    score_10th: number | null;
    score_12th: number | null;
    distance: number | null;
    created_at: string;
    updated_at: string;
}

interface DbWishlist {
    id: string;
    user_id: string;
    hostel_id: string;
    created_at: string;
}

// Convert database hostel to app hostel format
function toAppHostel(
    hostel: DbHostel,
    images: DbHostelImage[],
    amenities: DbHostelAmenity[],
    floors: DbHostelFloor[]
): AppHostel {
    return {
        id: hostel.id,
        name: hostel.name,
        address: hostel.address,
        contact: hostel.contact,
        location: {
            lat: hostel.location_lat,
            lng: hostel.location_lng,
        },
        images: images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            hint: img.hint,
        })),
        amenities: amenities.map((a) => ({
            id: a.id,
            name: a.name,
            icon: a.icon,
        })),
        feeStructure: {
            rent: hostel.rent,
            deposit: hostel.deposit,
            includes: hostel.fee_includes || [],
            registration: {
                fee: hostel.registration_fee,
                deadline: hostel.registration_deadline,
            },
        },
        verification: {
            ai: hostel.verification_ai,
            human: hostel.verification_human,
        },
        reviews: [], // Reviews are fetched separately
        floors: floors.map((f) => ({
            level: f.level,
            rooms: (f.hostel_rooms || []).map((r) => ({
                id: r.id,
                name: r.name,
                status: r.status,
            })),
        })),
        gender: hostel.gender,
        roomSharing: hostel.room_sharing,
    };
}

// Convert database review to app review format
function toAppReview(review: DbReview): AppReview {
    return {
        id: review.id,
        hostelId: review.hostel_id,
        userId: review.user_id,
        text: review.text,
        foodRating: review.food_rating,
        cleanlinessRating: review.cleanliness_rating,
        managementRating: review.management_rating,
        safetyRating: review.safety_rating,
        createdAt: new Date(review.created_at),
        userDisplayName: review.user_display_name,
        userPhotoURL: review.user_photo_url,
        imageUrl: review.image_url || undefined,
    };
}

// Convert database profile to app profile format
function toAppProfile(profile: DbProfile): UserProfile {
    return {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        mobileNumber: profile.mobile_number,
        dateOfBirth: profile.date_of_birth,
        preferredLanguage: profile.preferred_language,
        address: profile.address,
        pinCode: profile.pin_code,
        country: profile.country,
        state: profile.state,
        category: profile.category,
        annualIncome: profile.annual_income,
        score10th: profile.score_10th,
        score12th: profile.score_12th,
        distance: profile.distance,
    };
}

/**
 * Hook to fetch all hostels with their relations
 */
export function useHostels() {
    const supabase = useSupabase();
    const [data, setData] = useState<AppHostel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchHostels = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch hostels
            const { data: hostels, error: hostelsError } = await supabase
                .from('hostels')
                .select('*')
                .order('created_at', { ascending: false });

            if (hostelsError) throw hostelsError;
            if (!hostels || hostels.length === 0) {
                setData([]);
                return;
            }

            const typedHostels = hostels as unknown as DbHostel[];

            // Fetch related data for all hostels
            const hostelIds = typedHostels.map((h) => h.id);

            const [imagesRes, amenitiesRes, floorsRes] = await Promise.all([
                supabase.from('hostel_images').select('*').in('hostel_id', hostelIds),
                supabase.from('hostel_amenities').select('*').in('hostel_id', hostelIds),
                supabase.from('hostel_floors').select('*, hostel_rooms(*)').in('hostel_id', hostelIds),
            ]);

            const images = (imagesRes.data || []) as unknown as DbHostelImage[];
            const amenities = (amenitiesRes.data || []) as unknown as DbHostelAmenity[];
            const floors = (floorsRes.data || []) as unknown as DbHostelFloor[];

            // Map hostels with relations
            const appHostels = typedHostels.map((hostel) => {
                const hostelImages = images.filter((i) => i.hostel_id === hostel.id);
                const hostelAmenities = amenities.filter((a) => a.hostel_id === hostel.id);
                const hostelFloors = floors.filter((f) => f.hostel_id === hostel.id);
                return toAppHostel(hostel, hostelImages, hostelAmenities, hostelFloors);
            });

            setData(appHostels);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchHostels();

        // Set up realtime subscription
        const channel = supabase
            .channel('hostels_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'hostels' }, () => {
                fetchHostels();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, fetchHostels]);

    return { data, isLoading, error, refetch: fetchHostels };
}

/**
 * Hook to fetch a single hostel by ID
 */
export function useHostel(hostelId: string | null) {
    const supabase = useSupabase();
    const [data, setData] = useState<AppHostel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!hostelId) {
            setData(null);
            setIsLoading(false);
            return;
        }

        const fetchHostel = async () => {
            setIsLoading(true);
            try {
                const { data: hostel, error: hostelError } = await supabase
                    .from('hostels')
                    .select('*')
                    .eq('id', hostelId)
                    .single();

                if (hostelError) throw hostelError;
                if (!hostel) {
                    setData(null);
                    return;
                }

                const typedHostel = hostel as unknown as DbHostel;

                const [imagesRes, amenitiesRes, floorsRes] = await Promise.all([
                    supabase.from('hostel_images').select('*').eq('hostel_id', hostelId),
                    supabase.from('hostel_amenities').select('*').eq('hostel_id', hostelId),
                    supabase.from('hostel_floors').select('*, hostel_rooms(*)').eq('hostel_id', hostelId),
                ]);

                const appHostel = toAppHostel(
                    typedHostel,
                    (imagesRes.data || []) as unknown as DbHostelImage[],
                    (amenitiesRes.data || []) as unknown as DbHostelAmenity[],
                    (floorsRes.data || []) as unknown as DbHostelFloor[]
                );
                setData(appHostel);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHostel();
    }, [supabase, hostelId]);

    return { data, isLoading, error };
}

/**
 * Hook to fetch reviews for a hostel
 */
export function useReviews(hostelId: string | null) {
    const supabase = useSupabase();
    const [data, setData] = useState<AppReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchReviews = useCallback(async () => {
        if (!hostelId) {
            setData([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const { data: reviews, error: reviewsError } = await supabase
                .from('reviews')
                .select('*')
                .eq('hostel_id', hostelId)
                .order('created_at', { ascending: false });

            if (reviewsError) throw reviewsError;
            const typedReviews = (reviews || []) as unknown as DbReview[];
            setData(typedReviews.map(toAppReview));
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [supabase, hostelId]);

    useEffect(() => {
        fetchReviews();

        // Set up realtime subscription for this hostel's reviews
        if (hostelId) {
            const channel = supabase
                .channel(`reviews_${hostelId}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'reviews',
                        filter: `hostel_id=eq.${hostelId}`,
                    },
                    () => {
                        fetchReviews();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [supabase, hostelId, fetchReviews]);

    return { data, isLoading, error, refetch: fetchReviews };
}

/**
 * Hook to fetch user profile
 */
export function useProfile() {
    const supabase = useSupabase();
    const { user, isUserLoading } = useUser();
    const [data, setData] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (isUserLoading) return;

        if (!user) {
            setData(null);
            setIsLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                    // PGRST116 = no rows returned
                    throw profileError;
                }

                const typedProfile = profile as unknown as DbProfile | null;
                setData(typedProfile ? toAppProfile(typedProfile) : null);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [supabase, user, isUserLoading]);

    const updateProfile = useCallback(
        async (profileData: Partial<UserProfile>) => {
            if (!user) throw new Error('Must be logged in to update profile');

            const dbProfile = {
                id: user.id,
                first_name: profileData.firstName || '',
                last_name: profileData.lastName || '',
                email: profileData.email || user.email || '',
                mobile_number: profileData.mobileNumber || null,
                date_of_birth: profileData.dateOfBirth || null,
                preferred_language: profileData.preferredLanguage || 'en',
                address: profileData.address || null,
                pin_code: profileData.pinCode || null,
                country: profileData.country || null,
                state: profileData.state || null,
                category: profileData.category || null,
                annual_income: profileData.annualIncome ?? null,
                score_10th: profileData.score10th ?? null,
                score_12th: profileData.score12th ?? null,
                distance: profileData.distance ?? null,
                updated_at: new Date().toISOString(),
            };

            const { data: updated, error: updateError } = await supabase
                .from('profiles')
                .upsert(dbProfile as never)
                .select()
                .single();

            if (updateError) throw updateError;
            const typedUpdated = updated as unknown as DbProfile | null;
            if (typedUpdated) setData(toAppProfile(typedUpdated));
            return typedUpdated;
        },
        [supabase, user]
    );

    return { data, isLoading, error, updateProfile };
}

// Wishlist item type for internal use
interface WishlistItem {
    id: string;
    userId: string;
    hostelId: string;
    createdAt: Date;
}

/**
 * Hook to fetch user wishlist
 */
export function useWishlist() {
    const supabase = useSupabase();
    const { user, isUserLoading } = useUser();
    const [data, setData] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setData([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const { data: wishlist, error: wishlistError } = await supabase
                .from('wishlists')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (wishlistError) throw wishlistError;

            const typedWishlist = (wishlist || []) as unknown as DbWishlist[];
            setData(
                typedWishlist.map((w) => ({
                    id: w.id,
                    userId: w.user_id,
                    hostelId: w.hostel_id,
                    createdAt: new Date(w.created_at),
                }))
            );
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [supabase, user]);

    useEffect(() => {
        if (isUserLoading) return;
        fetchWishlist();

        // Set up realtime subscription
        if (user) {
            const channel = supabase
                .channel(`wishlist_${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'wishlists',
                        filter: `user_id=eq.${user.id}`,
                    },
                    () => {
                        fetchWishlist();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [supabase, user, isUserLoading, fetchWishlist]);

    const addToWishlist = useCallback(
        async (hostelId: string) => {
            if (!user) throw new Error('Must be logged in to add to wishlist');

            const { error: insertError } = await supabase.from('wishlists').insert({
                user_id: user.id,
                hostel_id: hostelId,
            } as never);

            if (insertError) throw insertError;
            fetchWishlist();
        },
        [supabase, user, fetchWishlist]
    );

    const removeFromWishlist = useCallback(
        async (hostelId: string) => {
            if (!user) throw new Error('Must be logged in to remove from wishlist');

            const { error: deleteError } = await supabase
                .from('wishlists')
                .delete()
                .eq('user_id', user.id)
                .eq('hostel_id', hostelId);

            if (deleteError) throw deleteError;
            fetchWishlist();
        },
        [supabase, user, fetchWishlist]
    );

    const isInWishlist = useCallback(
        (hostelId: string) => {
            return data.some((w) => w.hostelId === hostelId);
        },
        [data]
    );

    return { data, isLoading, error, addToWishlist, removeFromWishlist, isInWishlist, refetch: fetchWishlist };
}
