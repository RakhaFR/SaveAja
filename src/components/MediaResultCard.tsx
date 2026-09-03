"use client";

import { useState } from "react";
import { MediaMetadata, MediaFormat } from "@/lib/types";

interface MediaResultCardProps {
  data: MediaMetadata;
  onReset: () => void;
}

export function MediaResultCard({ data, onReset }: MediaResultCardProps) {
  const [activeTab, setActiveTab] = useState<"video" | "audio">("video");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const videoFormats = data.formats.filter((f) => f.type === "video");
  const audioFormats = data.formats.filter((f) => f.type === "audio");

  const handleDownload = async (format: MediaFormat) => {
    if (downloadingId) return;
    setDownloadingId(format.id);

    try {
      const downloadHref = `/api/download-file?targetUrl=${encodeURIComponent(format.url)}&mediaUrl=${encodeURIComponent(data.url)}&formatId=${encodeURIComponent(format.id)}&format=${format.format}&filename=${encodeURIComponent(data.title)}`;

      const response = await fetch(downloadHref);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const cleanName = data.title.replace(/[^a-zA-Z0-9_\s-]/g, '_').substring(0, 50).trim();
      const fullFilename = `${cleanName || 'media'}.${format.format}`;

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fullFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (error) {
      console.error('Download trigger error:', error);
      alert('Gagal mendownload media. Silakan coba klik download lagi.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="retro-box w-full p-5 sm:p-7">
      {/* Header Info */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-white/20 pb-4">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="border-2 border-white bg-white px-2.5 py-0.5 font-bold text-black uppercase">
            {data.platform}
          </span>
          {data.duration && (
            <span className="border border-white/40 bg-zinc-900 px-2 py-0.5 text-zinc-300">
              TIME: {data.duration}
            </span>
          )}
        </div>

        <button
          onClick={onReset}
          className="font-mono text-xs font-bold text-zinc-400 hover:text-white underline underline-offset-4"
        >
          [+ RESET LINK]
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Thumbnail Preview */}
        <div className="relative aspect-video w-full overflow-hidden border-2 border-white bg-black md:col-span-5">
          {data.thumbnail ? (
            <img
              src={data.thumbnail}
              alt={data.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-xs text-zinc-500">
              NO PREVIEW
            </div>
          )}
        </div>

        {/* Media Details & Download Options */}
        <div className="flex flex-col justify-between md:col-span-7">
          <div>
            <h2 className="line-clamp-2 text-base font-bold text-white sm:text-lg">
              {data.title}
            </h2>

            <div className="mt-2 flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span>BY: {data.author}</span>
              {data.authorUsername && <span>({data.authorUsername})</span>}
            </div>
          </div>

          {/* Format Selection Tabs */}
          <div className="mt-6">
            <div className="flex border-2 border-white bg-black">
              <button
                type="button"
                onClick={() => setActiveTab("video")}
                className={`flex-1 py-2 font-mono text-xs font-black uppercase transition-colors ${
                  activeTab === "video"
                    ? "bg-white text-black"
                    : "bg-black text-white hover:bg-zinc-900"
                }`}
              >
                VIDEO (MP4) [{videoFormats.length}]
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("audio")}
                className={`flex-1 py-2 font-mono text-xs font-black uppercase transition-colors ${
                  activeTab === "audio"
                    ? "bg-white text-black"
                    : "bg-black text-white hover:bg-zinc-900"
                }`}
              >
                AUDIO [{audioFormats.length}]
              </button>
            </div>

            {/* Format List */}
            <div className="mt-4 space-y-2.5">
              {activeTab === "video" ? (
                videoFormats.length > 0 ? (
                  videoFormats.map((format) => (
                    <div
                      key={format.id}
                      className="flex items-center justify-between border-2 border-white/20 bg-zinc-950 p-3"
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-white">
                          {format.quality}
                        </span>
                        {format.note && (
                          <span className="text-[11px] text-zinc-400">
                            {format.note}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleDownload(format)}
                        disabled={downloadingId === format.id}
                        className="retro-btn px-4 py-1.5 font-mono text-xs disabled:opacity-50"
                      >
                        {downloadingId === format.id ? "SAVING..." : "DOWNLOAD MP4"}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center font-mono text-xs text-zinc-500">
                    Opsi video tidak tersedia.
                  </p>
                )
              ) : audioFormats.length > 0 ? (
                audioFormats.map((format) => (
                  <div
                    key={format.id}
                    className="flex items-center justify-between border-2 border-white/20 bg-zinc-950 p-3"
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-white">
                        {format.quality}
                      </span>
                      {format.note && (
                        <span className="text-[11px] text-zinc-400">
                          {format.note}
                        </span>
                      )}
                    </div>

                      <button
                        onClick={() => handleDownload(format)}
                        disabled={downloadingId === format.id}
                        className="retro-btn px-4 py-1.5 font-mono text-xs disabled:opacity-50"
                      >
                        {downloadingId === format.id ? "SAVING..." : `DOWNLOAD ${format.format.toUpperCase()}`}
                      </button>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center font-mono text-xs text-zinc-500">
                  Opsi audio tidak tersedia.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
