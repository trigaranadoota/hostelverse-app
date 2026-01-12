
'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { Hostel } from '@/lib/types';

// Dynamically import the map component with SSR disabled
const Map = dynamic(() => import('./hostels-map').then((mod) => mod.HostelsMap), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-muted"><p>Loading map...</p></div>,
});

export function DynamicHostelsMap({ hostels }: { hostels: Hostel[] }) {
  // useMemo helps prevent re-creating the component unless hostels change
  const memoizedMap = useMemo(() => <Map hostels={hostels} />, [hostels]);

  return memoizedMap;
}
