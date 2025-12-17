"use client";

import * as LucideIcons from "lucide-react";
import { createElement } from "react";

type IconName = keyof typeof LucideIcons;

interface AmenityIconProps extends React.HTMLAttributes<SVGSVGElement> {
  iconName: string;
}

export function AmenityIcon({ iconName, ...props }: AmenityIconProps) {
  const IconComponent = LucideIcons[iconName as IconName];

  if (!IconComponent) {
    // Return a default icon or null if the icon name is invalid
    return <LucideIcons.HelpCircle {...props} />;
  }

  return createElement(IconComponent, props);
}
