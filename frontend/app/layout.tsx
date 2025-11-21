import type { Metadata } from "next";
import "./globals.css";

import { appConfig } from "@/lib/config";

//1.- Define the shared metadata applied across every route.
export const metadata: Metadata = {
  title: appConfig.appName,
  description:
    "Frontend shell for Larago featuring shadcn/ui primitives and cookie-based authentication.",
};

//2.- Render the root document shell and apply consistent typography smoothing.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
