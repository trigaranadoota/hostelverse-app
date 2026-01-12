
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Hostel } from '@/lib/types';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';

interface HostelsMapProps {
    hostels: Hostel[];
}

// Component to automatically fit the map to the markers
const MapBoundsUpdater = ({ hostels }: { hostels: Hostel[] }) => {
    const map = useMap();
    useEffect(() => {
        if (hostels.length > 0) {
            const bounds = new L.LatLngBounds(hostels.map(h => [h.location.lat, h.location.lng]));
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [hostels, map]);
    return null;
};


export default function HostelsMap({ hostels }: HostelsMapProps) {

    const mapCenter = useMemo<[number, number]>(() => {
        if (hostels && hostels.length > 0) {
            // Default to India's center if no hostels
            return [hostels[0].location.lat, hostels[0].location.lng];
        }
        return [20.5937, 78.9629];
    }, [hostels]);

    return (
        <MapContainer center={mapCenter} zoom={hostels.length > 0 ? 12 : 5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {hostels.map(hostel => (
                <Marker key={hostel.id} position={[hostel.location.lat, hostel.location.lng]}>
                    <Popup>
                        <div className="font-sans">
                            <h3 className="font-bold text-base m-0 mb-1">{hostel.name}</h3>
                            <p className="text-xs text-muted-foreground m-0 mb-2">{hostel.address}</p>
                            <Link href={`/hostels/${hostel.id}`} className="text-primary text-sm font-semibold">
                                View Details
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
            <MapBoundsUpdater hostels={hostels} />
        </MapContainer>
    );
}
