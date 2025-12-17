import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/shared/language-switcher';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="sr-only">HostelVerse</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <LanguageSwitcher />
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Find Your Next Home Away From Home
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Discover, compare, and book the best hostels around the
                    world with HostelVerse. Your next adventure is just a click
                    away.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">Explore Hostels</Link>
                  </Button>
                </div>
              </div>
              <Image
                src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/600/400"}
                width={600}
                height={400}
                alt={heroImage?.description || "Hero Image"}
                data-ai-hint="hostel common area"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 HostelVerse. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
