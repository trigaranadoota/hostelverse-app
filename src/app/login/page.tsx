
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.655-3.657-11.303-8.653l-6.571,4.819C9.656,39.663,16.318,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.636,44,29.74,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );

export default function LoginPage() {
  const [email, setEmail] = useState('abc@gmail.com');
  const [password, setPassword] = useState('123456');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [emailLink, setEmailLink] = useState('');
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const completeSignIn = async () => {
        if (auth && isSignInWithEmailLink(auth, window.location.href)) {
            let emailForSignIn = window.localStorage.getItem('emailForSignIn');
            if (!emailForSignIn) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the email again.
                emailForSignIn = window.prompt('Please provide your email for confirmation');
            }
            if(emailForSignIn) {
                try {
                    await signInWithEmailLink(auth, emailForSignIn, window.location.href);
                    window.localStorage.removeItem('emailForSignIn');
                    toast({ title: "Signed in successfully!" });
                    router.push('/hostels');
                } catch (error: any) {
                    toast({
                        variant: "destructive",
                        title: "Sign-in failed.",
                        description: error.message,
                    });
                }
            }
        }
    };
    completeSignIn();
  }, [auth, router, toast]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Signed in successfully!' });
      router.push('/hostels');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      toast({ title: 'Account created successfully!' });
      router.push('/hostels');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Signed in with Google successfully!' });
      router.push('/hostels');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    }
  };
  
  const handleEmailLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) must be
        // in the authorized domains list in the Firebase Console.
        url: window.location.href, // Redirect back to the login page to complete sign-in
        handleCodeInApp: true,
      };

    try {
      await sendSignInLinkToEmail(auth, emailLink, actionCodeSettings);
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', emailLink);
      toast({
        title: 'Check your email',
        description: `A sign-in link has been sent to ${emailLink}.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Could not send sign-in link',
        description: error.message,
      });
    }
  };

  return (
    <div className="w-full max-w-md">
       <div className="flex flex-col items-center justify-center mb-6">
          <Link href="/" className="flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mt-2 font-headline">Welcome to HostelVerse</h1>
          <p className="text-muted-foreground">Sign in to find your next stay</p>
        </div>
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="emaillink">Email Link</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Access your account to see your wishlist and bookings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <GoogleIcon className="mr-2 h-5 w-5" />
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create an account to start your journey with us.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <GoogleIcon className="mr-2 h-5 w-5" />
                Sign up with Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="emaillink">
          <Card>
            <CardHeader>
              <CardTitle>Sign in with Email</CardTitle>
              <CardDescription>
                We'll send a magic link to your email. No password needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleEmailLinkSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-link">Email</Label>
                  <Input
                    id="email-link"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={emailLink}
                    onChange={(e) => setEmailLink(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Sign-In Link
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
