
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, doc } from "firebase/firestore";
import { Wishlist, Hostel } from "@/lib/types";
import { HostelCard } from "@/components/hostels/hostel-card";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDoc } from "@/firebase/firestore/use-doc";

function WishlistedHostelCard({ hostelId }: { hostelId: string }) {
  const firestore = useFirestore();
  const hostelRef = useMemoFirebase(() => doc(firestore, 'hostels', hostelId), [firestore, hostelId]);
  const { data: hostel, isLoading } = useDoc<Hostel>(hostelRef);

  if (isLoading) {
    return <div>Loading hostel...</div>; // Or a skeleton loader
  }

  if (!hostel) {
    return null; // Or some fallback UI
  }

  return <HostelCard hostel={hostel} />;
}

export default function WishlistPage() {
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
    return <p>Loading wishlist...</p>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        {wishlistItems && wishlistItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <WishlistedHostelCard key={item.id} hostelId={item.hostelId} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground mt-2">
              Start exploring and add hostels to your wishlist.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
