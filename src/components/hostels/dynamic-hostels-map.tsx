
'use client';

import dynamic from 'next/dynamic';
import type { Hostel } from '@/lib/types';

// Dynamically import the map component with SSR disabled.
// This is the key to preventing the "Map container is already initialized" error.
const MapWithNoSSR = dynamic(() => import('./hostels-map').then((mod) => mod.HostelsMap), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-muted"><p>Loading map...</p></div>,
});

export function DynamicHostelsMap({ hostels }: { hostels: Hostel[] }) {
  // Directly render the dynamically imported component, passing the props down.
  // This avoids re-creating the component instance with useMemo, which was causing the issue.
  return <MapWithNoSSR hostels={hostels} />;
}
