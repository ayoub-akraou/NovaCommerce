import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainNavbar } from "@/components/navigation/main-navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NovaCommerce",
  description: "Modern ecommerce experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900">
        <div className="min-h-full">
          <MainNavbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
