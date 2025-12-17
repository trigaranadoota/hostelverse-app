import { AppShell } from "@/components/shared/app-shell";

export default function ImageVerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
