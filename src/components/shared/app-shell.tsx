
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Building2, Heart, Search, User, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth, useUser } from "@/firebase";
import { LanguageSwitcher } from "./language-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-2">
          <SidebarHeader className="p-2">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold font-headline text-sidebar-foreground">
                HostelVerse
              </span>
            </Link>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/hostels")}
                tooltip={t('discover')}
              >
                <Link href="/hostels">
                  <Search />
                  <span>{t('discover')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/wishlist"}
                tooltip={t('wishlist')}
              >
                <Link href="/wishlist">
                  <Heart />
                  <span>{t('wishlist')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/profile"}
                tooltip={t('profile')}
              >
                <Link href="/profile">
                  <User />
                  <span>{t('profile')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b md:justify-end">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isUserLoading ? (
               <div className="w-24 h-9 bg-muted rounded-md animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                      {user.displayName && <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </header>
        <main className="flex-1 p-4 overflow-auto md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
