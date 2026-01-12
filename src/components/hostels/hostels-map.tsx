
'use client';

import { Hostel } from '@/lib/types';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';

interface HostelsMapProps {
  hostels: Hostel[];
  apiKey: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

// A default center, you might want to make this dynamic based on user location or hostels
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
};

export function HostelsMap({ hostels, apiKey }: HostelsMapProps) {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const handleMarkerClick = (hostelId: string) => {
    setActiveMarker(hostelId);
  };
  
  const mapCenter = hostels.length > 0 ? hostels[0].location : defaultCenter;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
      >
        {hostels.map((hostel) => (
          <MarkerF
            key={hostel.id}
            position={hostel.location}
            onClick={() => handleMarkerClick(hostel.id)}
          >
            {activeMarker === hostel.id && (
              <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                <div className="w-64 space-y-2">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md">
                         <Image
                            src={hostel.images[0].url}
                            alt={hostel.images[0].alt}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h4 className="font-bold text-base">{hostel.name}</h4>
                    <p className="text-sm text-muted-foreground">{hostel.address}</p>
                    <Button asChild size="sm" className="w-full">
                        <Link href={`/hostels/${hostel.id}`}>View Details</Link>
                    </Button>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
