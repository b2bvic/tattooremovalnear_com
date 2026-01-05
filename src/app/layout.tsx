import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tattoo Removal Near Me | Find Local Laser Tattoo Removal",
  description: "Find trusted tattoo removal specialists near you. Compare laser tattoo removal prices, read reviews, and book consultations with certified providers.",
  metadataBase: new URL('https://tattooremovalnear.com'),
  authors: [{ name: 'Victor Valentine Romo', url: 'https://victorvalentineromo.com' }],
  creator: 'Victor Valentine Romo',
  openGraph: {
    title: 'Tattoo Removal Near Me | Find Local Specialists',
    description: 'Find trusted tattoo removal specialists near you. Compare prices and book consultations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@b2bvic',
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
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
