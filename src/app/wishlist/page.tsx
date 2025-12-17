import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center py-16">
          <Heart className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mt-2">
            Start exploring and add hostels to your wishlist.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
