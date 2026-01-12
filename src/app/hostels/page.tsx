
'use client';

import { useState, useMemo } from 'react';
import { HostelCard } from '@/components/hostels/hostel-card';
import { FilterDropdown } from '@/components/hostels/filter-dropdown';
import type { Hostel } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, List, Map } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HostelsMap } from '@/components/hostels/hostels-map';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Ghost } from 'lucide-react';
import { sampleHostels } from '@/lib/seed-data';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

type Filters = {
  gender: string;
  roomSharing: string;
  amenities: string[];
};

type ViewMode = 'list' | 'map';

const DynamicHostelsMap = dynamic(
  () => import('@/components/hostels/hostels-map').then((mod) => mod.HostelsMap),
  { ssr: false, loading: () => <p>Loading map...</p> }
);


export default function HostelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    gender: 'any',
    roomSharing: 'any',
    amenities: [],
  });

  const firestore = useFirestore();
  const hostelsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'hostels') : null, [firestore]);
  const { data: hostels, isLoading: areHostelsLoading } = useCollection<Hostel>(hostelsCollectionRef);

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
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore is not initialized.",
      });
      return;
    }
    setIsSeeding(true);

    try {
      const batch = writeBatch(firestore);
      sampleHostels.forEach(hostel => {
        const hostelRef = doc(firestore, 'hostels', hostel.id);
        batch.set(hostelRef, hostel);
      });
      await batch.commit();
      toast({
        title: "Success!",
        description: "Sample hostels have been added to your database.",
      });
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
                <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="h-8 px-3"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('map')}
                        className="h-8 px-3"
                    >
                        <Map className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          </div>
       </div>

        <div className="flex-1 relative">
            <ScrollArea className={cn("h-full", viewMode !== 'list' && 'hidden')}>
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
                        <p className="text-muted-foreground mt-2 max-w-md">Your database is empty. Add hostels to your Firestore 'hostels' collection to see them here.</p>
                         <Button onClick={handleSeedData} disabled={isSeeding}>
                           {isSeeding ? 'Seeding...' : 'Seed Sample Hostels'}
                        </Button>
                      </div>
                    </div>
                ) : null}
                </div>
            </ScrollArea>

            {viewMode === 'map' && (
                <div className="h-full w-full">
                    <DynamicHostelsMap hostels={filteredHostels} />
                </div>
            )}
        </div>
    </div>
  );
}
