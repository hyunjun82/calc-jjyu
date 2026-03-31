"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ThemeProvider from "./ThemeProvider";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isApartment = pathname.startsWith("/apartment");

  if (isApartment) {
    return <main>{children}</main>;
  }

  return (
    <ThemeProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
