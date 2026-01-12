
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";

import { Hostel } from '@/lib/types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import type { LatLngExpression } from 'leaflet';

interface HostelsMapProps {
  hostels: Hostel[];
}

const defaultCenter: [number, number] = [28.6139, 77.2090];

// This component will update the map view when the hostels list changes.
function MapUpdater({ hostels }: { hostels: Hostel[] }) {
    const map = useMap();
    useEffect(() => {
        if (hostels.length > 0) {
            const newCenter: LatLngExpression = [hostels[0].location.lat, hostels[0].location.lng];
            map.flyTo(newCenter, 12);
        }
    }, [hostels, map]);
    return null;
}

export function HostelsMap({ hostels }: HostelsMapProps) {
    const mapCenter: LatLngExpression = hostels.length > 0 ? [hostels[0].location.lat, hostels[0].location.lng] : defaultCenter;

    return (
        <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater hostels={hostels} />
            {hostels.map((hostel) => (
                <Marker key={hostel.id} position={[hostel.location.lat, hostel.location.lng]}>
                    <Popup>
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
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
