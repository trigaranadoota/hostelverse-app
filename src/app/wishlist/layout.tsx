import { AppShell } from "@/components/shared/app-shell";

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
