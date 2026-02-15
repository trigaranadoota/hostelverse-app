'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Lead the user directly to the home page (where hostels are mentioned)
    router.replace('/hostels');
  }, [router]);

  // Render nothing as the SplashWrapper in RootLayout will be showing the splash screen
  // and then the /hostels page will be revealed after the redirect and splash completion.
  return null;
}
