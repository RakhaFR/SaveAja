import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://saveaja.vercel.app"),
  title: {
    default: "SaveAja - Download Video & Audio TikTok, Instagram Reels, YouTube MP4 & MP3",
    template: "%s | SaveAja",
  },
  description:
    "Downloader video dan konverter audio online gratis tanpa watermark. Unduh video TikTok, Instagram Reels, dan YouTube ke format MP4 HD atau MP3 kualitas tinggi secara cepat dan tanpa ribet.",
  applicationName: "SaveAja",
  authors: [{ name: "SaveAja Team" }],
  generator: "Next.js",
  keywords: [
    "saveaja",
    "download video tiktok",
    "tiktok no watermark",
    "download ig reels",
    "instagram reels downloader",
    "youtube to mp3",
    "youtube to mp4",
    "convert video to audio",
    "unduh video gratis",
    "snaptik",
    "y2mate",
  ],
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: [
      { url: "/logo.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "SaveAja - Download Video & Audio TikTok, Instagram Reels, YouTube",
    description:
      "Unduh video TikTok tanpa watermark, Instagram Reels HD, dan video YouTube ke format MP4 atau MP3 berkualitas tinggi secara instan dan gratis.",
    url: "https://saveaja.vercel.app",
    siteName: "SaveAja",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "SaveAja Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SaveAja - Download Video & Audio TikTok, Instagram Reels, YouTube",
    description:
      "Unduh video TikTok tanpa watermark, Instagram Reels HD, dan video YouTube ke format MP4 atau MP3 berkualitas tinggi gratis.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark antialiased">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body className="min-h-[100dvh] bg-black text-white selection:bg-white selection:text-black font-sans">
        {children}
      </body>
    </html>
  );
}
