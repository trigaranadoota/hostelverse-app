"use client";

import { Hostel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Room } from "@/lib/types";
import { Bed, Ban, CheckCircle, HelpCircle } from "lucide-react";
import { format } from "date-fns";

interface RoomBookingSystemProps {
  hostel: Hostel;
}

const statusConfig = {
  available: {
    bgColor: "bg-room-available/20 hover:bg-room-available/40",
    borderColor: "border-room-available",
    textColor: "text-room-available",
    icon: <CheckCircle />,
    label: "Available",
  },
  occupied: {
    bgColor: "bg-room-occupied/20",
    borderColor: "border-room-occupied",
    textColor: "text-room-occupied",
    icon: <HelpCircle />,
    label: "Occupied",
  },
  maintenance: {
    bgColor: "bg-room-maintenance/20",
    borderColor: "border-room-maintenance",
    textColor: "text-room-maintenance",
    icon: <Ban />,
    label: "Maintenance",
  },
};

export function RoomBookingSystem({ hostel }: RoomBookingSystemProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRoomClick = (room: Room) => {
    if (room.status === "available") {
      setSelectedRoom(room);
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Book a Room</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm">
                {Object.entries(statusConfig).map(([status, config]) => (
                    <div key={status} className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded-full", config.bgColor.split(' ')[0])}></div>
                        <span className={config.textColor}>{config.label}</span>
                    </div>
                ))}
            </div>

            {hostel.floors.map((floor) => (
              <div key={floor.level}>
                <h3 className="text-lg font-semibold mb-3">
                  Floor {floor.level}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {floor.rooms.map((room) => {
                    const config = statusConfig[room.status];
                    return (
                      <button
                        key={room.id}
                        onClick={() => handleRoomClick(room)}
                        disabled={room.status !== "available"}
                        className={cn(
                          "p-3 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-200",
                          config.bgColor,
                          config.borderColor,
                          room.status === "available" &&
                            "cursor-pointer transform hover:scale-105"
                        )}
                        aria-label={`Room ${room.name}, Status: ${config.label}`}
                      >
                        <Bed className={cn("w-6 h-6", config.textColor)} />
                        <span className={cn("font-medium", config.textColor)}>
                          {room.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              You are about to book{" "}
              <span className="font-semibold">{selectedRoom?.name}</span> at{" "}
              <span className="font-semibold">{hostel.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p>
              <span className="font-semibold">Rent:</span> ₹{hostel.feeStructure.rent.toLocaleString()}/month
            </p>
            <p>
              <span className="font-semibold">Deposit:</span> ₹{hostel.feeStructure.deposit.toLocaleString()} (one-time)
            </p>
            <p>
              <span className="font-semibold">Registration Fee:</span> ₹{hostel.feeStructure.registration.fee.toLocaleString()} (one-time)
            </p>
            <p className="text-sm text-muted-foreground pt-2">
              Registration Deadline: {format(new Date(hostel.feeStructure.registration.deadline), "MMMM dd, yyyy")}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Proceed to Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
