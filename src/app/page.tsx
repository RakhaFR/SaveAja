import { Navbar } from "@/components/Navbar";
import { DownloadForm } from "@/components/DownloadForm";
import { PlatformFeatures } from "@/components/PlatformFeatures";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { IconSparkles, IconShieldCheck, IconBolt } from "@tabler/icons-react";

export default function HomePage() {
  return (
    <div className="relative min-h-[100dvh] bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Subtle Mesh / Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute top-1/3 -left-32 size-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 size-[400px] rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        {/* Hero Section */}
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-20">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <IconSparkles className="size-3.5 text-indigo-400" />
            <span>Downloader Video & Audio No #1</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Download Video & Audio{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              TikTok, IG & YouTube
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Unduh video tanpa watermark dalam resolusi Full HD atau ubah langsung menjadi file audio MP3 berkualitas tinggi. Cepat, gratis, dan tanpa iklan mengganggu.
          </p>

          {/* Form Box */}
          <div className="mt-8 w-full max-w-3xl">
            <DownloadForm />
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <IconShieldCheck className="size-4 text-emerald-400" />
              <span>Bebas Watermark & Iklan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconBolt className="size-4 text-amber-400" />
              <span>Konversi Instan ke MP4 & MP3</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconSparkles className="size-4 text-indigo-400" />
              <span>Kualitas Audio Jernih 320kbps</span>
            </div>
          </div>
        </main>

        {/* Feature Grid & FAQ */}
        <PlatformFeatures />
        <FaqSection />
      </div>

      <Footer />
    </div>
  );
}
