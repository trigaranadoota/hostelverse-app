
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import type { Hostel } from '@/lib/types';
import Link from 'next/link';
import { renderToString } from 'react-dom/server';

interface HostelsMapProps {
    hostels: Hostel[];
}

export default function HostelsMap({ hostels }: HostelsMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    const mapCenter = useMemo<[number, number]>(() => {
        if (hostels && hostels.length > 0) {
            return [hostels[0].location.lat, hostels[0].location.lng];
        }
        return [20.5937, 78.9629]; // Default to India's center
    }, [hostels]);

    // Initialize map
    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            const map = L.map(mapRef.current).setView(mapCenter, 5);
            mapInstance.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }

        // Cleanup on unmount
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [mapCenter]); // Only run once on mount

    // Update markers and bounds when hostels change
    useEffect(() => {
        const map = mapInstance.current;
        if (!map) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        if (hostels.length > 0) {
            // Add new markers
            const newMarkers = hostels.map(hostel => {
                const popupContent = renderToString(
                    <div className="font-sans">
                        <h3 className="font-bold text-base m-0 mb-1">{hostel.name}</h3>
                        <p className="text-xs text-muted-foreground m-0 mb-2">{hostel.address}</p>
                        <Link href={`/hostels/${hostel.id}`} className="text-primary text-sm font-semibold">
                            View Details
                        </Link>
                    </div>
                );

                const marker = L.marker([hostel.location.lat, hostel.location.lng])
                    .addTo(map)
                    .bindPopup(popupContent);
                return marker;
            });
            markersRef.current = newMarkers;

            // Fit map to bounds
            const bounds = new L.LatLngBounds(hostels.map(h => [h.location.lat, h.location.lng]));
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        } else {
             // Reset view if no hostels
             map.setView(mapCenter, 5);
        }

    }, [hostels, mapCenter]);


    return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}
