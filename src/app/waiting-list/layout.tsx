import { AppShell } from "@/components/shared/app-shell";

export default function WaitingListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
