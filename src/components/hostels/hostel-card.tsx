import { Hostel } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import { useUser } from "@/supabase";

interface HostelCardProps {
  hostel: Hostel;
}

export function HostelCard({ hostel }: HostelCardProps) {
  const isVerified = hostel.verification.ai && hostel.verification.human;
  const { user } = useUser();

  const detailsLink = user ? `/hostels/${hostel.id}` : "/login";

  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
      <Link href={detailsLink} className="block">
        <div className="relative">
          <Image
            src={hostel.images[0].url}
            alt={hostel.images[0].alt}
            data-ai-hint={hostel.images[0].hint}
            width={400}
            height={250}
            className="object-cover w-full aspect-[4/3]"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {hostel.verification.ai && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-3 bg-blue-100 text-blue-800">
                <ShieldCheck className="h-4 w-4" />
                AI Verified
              </Badge>
            )}
            {hostel.verification.human && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-3 bg-green-100 text-green-800">
                <ShieldCheck className="h-4 w-4" />
                Human Verified
              </Badge>
            )}
          </div>
        </div>
        <CardHeader>
          <CardTitle className="font-headline tracking-tight">{hostel.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{hostel.address}</p>
        </CardContent>
      </Link>
      <div className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={detailsLink}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}
