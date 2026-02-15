
'use client';
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, Heart, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AmenitiesDisplay } from "@/components/hostels/amenities-display";
import { RoomBookingSystem } from "@/components/hostels/room-booking-system";
import { ReviewSection } from "@/components/hostels/review-section";
import { useUser, useHostel, useWishlist } from "@/supabase";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function HostelDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const { data: hostel, isLoading: isHostelLoading } = useHostel(id);
  const { isInWishlist, addToWishlist, removeFromWishlist, isLoading: isWishlistLoading } = useWishlist();

  const isWishlisted = id ? isInWishlist(id) : false;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);


  if (isHostelLoading || isUserLoading) {
    return <p>Loading hostel details...</p>;
  }

  if (!hostel) {
    return <p>Hostel not found.</p>;
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to manage your wishlist.",
      });
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(hostel.id);
        toast({ title: "Removed from wishlist." });
      } else {
        await addToWishlist(hostel.id);
        toast({ title: "Added to wishlist!" });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not update wishlist.",
      });
    }
  };


  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-2 -ml-2 gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent p-0 h-auto"
        onClick={() => router.push('/hostels')}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Header Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">
              {hostel.name}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              {hostel.address}
            </p>
            <div className="flex items-center gap-2 mt-4">
              {hostel.verification.ai && (
                <Badge className="gap-1.5 pl-2 pr-3 bg-blue-100 text-blue-800 border-blue-200">
                  <ShieldCheck className="h-4 w-4" />
                  AI Verified
                </Badge>
              )}
              {hostel.verification.human && (
                <Badge className="gap-1.5 pl-2 pr-3 bg-green-100 text-green-800 border-green-200">
                  <ShieldCheck className="h-4 w-4" />
                  Human Verified
                </Badge>
              )}
              {!hostel.verification.ai && !hostel.verification.human && (
                <Badge variant="destructive" className="gap-1.5 pl-2 pr-3">
                  <ShieldAlert className="h-4 w-4" />
                  Not Verified
                </Badge>
              )}
            </div>
          </div>
          <Button variant="outline" size="lg" className="shrink-0" onClick={handleWishlistToggle} disabled={isWishlistLoading}>
            <Heart className={isWishlisted ? "mr-2 h-5 w-5 text-red-500 fill-current" : "mr-2 h-5 w-5"} />
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </Button>
        </div>
      </section>

      {/* Image Carousel */}
      <section>
        <Carousel className="w-full">
          <CarouselContent>
            {hostel.images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    data-ai-hint={image.hint}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4" />
          <CarouselNext className="absolute right-4" />
        </Carousel>
      </section>

      {/* Details Grid */}
      <section className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-8">
          <RoomBookingSystem hostel={hostel} />
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="flex justify-between"><span>Monthly Rent:</span> <span className="font-semibold">₹{hostel.feeStructure.rent.toLocaleString()}</span></p>
              <p className="flex justify-between"><span>Security Deposit:</span> <span className="font-semibold">₹{hostel.feeStructure.deposit.toLocaleString()}</span></p>
              <p className="flex justify-between"><span>Registration Fee:</span> <span className="font-semibold">₹{hostel.feeStructure.registration.fee.toLocaleString()}</span></p>
            </CardContent>
          </Card>
          <AmenitiesDisplay amenities={hostel.amenities} />
        </div>
      </section>

      {/* Reviews Section */}
      <section>
        <ReviewSection hostel={hostel} />
      </section>

    </div>
  );
}
