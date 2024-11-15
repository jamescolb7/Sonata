import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "jotai";
import Content from "@/components/content";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sonata",
  description: "Your self-hosted music streaming platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="/manifest.json" rel="manifest"></link>
        <link rel="shortcut icon" type="image/png" href="/icons/logo.png" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Sonata" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased !font-[family-name:var(--font-geist-sans)]`}
      >
        <NextTopLoader color="#ffffff" showSpinner={false}></NextTopLoader>
        <Provider>
          <Content>
            {children}
          </Content>
        </Provider>
      </body>
    </html>
  );
}
