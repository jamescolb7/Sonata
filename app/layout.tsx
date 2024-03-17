import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from '@/lib/utils';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/ui/sonner"
import Content from "@/components/Content";
import { Provider } from "jotai";
import { headers } from "next/headers";
import Player from "@/components/Player";

export const revalidate = 3600000;
export const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sonata",
  description: "Sonata, your selfhosted music streaming platform.",
};

async function getPlayerUrl() {
  const header = headers().get('player_url');
  return header;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const playerUrl = await getPlayerUrl();

  return (
    <html lang="en">
      <body className={cn('dark min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <Provider>
          <NextTopLoader color="#3b83f7" showSpinner={false} />
          <div className="flex flex-row">
            <Content>
              {children}
            </Content>
          </div>
          <Player playerUrl={playerUrl} className="z-[12] h-[89px]" />
          <Toaster></Toaster>
        </Provider>
      </body>
    </html>
  );
}