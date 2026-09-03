import { Navbar } from "@/components/Navbar";
import { DownloadForm } from "@/components/DownloadForm";
import { PlatformFeatures } from "@/components/PlatformFeatures";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import ShapeGrid from "@/components/ShapeGrid";
import FuzzyText from "@/components/FuzzyText";

export default function HomePage() {
  return (
    <div className="relative min-h-[100dvh] bg-black text-white flex flex-col justify-between selection:bg-white selection:text-black overflow-hidden">
      <div className="flex flex-col flex-1">
        <Navbar />

        {/* Hero Section */}
        <section className="relative w-full overflow-hidden border-b-2 border-white/20">
          {/* ShapeGrid Background */}
          <div className="absolute inset-0 pointer-events-auto opacity-35">
            <ShapeGrid
              shape="square"
              squareSize={48}
              borderColor="rgba(255, 255, 255, 0.22)"
              hoverFillColor="rgba(255, 255, 255, 0.12)"
              hoverTrailAmount={4}
              speed={0.4}
              direction="diagonal"
            />
          </div>

          <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-20">
            {/* Eyebrow Badge */}
            <div className="border border-white bg-black px-3 py-1 font-mono text-[11px] font-bold text-white uppercase tracking-wider shadow-[2px_2px_0px_0px_#ffffff]">
              [ UNIVERSAL MEDIA CONVERTER ]
            </div>

            {/* Main Headline with Fuzzy / Glitch Effect */}
            <div className="mt-6 flex flex-col items-center justify-center">
              <FuzzyText
                fontSize="clamp(1.75rem, 5vw, 3.75rem)"
                fontWeight={900}
                fontFamily="var(--font-mono)"
                color="#ffffff"
                baseIntensity={0.12}
                hoverIntensity={0.5}
                glitchMode={true}
                glitchInterval={3000}
                glitchDuration={250}
                fuzzRange={25}
              >
                DOWNLOAD VIDEO & AUDIO
              </FuzzyText>

              <div className="mt-2">
                <span className="bg-white text-black font-mono font-black text-lg sm:text-2xl lg:text-3xl px-3 py-1 inline-block uppercase shadow-[4px_4px_0px_0px_#71717a]">
                  TIKTOK · IG REELS · YOUTUBE
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="mt-5 max-w-xl text-xs sm:text-sm leading-relaxed text-zinc-300 font-mono backdrop-blur-[2px]">
              Konversi video favoritmu menjadi format MP4 Full HD atau MP3 kualitas tinggi tanpa watermark. Cepat dan gratis.
            </p>

            {/* Form Box */}
            <div className="mt-8 w-full max-w-2xl">
              <DownloadForm />
            </div>
          </main>
        </section>

        {/* Feature Grid & FAQ */}
        <PlatformFeatures />
        <FaqSection />
      </div>

      <Footer />
    </div>
  );
}
