
'use client';

import { useState, useMemo } from 'react';
import { HostelCard } from '@/components/hostels/hostel-card';
import { FilterDropdown } from '@/components/hostels/filter-dropdown';
import { hostels, amenities } from '@/lib/data';
import type { Hostel } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type Filters = {
  gender: string;
  roomSharing: string;
  amenities: string[];
};

export default function HostelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    gender: 'any',
    roomSharing: 'any',
    amenities: [],
  });

  const filteredHostels = useMemo(() => {
    return hostels.filter((hostel) => {
      // Search term filter
      const matchesSearch =
        searchTerm === '' ||
        hostel.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Gender filter
      const matchesGender =
        filters.gender === 'any' || hostel.gender === filters.gender;

      // Room sharing filter
      const matchesRoomSharing =
        filters.roomSharing === 'any' ||
        hostel.roomSharing === filters.roomSharing;

      // Amenities filter
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
    <div className="space-y-6">
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
        <FilterDropdown filters={filters} setFilters={setFilters} />
      </div>
      {filteredHostels.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  );
}
