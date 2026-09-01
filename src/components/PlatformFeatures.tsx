export function PlatformFeatures() {
  const features = [
    {
      code: "01",
      title: "TikTok No Watermark",
      description: "Unduh video TikTok resolusi HD 1080p bersih tanpa tanda air.",
      tag: "HD 1080P",
    },
    {
      code: "02",
      title: "Instagram Reels & Post",
      description: "Ambil video Reels dan post Instagram kualitas original langsung.",
      tag: "ORIGINAL",
    },
    {
      code: "03",
      title: "YouTube & Shorts",
      description: "Download video YouTube dan Shorts dalam format MP4 fleksibel.",
      tag: "MP4 VIDEO",
    },
    {
      code: "04",
      title: "Konversi MP3 HQ",
      description: "Ekstrak track audio & suara musik dengan bitrate 320kbps.",
      tag: "320 KBPS",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
          [ FITUR & PLATFORM ]
        </h2>
        <p className="mt-1 font-mono text-xs text-zinc-400">
          Ekstraksi cepat untuk video MP4 dan audio MP3
        </p>
      </div>

      {/* Retro Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="retro-box flex flex-col justify-between p-4"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/20 pb-2 font-mono text-xs">
                <span className="font-bold text-white">[{item.code}]</span>
                <span className="border border-white/40 bg-zinc-950 px-1.5 py-0.2 text-[10px] text-zinc-300">
                  {item.tag}
                </span>
              </div>

              <h3 className="mt-3 font-mono text-sm font-bold text-white uppercase">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
