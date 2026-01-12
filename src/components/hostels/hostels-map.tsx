
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";

import { Hostel } from '@/lib/types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface HostelsMapProps {
  hostels: Hostel[];
}

const defaultCenter: [number, number] = [28.6139, 77.2090];

export function HostelsMap({ hostels }: HostelsMapProps) {
    const mapCenter = hostels.length > 0 ? [hostels[0].location.lat, hostels[0].location.lng] as [number, number] : defaultCenter;

    return (
        <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
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
