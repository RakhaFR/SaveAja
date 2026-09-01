import { Navbar } from "@/components/Navbar";
import { DownloadForm } from "@/components/DownloadForm";
import { PlatformFeatures } from "@/components/PlatformFeatures";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="relative min-h-[100dvh] bg-black text-white flex flex-col justify-between selection:bg-white selection:text-black">
      <div className="flex flex-col flex-1">
        <Navbar />

        {/* Hero Section */}
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-20">
          {/* Eyebrow Badge */}
          <div className="border border-white bg-black px-3 py-1 font-mono text-[11px] font-bold text-white uppercase tracking-wider">
            [ UNIVERSAL MEDIA CONVERTER ]
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 max-w-3xl font-mono text-3xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            DOWNLOAD VIDEO & AUDIO
            <br />
            <span className="bg-white text-black px-2 mt-1 inline-block">
              TIKTOK · IG REELS · YOUTUBE
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-xs sm:text-sm leading-relaxed text-zinc-400 font-mono">
            Konversi video favoritmu menjadi format MP4 Full HD atau MP3 kualitas tinggi tanpa watermark. Cepat dan gratis.
          </p>

          {/* Form Box */}
          <div className="mt-8 w-full max-w-2xl">
            <DownloadForm />
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
