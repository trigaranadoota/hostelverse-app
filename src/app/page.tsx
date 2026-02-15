
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useTranslation } from '@/hooks/use-translation';
import { SplashScreen } from '@/components/shared/splash-screen';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <div className={`flex flex-col min-h-screen bg-white transition-opacity duration-700 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <header className="px-6 lg:px-12 h-20 flex items-center border-b border-gray-50">
          <Link href="/" className="flex items-center justify-center gap-2 group">
            <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors">
              <Building2 className="h-6 w-6 text-gray-900" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">HostelVerse</span>
          </Link>
          <nav className="ml-auto flex items-center gap-6">
            <LanguageSwitcher />
            <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900">
              <Link href="/login">{t('signIn')}</Link>
            </Button>
            <Button asChild className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6">
              <Link href="/hostels">{t('exploreHostels')}</Link>
            </Button>
          </nav>
        </header>

        <main className="flex-1">
          <section className="w-full py-20 md:py-32 lg:py-40">
            <div className="container mx-auto px-6 md:px-12">
              <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                <div className="space-y-6">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-gray-900 leading-tight">
                    {t('heroTitle')}
                  </h1>
                  <p className="max-w-[700px] mx-auto text-gray-500 text-lg md:text-xl leading-relaxed">
                    {t('heroSubtitle')}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-10 h-14 text-lg shadow-xl shadow-gray-200 transition-all hover:scale-105 active:scale-95">
                    <Link href="/hostels">{t('exploreHostels')}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg border-gray-200 hover:bg-gray-50 transition-all">
                    <Link href="/login">{t('signIn')}</Link>
                  </Button>
                </div>

                <div className="w-full pt-16 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 z-10 pointer-events-none rounded-3xl" />
                  <Image
                    src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/1200/600"}
                    width={1200}
                    height={600}
                    alt={heroImage?.description || "Hero Image"}
                    className="mx-auto aspect-[21/9] overflow-hidden rounded-3xl object-cover shadow-2xl shadow-gray-100 border border-gray-100"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-20 bg-gray-50/30">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-8">Trusted by thousands of travelers</h2>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
                {/* Placeholder for trusted logos - keep it clean and minimal */}
                <span className="text-xl font-bold italic">SafeStay</span>
                <span className="text-xl font-bold italic">Wanderlust</span>
                <span className="text-xl font-bold italic">NomadHub</span>
                <span className="text-xl font-bold italic">UrbanHostel</span>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-12 px-6 md:px-12 border-t border-gray-50 bg-white">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900 font-semibold tracking-tight">HostelVerse</span>
            </div>
            <p className="text-sm text-gray-400">
              {t('footerText')}
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
