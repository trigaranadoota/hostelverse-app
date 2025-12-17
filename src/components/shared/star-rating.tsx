"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  fillColor?: string;
  emptyColor?: string;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

export function StarRating({
  rating,
  totalStars = 5,
  size = 20,
  fillColor = "text-yellow-400",
  emptyColor = "text-gray-300",
  onRatingChange,
  readOnly = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleMouseOver = (starIndex: number) => {
    if (readOnly) return;
    setHoverRating(starIndex);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (starIndex: number) => {
    if (readOnly) return;
    const newRating = starIndex + 1;
    setCurrentRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const displayedRating = hoverRating > 0 ? hoverRating : currentRating;

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            "transition-colors",
            i < displayedRating ? fillColor : emptyColor,
            !readOnly && "cursor-pointer"
          )}
          onMouseOver={() => handleMouseOver(i + 1)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          fill="currentColor"
        />
      ))}
    </div>
  );
}
