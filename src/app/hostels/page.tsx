
'use client';

import { useState, useMemo } from 'react';
import { HostelCard } from '@/components/hostels/hostel-card';
import { FilterDropdown } from '@/components/hostels/filter-dropdown';
import type { Hostel } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, Ghost, List, Map } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useHostels, useSupabase } from '@/supabase';
import { sampleHostels } from '@/lib/seed-data';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

type Filters = {
  gender: string;
  roomSharing: string;
  amenities: string[];
};

type ViewMode = 'list' | 'map';

const HostelsMap = dynamic(() => import('@/components/hostels/hostels-map'), { ssr: false });


export default function HostelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    gender: 'any',
    roomSharing: 'any',
    amenities: [],
  });

  const supabase = useSupabase();
  const { data: hostels, isLoading: areHostelsLoading, refetch } = useHostels();

  const filteredHostels = useMemo(() => {
    if (!hostels) return [];
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
  }, [searchTerm, filters, hostels]);

  const handleSeedData = async () => {
    setIsSeeding(true);

    try {
      // Insert hostels
      for (const hostel of sampleHostels) {
        // Insert hostel
        const { data: insertedHostel, error: hostelError } = await supabase
          .from('hostels')
          .insert({
            id: hostel.id,
            name: hostel.name,
            address: hostel.address,
            contact: hostel.contact,
            location_lat: hostel.location.lat,
            location_lng: hostel.location.lng,
            rent: hostel.feeStructure.rent,
            deposit: hostel.feeStructure.deposit,
            fee_includes: hostel.feeStructure.includes,
            registration_fee: hostel.feeStructure.registration.fee,
            registration_deadline: hostel.feeStructure.registration.deadline,
            verification_ai: hostel.verification.ai,
            verification_human: hostel.verification.human,
            gender: hostel.gender,
            room_sharing: hostel.roomSharing,
          } as never)
          .select()
          .single();

        if (hostelError) {
          console.error('Error inserting hostel:', hostelError);
          continue;
        }

        // Insert images
        if (hostel.images.length > 0) {
          await supabase.from('hostel_images').insert(
            hostel.images.map((img, idx) => ({
              hostel_id: hostel.id,
              url: img.url,
              alt: img.alt,
              hint: img.hint,
              display_order: idx,
            })) as never
          );
        }

        // Insert amenities
        if (hostel.amenities.length > 0) {
          await supabase.from('hostel_amenities').insert(
            hostel.amenities.map((a) => ({
              hostel_id: hostel.id,
              name: a.name,
              icon: a.icon,
            })) as never
          );
        }

        // Insert floors and rooms
        for (const floor of hostel.floors) {
          const { data: insertedFloor } = await supabase
            .from('hostel_floors')
            .insert({
              hostel_id: hostel.id,
              level: floor.level,
            } as never)
            .select()
            .single();

          if (insertedFloor && floor.rooms.length > 0) {
            await supabase.from('hostel_rooms').insert(
              floor.rooms.map((room) => ({
                floor_id: (insertedFloor as { id: string }).id,
                name: room.name,
                status: room.status,
              })) as never
            );
          }
        }
      }

      toast({
        title: "Success!",
        description: "Sample hostels have been added to your database.",
      });
      refetch();
    } catch (error) {
      console.error("Error seeding data:", error);
      toast({
        variant: "destructive",
        title: "Error Seeding Data",
        description: "Could not add sample hostels. Check the console for details.",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.24))]">
      <div className="flex-shrink-0 p-4 border-b bg-background z-10">
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
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="List View"
              >
                <List className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('map')}
                aria-label="Map View"
              >
                <Map className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className={cn("absolute inset-0 transition-opacity", viewMode === 'list' ? 'opacity-100 visible' : 'opacity-0 invisible')}>
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6">
              {areHostelsLoading && <p>Loading hostels...</p>}
              {!areHostelsLoading && filteredHostels.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredHostels.map((hostel) => (
                    <HostelCard key={hostel.id} hostel={hostel} />
                  ))}
                </div>
              ) : !areHostelsLoading ? (
                <div className="text-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <Ghost className="h-12 w-12 text-muted-foreground" />
                    <h2 className="text-2xl font-semibold">No Hostels Found</h2>
                    <p className="text-muted-foreground mt-2 max-w-md">Your database is empty. Add hostels to your Supabase 'hostels' table to see them here.</p>
                    <Button onClick={handleSeedData} disabled={isSeeding}>
                      {isSeeding ? 'Seeding...' : 'Seed Sample Hostels'}
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>
        <div className={cn("absolute inset-0 transition-opacity", viewMode === 'map' ? 'opacity-100 visible' : 'opacity-0 invisible')}>
          <HostelsMap hostels={filteredHostels} />
        </div>
      </div>
    </div>
  );
}
