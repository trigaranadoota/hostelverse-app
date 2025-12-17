
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { amenities } from '@/lib/data';
import { Button } from '../ui/button';

type Filters = {
    gender: string;
    roomSharing: string;
    amenities: string[];
};

interface HostelFiltersProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function HostelFilters({ filters, setFilters }: HostelFiltersProps) {

  const handleGenderChange = (value: string) => {
    setFilters(prev => ({ ...prev, gender: value }));
  };

  const handleRoomSharingChange = (value: string) => {
    setFilters(prev => ({ ...prev, roomSharing: value }));
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setFilters(prev => {
      const newAmenities = checked
        ? [...prev.amenities, amenityId]
        : prev.amenities.filter(id => id !== amenityId);
      return { ...prev, amenities: newAmenities };
    });
  };

  const clearFilters = () => {
    setFilters({
      gender: 'any',
      roomSharing: 'any',
      amenities: [],
    });
  };


  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select name="gender" value={filters.gender} onValueChange={handleGenderChange}>
          <SelectTrigger id="gender">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="male">Male only</SelectItem>
            <SelectItem value="female">Female only</SelectItem>
            <SelectItem value="mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="room-sharing">Room Sharing</Label>
        <Select name="room-sharing" value={filters.roomSharing} onValueChange={handleRoomSharingChange}>
          <SelectTrigger id="room-sharing">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="double">Double</SelectItem>
            <SelectItem value="multiple">Multiple</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 gap-4">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center gap-2">
              <Checkbox 
                id={`amenity-${amenity.id}`}
                checked={filters.amenities.includes(amenity.id)}
                onCheckedChange={(checked) => handleAmenityChange(amenity.id, !!checked)}
              />
              <Label htmlFor={`amenity-${amenity.id}`} className="font-normal">
                {amenity.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Button variant="outline" onClick={clearFilters} className="w-full">Clear Filters</Button>
    </div>
  );
}
