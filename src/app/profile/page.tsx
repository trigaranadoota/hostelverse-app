'use client';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
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
import { useDoc } from '@/firebase/firestore/use-doc';
import { UserProfile } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { parse, format } from 'date-fns';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  mobileNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  preferredLanguage: z.string(),
});

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid, 'profile', user.uid) : null),
    [firestore, user]
  );
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      dateOfBirth: '',
      preferredLanguage: 'en',
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


    const profileData: UserProfile = {
      id: user.uid,
      email: user.email!,
      firstName: values.firstName,
      lastName: values.lastName,
      mobileNumber: values.mobileNumber,
      dateOfBirth: dobISO,
      preferredLanguage: values.preferredLanguage
    };
    
    if(userProfileRef) {
      setDoc(userProfileRef, profileData, { merge: true })
      .then(() => {
        toast({
          title: 'Profile updated!',
          description: 'Your profile has been successfully updated.',
        });
      })
      .catch((e) => {
         const permissionError = new FirestorePermissionError({
          path: userProfileRef.path,
          operation: 'update',
          requestResourceData: profileData,
        });

        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false);
      });
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
        <CardDescription>Update your personal information.</CardDescription>
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
                    <Input placeholder="+1 234 567 890" {...field} />
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
                    <Input placeholder="dd-mm-yyyy" {...field} />
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
