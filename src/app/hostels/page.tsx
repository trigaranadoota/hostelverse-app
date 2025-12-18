
'use client';

import { useState, useMemo } from 'react';
import { HostelCard } from '@/components/hostels/hostel-card';
import { FilterDropdown } from '@/components/hostels/filter-dropdown';
import { hostels } from '@/lib/data';
import type { Hostel } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, List, MapPin } from 'lucide-react';
import { HostelsMap } from '@/components/hostels/hostels-map';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Filters = {
  gender: string;
  roomSharing: string;
  amenities: string[];
};

type ViewMode = 'list' | 'map';

export default function HostelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    gender: 'any',
    roomSharing: 'any',
    amenities: [],
  });
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const filteredHostels = useMemo(() => {
    return hostels.filter((hostel) => {
      const matchesSearch =
        searchTerm === '' ||
        hostel.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender =
        filters.gender === 'any' || hostel.gender === filters.gender;

      const matchesRoomSharing =
        filters.roomSharing === 'any' ||
        hostel.roomSharing === filters.roomSharing;

      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((amenityId) =>
          hostel.amenities.some((hostelAmenity) => hostelAmenity.id === amenityId)
        );

      return (
        matchesSearch &&
        matchesGender &&
        matchesRoomSharing &&
        matchesAmenities
      );
    });
  }, [searchTerm, filters]);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.24))]">
       <div className="flex-shrink-0 p-4 border-b bg-background">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for hostels..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
                <FilterDropdown filters={filters} setFilters={setFilters} />
                <div className="bg-muted rounded-md p-1 flex">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>
                        <List className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">List</span>
                    </Button>
                    <Button variant={viewMode === 'map' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('map')}>
                        <MapPin className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Map</span>
                    </Button>
                </div>
            </div>
          </div>
       </div>

       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          <ScrollArea className={cn("h-full", viewMode === 'map' && 'hidden md:block')}>
              <div className="p-4 md:p-6">
                {filteredHostels.length > 0 ? (
                  <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                    {filteredHostels.map((hostel) => (
                      <HostelCard key={hostel.id} hostel={hostel} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold">No Hostels Found</h2>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
          </ScrollArea>
          
          <div className={cn("h-full md:border-l", viewMode === 'list' && 'hidden md:block')}>
            <HostelsMap hostels={filteredHostels} />
          </div>
       </div>
    </div>
  );
}

