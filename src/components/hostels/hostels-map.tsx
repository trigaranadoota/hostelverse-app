
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";

import { Hostel } from '@/lib/types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

interface HostelsMapProps {
  hostels: Hostel[];
}

function MapContent({ hostels }: HostelsMapProps) {
    const map = useMap();

    useEffect(() => {
        if (hostels.length > 0) {
            const bounds = hostels.map(h => [h.location.lat, h.location.lng] as [number, number]);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
             map.setView([20.5937, 78.9629], 5);
        }
    }, [hostels, map]);


    return (
        <>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {hostels.map((hostel) => (
                <Marker key={hostel.id} position={[hostel.location.lat, hostel.location.lng]}>
                    <Popup>
                        <div className="w-48">
                            <h3 className="font-bold font-headline">{hostel.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{hostel.address}</p>
                            <Button asChild size="sm" className="w-full">
                                <Link href={`/hostels/${hostel.id}`}>View Details</Link>
                            </Button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}


export default function HostelsMap({ hostels }: HostelsMapProps) {
  const [isClient, setIsClient] = useState(false);
  const mapCenter = useMemo((): LatLngExpression => {
    if (hostels.length > 0) {
      return [hostels[0].location.lat, hostels[0].location.lng];
    }
    return [20.5937, 78.9629]; // Default center of India
  }, [hostels]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <MapContainer
      key="hostels-map-container" // Adding a key to help React with reconciliation
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
      center={mapCenter}
      zoom={hostels.length > 0 ? 12 : 5}
    >
      <MapContent hostels={hostels} />
    </MapContainer>
  );
}
