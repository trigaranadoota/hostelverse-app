
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useUser, useWishlist, useHostel } from "@/supabase";
import { HostelCard } from "@/components/hostels/hostel-card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function WishlistedHostelCard({ hostelId }: { hostelId: string }) {
  const { data: hostel, isLoading } = useHostel(hostelId);

  if (isLoading) {
    return <div className="animate-pulse bg-muted rounded-lg h-64"></div>;
  }

  if (!hostel) {
    return null;
  }

  return <HostelCard hostel={hostel} />;
}

export default function WishlistPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const { data: wishlistItems, isLoading: isWishlistLoading } = useWishlist();

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
