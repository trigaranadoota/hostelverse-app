
'use client';
import { useState } from 'react';
import type { Hostel } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface HostelsMapProps {
  hostels: Hostel[];
}

// A function to normalize coordinates to a 0-1 range based on some bounds
// For this fake map, we'll just hardcode some rough bounds for demo purposes
const normalizeCoords = (coord: { lat: number, lng: number }) => {
    const latMin = 34;
    const latMax = 41;
    const lngMin = -118.5;
    const lngMax = -73;

    const x = (coord.lng - lngMin) / (lngMax - lngMin);
    const y = (coord.lat - latMax) / (latMin - latMax);

    return { x: Math.max(0, Math.min(1, x)) * 100, y: Math.max(0, Math.min(1, y)) * 100 };
}


export function HostelsMap({ hostels }: HostelsMapProps) {
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-background');

  return (
    <div className="relative w-full h-full bg-muted">
       <Image 
        src={mapImage?.imageUrl || "https://picsum.photos/seed/map/1200/800"}
        alt="Fake map background"
        fill
        className="object-cover"
        data-ai-hint="map background"
      />
      <div className="absolute inset-0">
        {hostels.map(hostel => {
            const position = normalizeCoords(hostel.location);
            return (
                <button
                    key={hostel.id}
                    className="absolute -translate-x-1/2 -translate-y-full"
                    style={{ left: `${position.x}%`, top: `${position.y}%`}}
                    onClick={() => setSelectedHostel(hostel)}
                    aria-label={`Show details for ${hostel.name}`}
                >
                    <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" fill="currentColor" />
                </button>
            )
        })}

        {selectedHostel && (
             <div 
                className="absolute p-2"
                style={{
                    left: `${normalizeCoords(selectedHostel.location).x}%`, 
                    top: `${normalizeCoords(selectedHostel.location).y}%`,
                    transform: 'translate(-50%, -100%)'
                }}
             >
                <Card className="border-none shadow-lg max-w-xs relative -translate-y-4">
                     <Image
                        src={selectedHostel.images[0].url}
                        alt={selectedHostel.images[0].alt}
                        width={250}
                        height={150}
                        className="object-cover w-full aspect-video rounded-t-lg"
                     />
                    <CardHeader className="p-3">
                        <CardTitle className="text-base font-headline tracking-tight">{selectedHostel.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <p className="text-xs text-muted-foreground">{selectedHostel.address}</p>
                        <Button asChild className="w-full mt-3" size="sm">
                            <Link href={`/hostels/${selectedHostel.id}`}>View Details</Link>
                        </Button>
                    </CardContent>
                     <button onClick={() => setSelectedHostel(null)} className="absolute top-1 right-1 bg-background/50 rounded-full p-0.5">
                        <X className="w-4 h-4" />
                     </button>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
}
