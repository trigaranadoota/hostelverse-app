
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
import { Bed, Ban, CheckCircle, HelpCircle, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";

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
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRoomClick = (room: Room) => {
    if (room.status === "available") {
      setSelectedRoom(room);
      setIsConfirmDialogOpen(true);
    }
  };

  const handleProceedToPayment = () => {
    setIsConfirmDialogOpen(false);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process the payment here.
    // For now, we'll just simulate a successful payment.
    toast({
      title: "Payment Successful!",
      description: `Your booking for ${selectedRoom?.name} at ${hostel.name} is confirmed.`,
    });
    setIsPaymentDialogOpen(false);
  };
  
  const totalAmount = hostel.feeStructure.registration.fee;


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

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
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
              <span className="font-semibold">Registration Fee:</span> ₹{hostel.feeStructure.registration.fee.toLocaleString()} (one-time)
            </p>
             <p className="font-bold border-t pt-2 mt-2">
              <span className="font-semibold">Total Payable Now:</span> ₹{totalAmount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground pt-2">
              Registration Deadline: {format(new Date(hostel.feeStructure.registration.deadline), "MMMM dd, yyyy")}
            </p>
             <p className="text-sm text-muted-foreground pt-2">
              Monthly rent and security deposit will be collected at the hostel.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProceedToPayment}>Proceed to Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Your Payment</DialogTitle>
              <DialogDescription>
                Enter your card details to confirm your booking for <span className="font-semibold">{selectedRoom?.name}</span>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePaymentSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                        <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiry-date">Expiry Date</Label>
                        <Input id="expiry-date" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                    </div>
                </div>
                 <div className="font-bold text-lg">
                    Total Amount: ₹{totalAmount.toLocaleString()}
                </div>
                 <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Pay Now</Button>
                </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </>
  );
}

    
