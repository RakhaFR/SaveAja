import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaveAja - Download Video & Audio TikTok, Instagram Reels, YouTube MP4 & MP3",
  description: "Downloader video dan konverter audio online gratis. Download video TikTok tanpa watermark, Instagram Reels 1080p, dan video YouTube ke format MP4 atau MP3 berkualitas tinggi.",
  keywords: [
    "download video tiktok",
    "tiktok no watermark",
    "download ig reels",
    "youtube to mp3",
    "youtube to mp4",
    "saveaja",
    "convert video to audio",
  ],
  authors: [{ name: "SaveAja Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="dark antialiased"
    >
      <body className="min-h-[100dvh] bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans">
        {children}
      </body>
    </html>
  );
}
