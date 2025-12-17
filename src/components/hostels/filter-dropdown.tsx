
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { HostelFilters } from './hostel-filters';
import { amenities } from '@/lib/data';

type Filters = {
    gender: string;
    roomSharing: string;
    amenities: string[];
};

interface FilterDropdownProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function FilterDropdown({ filters, setFilters }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="shrink-0">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
         <HostelFilters filters={filters} setFilters={setFilters} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
