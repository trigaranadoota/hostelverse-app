
"use client";
import type { Hostel } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { StarRating } from "../shared/star-rating";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
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
import { useUser, useSupabase, useReviews } from "@/supabase";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { useState } from "react";
import Image from "next/image";
import type { Review as AppReview } from "@/lib/types";


const reviewSchema = z.object({
  text: z.string().min(10, "Review must be at least 10 characters long."),
  foodRating: z.number().min(1, "Rating is required.").max(5),
  cleanlinessRating: z.number().min(1, "Rating is required.").max(5),
  managementRating: z.number().min(1, "Rating is required.").max(5),
  safetyRating: z.number().min(1, "Rating is required.").max(5),
  picture: z.any().optional(),
});

const ratingCategories = [
  { id: "foodRating", label: "Food", icon: <Utensils className="h-4 w-4" /> },
  {
    id: "cleanlinessRating",
    label: "Cleanliness",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "managementRating",
    label: "Management",
    icon: <UserCheck className="h-4 w-4" />,
  },
  { id: "safetyRating", label: "Safety", icon: <Shield className="h-4 w-4" /> },
] as const;

function ReviewCard({ review, isLoading }: { review: AppReview, isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="flex space-x-4 animate-pulse">
        <div className="rounded-full bg-muted h-10 w-10"></div>
        <div className="flex-1 space-y-3 py-1">
          <div className="h-2 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-muted rounded col-span-2"></div>
              <div className="h-2 bg-muted rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const overallRating = (review.foodRating + review.cleanlinessRating + review.managementRating + review.safetyRating) / 4;

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('') || 'A';
  }

  const createdAt = review.createdAt instanceof Date ? review.createdAt : new Date(review.createdAt as unknown as string);

  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={review.userPhotoURL || undefined} alt={review.userDisplayName} />
        <AvatarFallback>{getInitials(review.userDisplayName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{review.userDisplayName || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </p>
          </div>
          <StarRating rating={overallRating} readOnly size={16} />
        </div>
        <p className="text-sm">{review.text}</p>

        {review.imageUrl && (
          <div className="relative aspect-video w-full max-w-sm mt-2 overflow-hidden rounded-lg">
            <Image src={review.imageUrl} alt="Review image" fill className="object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-1 text-sm pt-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2">{ratingCategories[0].icon} {ratingCategories[0].label}</span>
            <StarRating rating={review.foodRating} readOnly size={14} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2">{ratingCategories[1].icon} {ratingCategories[1].label}</span>
            <StarRating rating={review.cleanlinessRating} readOnly size={14} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2">{ratingCategories[2].icon} {ratingCategories[2].label}</span>
            <StarRating rating={review.managementRating} readOnly size={14} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-2">{ratingCategories[3].icon} {ratingCategories[3].label}</span>
            <StarRating rating={review.safetyRating} readOnly size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}


export function ReviewSection({ hostel }: { hostel: Hostel }) {
  const { user } = useUser();
  const supabase = useSupabase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: reviews, isLoading: areReviewsLoading, refetch } = useReviews(hostel.id);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      text: "",
      foodRating: 0,
      cleanlinessRating: 0,
      managementRating: 0,
      safetyRating: 0,
      picture: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to submit a review."
      });
      return;
    }
    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;
      const imageFile = values.picture?.[0];

      // Upload image to Supabase Storage if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          // Continue without image if upload fails
        } else {
          const { data: urlData } = supabase.storage
            .from('review-images')
            .getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      }

      // Insert review into Supabase
      const { error: insertError } = await supabase.from('reviews').insert({
        hostel_id: hostel.id,
        user_id: user.id,
        text: values.text,
        food_rating: values.foodRating,
        cleanliness_rating: values.cleanlinessRating,
        management_rating: values.managementRating,
        safety_rating: values.safetyRating,
        user_display_name: user.user_metadata?.full_name || user.email || 'Anonymous',
        user_photo_url: user.user_metadata?.avatar_url || null,
        image_url: imageUrl,
      } as never);

      if (insertError) throw insertError;

      toast({ title: "Review submitted successfully!" });
      form.reset();
      refetch();
    } catch (error: any) {
      console.error("Review submission failed:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Could not submit your review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          {areReviewsLoading && Array.from({ length: 2 }).map((_, i) => <ReviewCard key={i} review={{} as AppReview} isLoading={true} />)}
          {!areReviewsLoading && reviews && reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={review.id}>
                <ReviewCard review={review} />
                {index < reviews.length - 1 && (
                  <Separator className="my-6" />
                )}
              </div>
            ))
          ) : !areReviewsLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No reviews yet. Be the first to write one!
            </p>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
          <CardDescription>
            Share your experience.
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
                name="text"
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

              <FormField
                control={form.control}
                name="picture"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Add a photo (optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          onChange(event.target.files && event.target.files);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" className="w-full" disabled={isSubmitting || !user}>
                {isSubmitting ? "Submitting..." : (user ? "Submit Review" : "Log in to review")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
