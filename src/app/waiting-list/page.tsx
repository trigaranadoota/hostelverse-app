
'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, doc } from "firebase/firestore";
import type { Hostel, Wishlist } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy, Star, BedDouble } from "lucide-react";
import { useDoc } from "@/firebase/firestore/use-doc";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateWaitlistPriority, WaitlistPriorityOutput } from "@/ai/flows/calculate-waitlist-priority";

function WaitingListCard({ wishlistItem, user }: { wishlistItem: Wishlist, user: any }) {
    const firestore = useFirestore();
    const [availableRooms, setAvailableRooms] = useState<number>(0);
    const [rankingInfo, setRankingInfo] = useState<{rank: number, score: number} | null>(null);
    const [totalWaiters, setTotalWaiters] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const hostelRef = useMemoFirebase(() => doc(firestore, 'hostels', wishlistItem.hostelId), [firestore, wishlistItem.hostelId]);
    const { data: hostel, isLoading: isHostelLoading } = useDoc<Hostel>(hostelRef);

    useEffect(() => {
        if (!hostel) return;

        const getRanking = async () => {
            setIsLoading(true);
            try {
                const result = await calculateWaitlistPriority({ hostelId: hostel.id });
                const userRank = result.rankedUsers.find(rankedUser => rankedUser.userId === user.uid);
                if (userRank) {
                    setRankingInfo({ rank: userRank.rank, score: userRank.score });
                }
                setTotalWaiters(result.rankedUsers.length);
            } catch (error) {
                console.error("Failed to calculate waitlist priority:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const countAvailableRooms = () => {
            const count = hostel.floors.reduce((acc, floor) => {
                return acc + floor.rooms.filter(room => room.status === 'available').length;
            }, 0);
            setAvailableRooms(count);
        };

        getRanking();
        countAvailableRooms();

    }, [hostel, user.uid]);

    if (isHostelLoading || isLoading) {
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
    
    if(!hostel) return null;

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
                        {rankingInfo && rankingInfo.rank > availableRooms ? (
                            <Badge variant="destructive">Waiting</Badge>
                        ) : rankingInfo ? (
                            <Badge className="bg-green-600 hover:bg-green-700">Room Available!</Badge>
                        ) : (
                            <Badge variant="secondary">Processing...</Badge>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {totalWaiters ?? '...'} people on the waiting list.
                        </p>
                    </div>

                </div>
            </div>
             <div className="p-6 pt-0 border-t mt-6">
                <Button asChild className="w-full mt-6">
                    <Link href={`/hostels/${hostel.id}`}>View Hostel & Book</Link>
                </Button>
            </div>
        </Card>
    );
}


export default function WaitingListPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const wishlistCollectionRef = useMemoFirebase(
        () => (user ? collection(firestore, `users/${user.uid}/wishlist`) : null),
        [firestore, user]
    );

    const { data: wishlistItems, isLoading: isWishlistLoading } = useCollection<Wishlist>(wishlistCollectionRef);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    if (isUserLoading || isWishlistLoading) {
        return <p>Loading your waiting list...</p>;
    }
    
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>My Waiting List</CardTitle>
            </CardHeader>
            <CardContent>
                {wishlistItems && wishlistItems.length > 0 && user ? (
                    <div className="space-y-6">
                        {wishlistItems.map((item) => (
                            <WaitingListCard key={item.id} wishlistItem={item} user={user} />
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
