"use client";
import { Review, Hostel } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { StarRating } from "../shared/star-rating";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Utensils, Shield, Sparkles, UserCheck } from "lucide-react";

const reviewSchema = z.object({
  content: z.string().min(10, "Review must be at least 10 characters long."),
  food: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5),
  management: z.number().min(1).max(5),
  safety: z.number().min(1).max(5),
});

const ratingCategories = [
  { id: "food", label: "Food", icon: <Utensils className="h-4 w-4" /> },
  {
    id: "cleanliness",
    label: "Cleanliness",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "management",
    label: "Management",
    icon: <UserCheck className="h-4 w-4" />,
  },
  { id: "safety", label: "Safety", icon: <Shield className="h-4 w-4" /> },
] as const;

function ReviewCard({ review }: { review: Review }) {
  const overallRating =
    Object.values(review.ratings).reduce((acc, rating) => acc + rating, 0) /
    Object.values(review.ratings).length;

  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={review.avatarUrl} alt={review.author} />
        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{review.author}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
          <StarRating rating={overallRating} readOnly size={16} />
        </div>
        <p className="text-sm">{review.content}</p>
        {review.imageUrl && (
          <Image
            src={review.imageUrl}
            alt="Review image"
            width={200}
            height={150}
            className="rounded-lg object-cover"
          />
        )}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm pt-2">
          {ratingCategories.map((category) => (
            <div
              key={category.id}
              className="flex justify-between items-center"
            >
              <span className="text-muted-foreground flex items-center gap-2">
                {category.icon} {category.label}
              </span>
              <StarRating rating={review.ratings[category.id]} readOnly size={14} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReviewSection({ hostel }: { hostel: Hostel }) {
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: "",
      food: 0,
      cleanliness: 0,
      management: 0,
      safety: 0,
    },
  });

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    console.log(values);
    // Here you would typically call a server action to submit the review
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            What others are saying about {hostel.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hostel.reviews.length > 0 ? (
            hostel.reviews.map((review, index) => (
              <div key={review.id}>
                <ReviewCard review={review} />
                {index < hostel.reviews.length - 1 && (
                  <Separator className="my-6" />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No reviews yet. Be the first to write one!
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
          <CardDescription>
            Share your experience. (Only for verified residents)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {ratingCategories.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name={category.id}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2">
                          {category.icon} {category.label}
                        </FormLabel>
                        <FormControl>
                          <StarRating
                            rating={field.value}
                            onRatingChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your stay..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="picture">Add a photo (optional)</Label>
                <Input id="picture" type="file" />
              </div>

              <Button type="submit" className="w-full">
                Submit Review
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
