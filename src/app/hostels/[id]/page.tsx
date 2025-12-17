import { hostels } from "@/lib/data";
import { notFound } from "next/navigation";
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

export default function HostelDetailPage({ params }: { params: { id: string } }) {
  const hostel = hostels.find((h) => h.id === params.id);

  if (!hostel) {
    notFound();
  }

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
          <Button variant="outline" size="lg" className="shrink-0">
            <Heart className="mr-2 h-5 w-5" />
            Add to Wishlist
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
                    <p className="text-sm text-muted-foreground pt-2">Includes: {hostel.feeStructure.includes.join(', ')}</p>
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
