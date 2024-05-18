import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from '@/lib/utils';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/ui/sonner"
import Content from "@/components/Content";
import { Provider } from "jotai";
import Player from "@/components/Player";

export const revalidate = 3600000;
export const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sonata",
  description: "Sonata, your selfhosted music streaming platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="/manifest.json" rel="manifest"></link>
        <link rel="shortcut icon" type="image/png" href="/icons/logo.png" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Sonata" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={cn('dark min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <Provider>
          <NextTopLoader color="#3b83f7" showSpinner={false} />
          <div className="flex flex-row">
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