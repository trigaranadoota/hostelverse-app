"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { amenities } from "@/lib/data";
import { Button } from "../ui/button";

export function HostelFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Refine your search</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select name="gender">
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
          <Select name="room-sharing">
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
                <Checkbox id={`amenity-${amenity.id}`} />
                <Label htmlFor={`amenity-${amenity.id}`} className="font-normal">
                  {amenity.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  );
}
