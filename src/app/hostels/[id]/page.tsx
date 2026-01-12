
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
import { ShieldCheck, ShieldAlert, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AmenitiesDisplay } from "@/components/hostels/amenities-display";
import { RoomBookingSystem } from "@/components/hostels/room-booking-system";
import { ReviewSection } from "@/components/hostels/review-section";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, query, where, doc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useDoc } from "@/firebase/firestore/use-doc";
import type { Wishlist, Hostel } from "@/lib/types";

export default function HostelDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistDocId, setWishlistDocId] = useState<string | null>(null);

  const hostelRef = useMemoFirebase(() => (id ? doc(firestore, 'hostels', id) : null), [firestore, id]);
  const { data: hostel, isLoading: isHostelLoading, error: hostelError } = useDoc<Hostel>(hostelRef);

  const wishlistCollectionRef = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'wishlist') : null),
    [firestore, user]
  );
  
  const userWishlistQuery = useMemoFirebase(
    () => (wishlistCollectionRef && id ? query(wishlistCollectionRef, where('hostelId', '==', id)) : null),
    [wishlistCollectionRef, id]
  );

  const { data: wishlistItems, isLoading: isWishlistLoading } = useCollection<Wishlist>(userWishlistQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (wishlistItems && wishlistItems.length > 0) {
      setIsWishlisted(true);
      setWishlistDocId(wishlistItems[0].id);
    } else {
      setIsWishlisted(false);
      setWishlistDocId(null);
    }
  }, [wishlistItems]);


  if (isHostelLoading || isUserLoading) {
    return <p>Loading hostel details...</p>;
  }
  
  if (!hostel) {
    return <p>Hostel not found.</p>;
  }

  const handleWishlistToggle = async () => {
    if (!user || !wishlistCollectionRef) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to manage your wishlist.",
        });
        return;
    }

    if (isWishlisted && wishlistDocId) {
        // Remove from wishlist
        const docRef = doc(wishlistCollectionRef, wishlistDocId);
        deleteDoc(docRef)
            .then(() => {
                toast({ title: "Removed from wishlist." });
            })
            .catch(e => {
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'delete',
                });
                errorEmitter.emit('permission-error', permissionError);
            });
    } else {
        // Add to wishlist
        const wishlistItem = {
            userId: user.uid,
            hostelId: hostel.id,
            createdAt: serverTimestamp(),
        };
        addDoc(wishlistCollectionRef, wishlistItem)
            .then(() => {
                toast({ title: "Added to wishlist!" });
            })
            .catch(e => {
                const permissionError = new FirestorePermissionError({
                    path: wishlistCollectionRef.path,
                    operation: 'create',
                    requestResourceData: wishlistItem,
                });
                errorEmitter.emit('permission-error', permissionError);
            });
    }
  };


  return (
    <div className="space-y-8">
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
