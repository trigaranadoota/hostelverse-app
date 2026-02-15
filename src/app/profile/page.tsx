
'use client';
import { useUser, useProfile } from '@/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { parse, format } from 'date-fns';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  mobileNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  preferredLanguage: z.string(),
  address: z.string().optional(),
  pinCode: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  category: z.string().optional(),
  annualIncome: z.coerce.number().optional(),
  score10th: z.coerce.number().optional(),
  score12th: z.coerce.number().optional(),
  distance: z.coerce.number().optional(),
});

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { data: userProfile, isLoading: isProfileLoading, updateProfile } = useProfile();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      dateOfBirth: '',
      preferredLanguage: 'en',
      address: '',
      pinCode: '',
      country: '',
      state: '',
      category: '',
      annualIncome: 0,
      score10th: 0,
      score12th: 0,
      distance: 0,
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (userProfile) {
      form.reset({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        mobileNumber: userProfile.mobileNumber || '',
        dateOfBirth: userProfile.dateOfBirth ? format(new Date(userProfile.dateOfBirth), 'dd-MM-yyyy') : '',
        preferredLanguage: userProfile.preferredLanguage || 'en',
        address: userProfile.address || '',
        pinCode: userProfile.pinCode || '',
        country: userProfile.country || '',
        state: userProfile.state || '',
        category: userProfile.category || '',
        annualIncome: userProfile.annualIncome || 0,
        score10th: userProfile.score10th || 0,
        score12th: userProfile.score12th || 0,
        distance: userProfile.distance || 0,
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;
    setIsSaving(true);

    let dobISO: string | undefined = undefined;
    if (values.dateOfBirth) {
      try {
        const parsedDate = parse(values.dateOfBirth, 'dd-MM-yyyy', new Date());
        if (!isNaN(parsedDate.getTime())) {
          dobISO = parsedDate.toISOString();
        } else {
          form.setError("dateOfBirth", { type: "manual", message: "Invalid date format. Use DD-MM-YYYY." });
          setIsSaving(false);
          return;
        }
      } catch (e) {
        form.setError("dateOfBirth", { type: "manual", message: "Invalid date format. Use DD-MM-YYYY." });
        setIsSaving(false);
        return;
      }
    }

    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        email: user.email || '',
        mobileNumber: values.mobileNumber || null,
        dateOfBirth: dobISO || null,
        preferredLanguage: values.preferredLanguage,
        address: values.address || null,
        pinCode: values.pinCode || null,
        country: values.country || null,
        state: values.state || null,
        category: values.category || null,
        annualIncome: values.annualIncome === undefined ? null : values.annualIncome,
        score10th: values.score10th === undefined ? null : values.score10th,
        score12th: values.score12th === undefined ? null : values.score12th,
        distance: values.distance === undefined ? null : values.distance,
      });

      toast({
        title: 'Profile updated!',
        description: 'Your profile has been successfully updated.',
      });
      router.push('/hostels');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading || isProfileLoading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Update your personal information to get accurate waitlist rankings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email || ''} disabled />
            </div>
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 890" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input placeholder="dd-mm-yyyy" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>
                    Please use the DD-MM-YYYY format.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="California" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="USA" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pinCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pin Code</FormLabel>
                    <FormControl>
                      <Input placeholder="90210" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="obc">OBC</SelectItem>
                        <SelectItem value="sc">SC</SelectItem>
                        <SelectItem value="st">ST</SelectItem>
                        <SelectItem value="pc">Physically Challenged</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="annualIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Family Income (INR)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="500000" {...field} value={field.value ?? 0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home to College/School Distance (in km)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="20" {...field} value={field.value ?? 0} />
                  </FormControl>
                  <FormDescription>
                    This is used to calculate your waitlist priority score.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="score10th"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>10th Score (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="95" {...field} value={field.value ?? 0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="score12th"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>12th Score (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="92" {...field} value={field.value ?? 0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="preferredLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
