"use client";

import {
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandYoutube,
  IconMusic,
  IconSparkles,
  IconShieldCheck,
  IconDeviceMobile,
  IconBolt,
} from "@tabler/icons-react";

export function PlatformFeatures() {
  const features = [
    {
      icon: <IconBrandTiktok className="size-6 text-rose-400" />,
      title: "TikTok No Watermark",
      description:
        "Download video TikTok format HD 1080p jernih tanpa tanda air / watermark secara instan.",
      tag: "HD 1080p",
      borderGlow: "hover:border-rose-500/40",
    },
    {
      icon: <IconBrandInstagram className="size-6 text-pink-400" />,
      title: "Instagram Reels & Post",
      description:
        "Simpan video Reels, Carousel, dan Story Instagram dengan resolusi original langsung ke galeri.",
      tag: "Reels & Post",
      borderGlow: "hover:border-pink-500/40",
    },
    {
      icon: <IconBrandYoutube className="size-6 text-red-500" />,
      title: "YouTube Video & Shorts",
      description:
        "Unduh video YouTube dan Shorts dengan opsi resolusi 1080p, 720p, hingga 480p hemat kuota.",
      tag: "Shorts & Video",
      borderGlow: "hover:border-red-500/40",
    },
    {
      icon: <IconMusic className="size-6 text-indigo-400" />,
      title: "Konversi ke MP3 HQ",
      description:
        "Ekstrak musik, suara latar, atau podcast dari video menjadi file MP3 jernih 320kbps.",
      tag: "320 kbps",
      borderGlow: "hover:border-indigo-500/40",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Fitur Utama & Platform yang Didukung
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400">
          Semua alat pengunduh video & konverter audio terbaik dalam satu website yang cepat dan mudah digunakan.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((item, idx) => (
          <div
            key={idx}
            className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/90 ${item.borderGlow}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-zinc-800/90 shadow-sm transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
                <span className="rounded-full border border-white/10 bg-zinc-800/60 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300">
                  {item.tag}
                </span>
              </div>

              <h3 className="mt-4 text-base font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                {item.description}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
              <span>Mendukung Konversi</span>
              <IconSparkles className="size-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Highlights Bar */}
      <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30">
            <IconBolt className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Ekstra Cepat</h4>
            <p className="text-xs text-zinc-400">Proses konversi dalam hitungan detik</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <IconShieldCheck className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Aman & Privat</h4>
            <p className="text-xs text-zinc-400">Tanpa simpan log dan tanpa registrasi</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30">
            <IconDeviceMobile className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Semua Perangkat</h4>
            <p className="text-xs text-zinc-400">Optimal di HP Android, iPhone, & Laptop</p>
          </div>
        </div>
      </div>
    </section>
  );
}
