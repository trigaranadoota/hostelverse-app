import { HostelCard } from "@/components/hostels/hostel-card";
import { HostelFilters } from "@/components/hostels/hostel-filters";
import { hostels } from "@/lib/data";

export default function HostelsPage() {
  return (
    <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8 items-start">
      <aside className="sticky top-0">
        <HostelFilters />
      </aside>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {hostels.map((hostel) => (
          <HostelCard key={hostel.id} hostel={hostel} />
        ))}
      </div>
    </div>
  );
}
