"use client";
import { Review, Hostel, UserProfile } from "@/lib/types";
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
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";


const reviewSchema = z.object({
  text: z.string().min(10, "Review must be at least 10 characters long."),
  foodRating: z.number().min(1, "Rating is required.").max(5),
  cleanlinessRating: z.number().min(1, "Rating is required.").max(5),
  managementRating: z.number().min(1, "Rating is required.").max(5),
  safetyRating: z.number().min(1, "Rating is required.").max(5),
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

function ReviewCard({ review }: { review: Review }) {
  const overallRating = (review.foodRating + review.cleanlinessRating + review.managementRating + review.safetyRating) / 4;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={review.userPhotoURL} alt={review.userDisplayName} />
        <AvatarFallback>{getInitials(review.userDisplayName || 'A')}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{review.userDisplayName || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">
              {review.createdAt ? formatDistanceToNow(new Date(review.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}
            </p>
          </div>
          <StarRating rating={overallRating} readOnly size={16} />
        </div>
        <p className="text-sm">{review.text}</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm pt-2">
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

async function fetchUserProfilesForReviews(firestore: any, reviews: Review[]): Promise<Review[]> {
    const userIds = [...new Set(reviews.map(review => review.userId))];
    const userProfiles = new Map<string, UserProfile>();

    for (const userId of userIds) {
        try {
            const userDocRef = doc(firestore, 'users', userId, 'profile', userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                userProfiles.set(userId, userDocSnap.data() as UserProfile);
            }
        } catch (error) {
            console.error(`Failed to fetch profile for user ${userId}`, error);
        }
    }

    return reviews.map(review => {
        const profile = userProfiles.get(review.userId);
        return {
            ...review,
            userDisplayName: profile ? `${profile.firstName} ${profile.lastName}` : 'Anonymous',
            userPhotoURL: undefined, // Or fetch from profile if available
        };
    });
}


export function ReviewSection({ hostel }: { hostel: Hostel }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const reviewsCollectionRef = useMemoFirebase(
    () => firestore ? collection(firestore, `hostels/${hostel.id}/reviews`) : null,
    [firestore, hostel.id]
  );
  const { data: rawReviews, isLoading: areReviewsLoading } = useCollection<Review>(reviewsCollectionRef);

  useEffect(() => {
    if (rawReviews && firestore) {
      fetchUserProfilesForReviews(firestore, rawReviews).then(setReviews);
    }
  }, [rawReviews, firestore]);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      text: "",
      foodRating: 0,
      cleanlinessRating: 0,
      managementRating: 0,
      safetyRating: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    if (!user || !reviewsCollectionRef) {
        toast({
            variant: "destructive",
            title: "Not Logged In",
            description: "You need to be logged in to submit a review."
        });
        return;
    }
    setIsSubmitting(true);
    const reviewData = {
        ...values,
        hostelId: hostel.id,
        userId: user.uid,
        createdAt: serverTimestamp(),
    };
    
    addDoc(reviewsCollectionRef, reviewData)
        .then(() => {
            toast({ title: "Review submitted successfully!" });
            form.reset();
        })
        .catch(e => {
            const permissionError = new FirestorePermissionError({
                path: reviewsCollectionRef.path,
                operation: 'create',
                requestResourceData: reviewData
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
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
          {areReviewsLoading && <p>Loading reviews...</p>}
          {!areReviewsLoading && reviews.length > 0 ? (
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

              <div className="space-y-2">
                <Label htmlFor="picture">Add a photo (optional)</Label>
                <Input id="picture" type="file" disabled/>
              </div>

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
