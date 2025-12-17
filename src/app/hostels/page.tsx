
import { HostelCard } from "@/components/hostels/hostel-card";
import { FilterDropdown } from "@/components/hostels/filter-dropdown";
import { hostels } from "@/lib/data";

export default function HostelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <FilterDropdown />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hostels.map((hostel) => (
          <HostelCard key={hostel.id} hostel={hostel} />
        ))}
      </div>
    </div>
  );
}
