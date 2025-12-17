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
import { Building2, Heart, Search, UploadCloud } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
                tooltip="Discover"
              >
                <Link href="/hostels">
                  <Search />
                  <span>Discover</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/wishlist"}
                tooltip="Wishlist"
              >
                <Link href="/wishlist">
                  <Heart />
                  <span>Wishlist</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/image-verification"}
                tooltip="Image Verification"
              >
                <Link href="/image-verification">
                  <UploadCloud />
                  <span>Image Verification</span>
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
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
            <Button variant="outline">Sign In</Button>
          </div>
        </header>
        <main className="flex-1 p-4 overflow-auto md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
