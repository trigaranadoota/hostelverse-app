
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useUser, useProfile, useWishlist, useHostel } from "@/supabase";
import type { Wishlist, UserProfile } from "@/lib/types";
import { Card, CardTitle, CardFooter, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Star, BedDouble, Wallet, User, Milestone, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

// Simplified calculation that can run on the client for the current user only
function calculateCurrentUserScore(userProfile: UserProfile | null) {
    if (!userProfile) return { total: 0, breakdown: {} };

    // --- 1. INCOME CALCULATION (Exact Tiers) ---
    let incomePoints = 0;
    const income = userProfile.annualIncome || 0;

    if (income <= 400000) {
        incomePoints = 30;
    } else if (income <= 800000) {
        incomePoints = 25;
    } else if (income <= 1200000) {
        incomePoints = 20;
    } else if (income <= 1600000) {
        incomePoints = 15;
    } else if (income <= 2000000) {
        incomePoints = 10;
    } else if (income <= 2400000) {
        incomePoints = 5;
    } else {
        incomePoints = 0; // Above 24L
    }

    // --- 2. CATEGORY CALCULATION ---
    let categoryPoints = 0;
    const category = (userProfile.category || 'general').toLowerCase().trim();

    switch (category) {
        case "physically challenged":
        case "pc":
            categoryPoints = 25; // Highest Priority
            break;
        case "sc":
        case "st":
        case "sc/st":
            categoryPoints = 20;
            break;
        case "obc":
            categoryPoints = 15;
            break;
        case "general":
            categoryPoints = 10;
            break;
        default:
            categoryPoints = 10; // Default to General if undefined
    }

    // --- 3. DISTANCE CALCULATION (Max 25km) ---
    const MAX_DIST_POINTS = 25;
    const MAX_KM_CAP = 25;

    const userDistance = userProfile.distance || 0;
    let effectiveDistance = userDistance > MAX_KM_CAP ? MAX_KM_CAP : userDistance;

    let distancePoints = (effectiveDistance / MAX_KM_CAP) * MAX_DIST_POINTS;


    // --- 4. ACADEMIC SCORE (Merit) ---
    const MAX_ACADEMIC_POINTS = 20;

    let averageScore = ((userProfile.score10th || 0) + (userProfile.score12th || 0)) / 2;

    let academicPoints = (averageScore / 100) * MAX_ACADEMIC_POINTS;

    const totalScore = incomePoints + categoryPoints + distancePoints + academicPoints;

    return {
        total: parseFloat(totalScore.toFixed(2)),
        breakdown: {
            income: incomePoints,
            category: categoryPoints,
            distance: parseFloat(distancePoints.toFixed(2)),
            academics: parseFloat(academicPoints.toFixed(2))
        }
    };
}


function WaitingListCard({ wishlistItem }: { wishlistItem: Wishlist }) {
    const [availableRooms, setAvailableRooms] = useState<number>(0);
    const [rankingInfo, setRankingInfo] = useState<{ rank: string, score: number | string, scoreBreakdown?: any } | null>(null);

    const { data: hostel, isLoading: isHostelLoading } = useHostel(wishlistItem.hostelId);

    // We fetch the profile again here? Or pass it down?
    // The previous code fetched it per card, which is inefficient.
    // Ideally we fetch profile once in parent and pass it down.
    // But hooks control their own state. initializing useProfile multiple times is fine if it uses context/cache.
    // Our useProfile implementation fetches from Supabase every time it mounts.
    // Optimization: Let's fetch profile in parent and pass it.
    // For now I'll just use useProfile() here to keep structure similar, 
    // but better to pass it as prop if possible.
    // Wait, the parent `WaitingListPage` already needs `user`.
    // Let's use `useProfile` in parent and pass `userProfile` to card.
    return null; // Logic moved to parent for rendering
}

function WaitingListCardContent({ wishlistItem, userProfile, hostel, isHostelLoading }: { wishlistItem: Wishlist, userProfile: UserProfile | null, hostel: any, isHostelLoading: boolean }) {
    const [availableRooms, setAvailableRooms] = useState<number>(0);
    const [rankingInfo, setRankingInfo] = useState<{ rank: string, score: number | string, scoreBreakdown?: any } | null>(null);

    useEffect(() => {
        if (isHostelLoading) return;

        if (hostel) {
            const count = hostel.floors.reduce((acc: number, floor: any) => {
                return acc + floor.rooms.filter((room: any) => room.status === 'available').length;
            }, 0);
            setAvailableRooms(count);
        }

        const scoreData = calculateCurrentUserScore(userProfile);
        setRankingInfo({
            rank: "N/A", // We can't calculate rank securely on the client
            score: scoreData.total,
            scoreBreakdown: scoreData.breakdown
        });

    }, [hostel, userProfile, isHostelLoading]);

    if (isHostelLoading) {
        return (
            <Card className="flex flex-col sm:flex-row gap-4 p-4">
                <Skeleton className="w-full sm:w-48 h-32 rounded-md" />
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4 rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                    <div className="flex gap-4 pt-2">
                        <Skeleton className="h-8 w-24 rounded-md" />
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                </div>
            </Card>
        );
    }

    if (!hostel) return null;

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                    <Image
                        src={hostel.images[0].url}
                        alt={hostel.images[0].alt}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-6 flex-1">
                    <CardTitle className="font-headline tracking-tight mb-1">{hostel.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-4">{hostel.address}</p>

                    <Badge variant="outline" className="mb-4">Ranking across users is not available.</Badge>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="flex flex-col items-center p-3 bg-muted rounded-lg text-center">
                            <Trophy className="w-6 h-6 mb-1 text-primary" />
                            <span className="text-2xl font-bold">{rankingInfo?.rank || 'N/A'}</span>
                            <span className="text-xs text-muted-foreground">Your Rank</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-muted rounded-lg text-center">
                            <Star className="w-6 h-6 mb-1 text-yellow-500" />
                            <span className="text-2xl font-bold">{rankingInfo?.score || 'N/A'}</span>
                            <span className="text-xs text-muted-foreground">Your Points</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-muted rounded-lg text-center">
                            <BedDouble className="w-6 h-6 mb-1 text-green-600" />
                            <span className="text-2xl font-bold">{availableRooms}</span>
                            <span className="text-xs text-muted-foreground">Available</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Badge variant="destructive">Waiting</Badge>
                        <p className="text-xs text-muted-foreground">
                            Waiting list position cannot be determined right now.
                        </p>
                    </div>

                </div>
            </div>
            {rankingInfo?.scoreBreakdown && (
                <>
                    <Separator />
                    <div className="p-6">
                        <h4 className="font-semibold text-md mb-4">Your Score Breakdown</h4>
                        <p className="text-xs text-muted-foreground mb-4">This is your individual score. Your rank depends on other applicants' scores.</p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-muted-foreground"><Wallet /> Income</span>
                                <span className="font-bold">{rankingInfo.scoreBreakdown.income} pts</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-muted-foreground"><User /> Category</span>
                                <span className="font-bold">{rankingInfo.scoreBreakdown.category} pts</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-muted-foreground"><Milestone /> Distance</span>
                                <span className="font-bold">{rankingInfo.scoreBreakdown.distance} pts</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-muted-foreground"><GraduationCap /> Academics</span>
                                <span className="font-bold">{rankingInfo.scoreBreakdown.academics} pts</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <CardFooter className="bg-muted/50 p-4">
                <Button asChild className="w-full">
                    <Link href={`/hostels/${hostel.id}`}>View Hostel Details</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

// Wrapper component to handle data fetching for items
function WaitingListCardWrapper({ wishlistItem, userProfile }: { wishlistItem: Wishlist, userProfile: UserProfile | null }) {
    const { data: hostel, isLoading: isHostelLoading } = useHostel(wishlistItem.hostelId);

    return <WaitingListCardContent wishlistItem={wishlistItem} userProfile={userProfile} hostel={hostel} isHostelLoading={isHostelLoading} />;
}


export default function WaitingListPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    const { data: wishlistItems, isLoading: isWishlistLoading } = useWishlist();
    const { data: userProfile, isLoading: isProfileLoading } = useProfile();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    if (isUserLoading || isWishlistLoading || isProfileLoading) {
        return <p>Loading your waiting list...</p>;
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>My Waiting List</CardTitle>
                <CardDescription>Review your score for wishlisted hostels. Your rank cannot be calculated at this time.</CardDescription>
            </CardHeader>
            <CardContent>
                {wishlistItems && wishlistItems.length > 0 && user ? (
                    <div className="space-y-6">
                        {wishlistItems.map((item) => (
                            <WaitingListCardWrapper key={item.id} wishlistItem={item} userProfile={userProfile} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-16">
                        <Clock className="w-16 h-16 text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold">Your Waiting List is Empty</h2>
                        <p className="text-muted-foreground mt-2">
                            Add hostels to your wishlist to see your position for a room.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}