"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaMetadata, MediaFormat } from "@/lib/types";
import {
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandYoutube,
  IconVideo,
  IconMusic,
  IconDownload,
  IconCheck,
  IconPlayerPlay,
  IconEye,
  IconHeart,
  IconClock,
  IconExternalLink,
} from "@tabler/icons-react";
import confetti from "canvas-confetti";

interface MediaResultCardProps {
  data: MediaMetadata;
  onReset: () => void;
}

export function MediaResultCard({ data, onReset }: MediaResultCardProps) {
  const [activeTab, setActiveTab] = useState<"video" | "audio">("video");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const videoFormats = data.formats.filter((f) => f.type === "video");
  const audioFormats = data.formats.filter((f) => f.type === "audio");

  const getPlatformInfo = (platform: string) => {
    switch (platform) {
      case "tiktok":
        return {
          name: "TikTok",
          icon: <IconBrandTiktok className="size-4 text-rose-400" />,
          color: "border-rose-500/30 bg-rose-500/10 text-rose-300",
        };
      case "instagram":
        return {
          name: "Instagram",
          icon: <IconBrandInstagram className="size-4 text-pink-400" />,
          color: "border-pink-500/30 bg-pink-500/10 text-pink-300",
        };
      case "youtube":
        return {
          name: "YouTube",
          icon: <IconBrandYoutube className="size-4 text-red-500" />,
          color: "border-red-500/30 bg-red-500/10 text-red-300",
        };
      default:
        return {
          name: "Video",
          icon: <IconVideo className="size-4 text-indigo-400" />,
          color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
        };
    }
  };

  const handleDownload = (format: MediaFormat) => {
    setDownloadingId(format.id);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#6366f1", "#3b82f6", "#10b981", "#ec4899"],
      });
    } catch {
      // Confetti fallback
    }

    // Trigger direct stream download proxy
    const downloadUrl = `/api/stream?url=${encodeURIComponent(format.url)}&filename=${encodeURIComponent(data.title)}&format=${format.format}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${data.title.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50)}.${format.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingId(null);
    }, 2500);
  };

  const platformInfo = getPlatformInfo(data.platform);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-zinc-900/90 p-5 shadow-2xl backdrop-blur-xl transition-all sm:p-7">
      {/* Header Info */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${platformInfo.color}`}
          >
            {platformInfo.icon}
            <span>{platformInfo.name}</span>
          </span>
          {data.duration && (
            <span className="flex items-center gap-1 rounded-full border border-white/10 bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-300">
              <IconClock className="size-3 text-zinc-400" />
              <span>{data.duration}</span>
            </span>
          )}
        </div>

        <button
          onClick={onReset}
          className="text-xs font-medium text-zinc-400 transition-colors hover:text-white"
        >
          Download Link Lain →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Thumbnail Preview */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 md:col-span-5">
          {data.thumbnail ? (
            <img
              src={data.thumbnail}
              alt={data.title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-500">
              <IconPlayerPlay className="size-10 opacity-40" />
            </div>
          )}

          {/* Quick Play/View indicator */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[2px] transition-opacity hover:opacity-100">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-950 shadow-lg transition-transform hover:scale-105"
            >
              <IconExternalLink className="size-3.5" />
              Buka Sumber Asli
            </a>
          </div>
        </div>

        {/* Media Details & Download Options */}
        <div className="flex flex-col justify-between md:col-span-7">
          <div>
            {/* Title */}
            <h2 className="line-clamp-2 text-lg font-bold text-white sm:text-xl">
              {data.title}
            </h2>

            {/* Author info */}
            <div className="mt-2.5 flex items-center gap-2.5">
              {data.authorAvatar && (
                <img
                  src={data.authorAvatar}
                  alt={data.author}
                  className="size-6 rounded-full border border-white/20 object-cover"
                />
              )}
              <span className="text-sm font-medium text-zinc-300">
                {data.author}
              </span>
              {data.authorUsername && (
                <span className="text-xs text-zinc-500">
                  {data.authorUsername}
                </span>
              )}
            </div>

            {/* Stats if available */}
            {data.stats && (data.stats.views || data.stats.likes) ? (
              <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
                {Boolean(data.stats.views) && (
                  <div className="flex items-center gap-1">
                    <IconEye className="size-3.5 text-zinc-500" />
                    <span>{Number(data.stats.views).toLocaleString("id-ID")} views</span>
                  </div>
                )}
                {Boolean(data.stats.likes) && (
                  <div className="flex items-center gap-1">
                    <IconHeart className="size-3.5 text-rose-500/70" />
                    <span>{Number(data.stats.likes).toLocaleString("id-ID")} likes</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Format Selection Tabs */}
          <div className="mt-6">
            <div className="flex rounded-xl border border-white/10 bg-zinc-950/80 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("video")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                  activeTab === "video"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <IconVideo className="size-4" />
                <span>Video (MP4)</span>
                {videoFormats.length > 0 && (
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                    {videoFormats.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("audio")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                  activeTab === "audio"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <IconMusic className="size-4" />
                <span>Audio (MP3)</span>
                {audioFormats.length > 0 && (
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                    {audioFormats.length}
                  </span>
                )}
              </button>
            </div>

            {/* Format List */}
            <div className="mt-3.5 space-y-2">
              {activeTab === "video" ? (
                videoFormats.length > 0 ? (
                  videoFormats.map((format) => (
                    <div
                      key={format.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-950/40 p-3 transition-colors hover:border-white/10 hover:bg-zinc-950/70"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-100">
                          {format.quality}
                        </span>
                        {format.note && (
                          <span className="text-xs text-zinc-400">
                            {format.note}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleDownload(format)}
                        disabled={downloadingId === format.id}
                        className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
                      >
                        {downloadingId === format.id ? (
                          <>
                            <IconCheck className="size-3.5 animate-bounce" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <IconDownload className="size-3.5" />
                            <span>Unduh MP4</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-xs text-zinc-500">
                    Opsi video tidak tersedia untuk media ini.
                  </p>
                )
              ) : audioFormats.length > 0 ? (
                audioFormats.map((format) => (
                  <div
                    key={format.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-950/40 p-3 transition-colors hover:border-white/10 hover:bg-zinc-950/70"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-100">
                        {format.quality}
                      </span>
                      {format.note && (
                        <span className="text-xs text-zinc-400">
                          {format.note}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDownload(format)}
                      disabled={downloadingId === format.id}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
                    >
                      {downloadingId === format.id ? (
                        <>
                          <IconCheck className="size-3.5 animate-bounce" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <IconDownload className="size-3.5" />
                          <span>Unduh MP3</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-xs text-zinc-500">
                  Opsi audio tidak tersedia untuk media ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
