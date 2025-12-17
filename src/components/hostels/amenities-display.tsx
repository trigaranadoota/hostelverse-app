import { Amenity } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AmenityIcon } from "./amenity-icon";

interface AmenitiesDisplayProps {
  amenities: Amenity[];
}

export function AmenitiesDisplay({ amenities }: AmenitiesDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center gap-3">
              <AmenityIcon iconName={amenity.icon} className="w-5 h-5 text-primary" />
              <span className="text-sm">{amenity.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
