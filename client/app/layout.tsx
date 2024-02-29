import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/ui/sonner"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Content from "@/components/Content";
import Player from "@/components/Player";

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
        <NextTopLoader color="#3b83f7" showSpinner={false} />
        <ResizablePanelGroup className="min-h-screen" direction="vertical">
          <ResizablePanel defaultSize={90}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel className="hidden lg:block" defaultSize={15} maxSize={20} minSize={15}>
                <Sidebar />
              </ResizablePanel>
              <ResizableHandle className="hidden lg:block" withHandle />
              <ResizablePanel defaultSize={85}>
                <Content>
                  {children}
                </Content>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={10} minSize={10} maxSize={10}>
            <Player />
          </ResizablePanel>
        </ResizablePanelGroup>
        <Toaster></Toaster>
      </body>
    </html>
  );
}