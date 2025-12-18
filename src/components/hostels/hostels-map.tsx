
'use client';
import { useState, useMemo } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
import type { Hostel } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

interface HostelsMapProps {
  hostels: Hostel[];
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

// A default center, e.g., the center of a major city or country.
const defaultCenter = {
  lat: 34.0522,
  lng: -118.2437
};

export function HostelsMap({ hostels }: HostelsMapProps) {
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapCenter = useMemo(() => {
    if (hostels.length === 0) {
      return defaultCenter;
    }
    const lat = hostels.reduce((sum, hostel) => sum + hostel.location.lat, 0) / hostels.length;
    const lng = hostels.reduce((sum, hostel) => sum + hostel.location.lng, 0) / hostels.length;
    return { lat, lng };
  }, [hostels]);


  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <p className="text-destructive text-center p-4">
          Google Maps API key is missing. Please add it to your .env file.
        </p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={hostels.length > 1 ? 10 : 12}
      >
        {hostels.map(hostel => (
          <MarkerF
            key={hostel.id}
            position={hostel.location}
            onClick={() => setSelectedHostel(hostel)}
          />
        ))}

        {selectedHostel && (
          <InfoWindow
            position={selectedHostel.location}
            onCloseClick={() => setSelectedHostel(null)}
          >
            <Card className="border-none shadow-none max-w-xs">
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
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
