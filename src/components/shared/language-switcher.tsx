
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";

export function LanguageSwitcher() {
  const [isClient, setIsClient] = useState(false);
  const { language, setLanguage, t } = useTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Skeleton className="w-24 h-9" />;
  }

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-auto h-9 gap-2">
        <Globe className="w-4 h-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="de">Deutsch</SelectItem>
        <SelectItem value="hi">हिन्दी</SelectItem>
      </SelectContent>
    </Select>
  );
}
