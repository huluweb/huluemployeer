import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: 'Hulu GENERAL COMMISSION',
  description: 'HULU GENERAL COMMISSION',
  icons: {
    icon: [{ url: '/Logo.JPG', sizes: '196x196', type: 'image/png' }],
    apple: [{ url: '/apple-icon-180.png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    startupImage: [
      {
        url: '/apple-splash-640-1136.jpg',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-750-1334.jpg',
        media:
          '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-828-1792.jpg',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1125-2436.jpg',
        media:
          '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1136-640.jpg',
        media:
          '(device-width: 568px) and (device-height: 320px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: '/apple-splash-1170-2532.jpg',
        media:
          '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1179-2556.jpg',
        media:
          '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1206-2622.jpg',
        media:
          '(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1242-2208.jpg',
        media:
          '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1242-2688.jpg',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1284-2778.jpg',
        media:
          '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1290-2796.jpg',
        media:
          '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1320-2868.jpg',
        media:
          '(device-width: 440px) and (device-height: 955px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1334-750.jpg',
        media:
          '(device-width: 667px) and (device-height: 375px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: '/apple-splash-1488-2266.jpg',
        media:
          '(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1536-2048.jpg',
        media:
          '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1620-2160.jpg',
        media:
          '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1640-2360.jpg',
        media:
          '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1668-2224.jpg',
        media:
          '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1668-2388.jpg',
        media:
          '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: '/apple-splash-1792-828.jpg',
        media:
          '(device-width: 896px) and (device-height: 414px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
