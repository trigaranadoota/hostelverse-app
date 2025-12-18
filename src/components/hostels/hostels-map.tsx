
'use client';

import { Hostel } from '@/lib/types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HostelsMapProps {
  hostels: Hostel[];
}

// Simple hash function to get a consistent position for each hostel
const simpleHash = (s: string) => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};


export function HostelsMap({ hostels }: HostelsMapProps) {
    const mapImage = PlaceHolderImages.find(p => p.id === 'map-background');

    return (
        <div className="relative w-full h-full bg-muted overflow-hidden">
            {mapImage && (
                <Image
                    src={mapImage.imageUrl}
                    alt="Map background"
                    fill
                    className="object-cover opacity-30"
                    data-ai-hint="vector map"
                />
            )}
            <div className="absolute inset-0">
                {hostels.map((hostel) => {
                    // Use a simple hash to create pseudo-random but consistent positions
                    const x = Math.abs(simpleHash(hostel.id + 'x')) % 90 + 5; // 5% to 95%
                    const y = Math.abs(simpleHash(hostel.id + 'y')) % 80 + 10; // 10% to 90%

                    return (
                        <Popover key={hostel.id}>
                            <PopoverTrigger asChild>
                                <button
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                                    style={{ left: `${x}%`, top: `${y}%` }}
                                >
                                    <MapPin className="w-8 h-8 text-red-600 fill-red-500 transition-transform duration-200 ease-in-out hover:scale-125" />
                                     <span className="sr-only">{hostel.name}</span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                                <div className="space-y-2">
                                    <h4 className="font-semibold">{hostel.name}</h4>
                                    <p className="text-sm text-muted-foreground">{hostel.address}</p>
                                    <Button asChild size="sm" className="w-full">
                                        <Link href={`/hostels/${hostel.id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    );
                })}
            </div>
             {hostels.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4 bg-background/80 rounded-lg">
                        <h3 className="text-xl font-semibold">No Hostels Found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

