import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/ui/sonner"
import Content from "@/components/Content";
import Player from "@/components/Player";
import { Provider } from "jotai";

export const revalidate = 3600000;
export const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sonata",
  description: "Sonata Music Streaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('dark min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <Provider>
          <NextTopLoader color="#3b83f7" showSpinner={false} />
          <div className="flex flex-row pb-[89px]">
            <Sidebar className="z-[11] w-80 top-0 invisible fixed md:visible md:sticky" />
            <Content>
              {children}
            </Content>
          </div>
          <Player className="z-[12] h-[89px]" />
          <Toaster></Toaster>
        </Provider>
      </body>
    </html>
  );
}