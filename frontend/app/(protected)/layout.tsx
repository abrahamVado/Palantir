import { ReactNode } from "react";
import { ProtectedShell } from "@/components/protected-shell";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  //1.- Wrap protected routes in the shared shell that enforces authentication and navigation.
  return <ProtectedShell>{children}</ProtectedShell>;
}
