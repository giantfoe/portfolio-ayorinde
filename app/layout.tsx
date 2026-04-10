import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ayorinde.netlify.app'),
  title: {
    default: "Ayorinde | Digital Architect & Engineer",
    template: "%s | Ayorinde"
  },
  description: "Portfolio of Ayorinde, a Digital Architect and Engineer specializing in modern scalable web applications, technical infrastructure, and high-end editorial aesthetics.",
  authors: [{ name: "Ayorinde" }],
  creator: "Ayorinde",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ayorinde.netlify.app",
    title: "Ayorinde | Digital Architect & Engineer",
    description: "Portfolio of Ayorinde, a Digital Architect and Engineer specializing in modern scalable web applications, technical infrastructure, and high-end editorial aesthetics.",
    siteName: "Ayorinde",
    images: [
      {
        url: "/images/MYHOMEPAGE.webp",
        width: 1200,
        height: 630,
        alt: "Ayorinde - Digital Architect & Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayorinde | Digital Architect & Engineer",
    description: "Portfolio of Ayorinde, a Digital Architect and Engineer.",
    creator: "@ayorinde270",
    images: ["/images/MYHOMEPAGE.webp"],
  },
  alternates: {
    canonical: "https://ayorinde.netlify.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ayorinde",
  url: "https://ayorinde.netlify.app",
  jobTitle: "Digital Architect & Engineer",
  sameAs: [
    "https://github.com/giantfoe",
    "https://medium.com/@ayorinde270",
    "https://twitter.com/ayorinde270",
    "https://www.linkedin.com/in/ayorinde270/"
  ]
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
        <Script defer data-domain="ayorinde.netlify.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:p-4 focus:bg-black focus:text-white top-0 left-0">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
