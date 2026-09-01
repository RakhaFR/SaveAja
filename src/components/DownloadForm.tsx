"use client";

import { useState, useEffect } from "react";
import { MediaMetadata, ApiResponse } from "@/lib/types";
import { detectPlatform } from "@/lib/extractors";
import { MediaResultCard } from "./MediaResultCard";

export function DownloadForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MediaMetadata | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<string>("unknown");

  useEffect(() => {
    if (url.trim()) {
      setDetectedPlatform(detectPlatform(url));
    } else {
      setDetectedPlatform("unknown");
    }
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setError(null);
      }
    } catch {
      setError("Gagal membaca clipboard. Silakan tempel secara manual.");
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError("Silakan masukkan link video terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/fetch-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const resData: ApiResponse<MediaMetadata> = await response.json();

      if (!resData.success || !resData.data) {
        throw new Error(resData.error || "Gagal memproses link.");
      }

      setResult(resData.data);
    } catch (err: any) {
      setError(
        err.message || "Gagal mengambil data video. Pastikan link dapat diakses publik."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setError(null);
    setDetectedPlatform("unknown");
  };

  return (
    <div className="w-full">
      {!result && (
        <div className="mx-auto w-full max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="retro-box flex flex-col gap-2 p-2.5 sm:flex-row sm:items-center sm:p-3"
          >
            <div className="relative flex flex-1 items-center">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Tempel link TikTok, IG Reels, atau YouTube..."
                className="w-full bg-black py-2.5 pr-20 pl-3 font-mono text-xs text-white placeholder-zinc-500 outline-none focus:bg-zinc-950 sm:text-sm"
                disabled={loading}
              />

              <div className="absolute right-2 flex items-center gap-1">
                {url ? (
                  <button
                    type="button"
                    onClick={() => {
                      setUrl("");
                      setError(null);
                    }}
                    className="border border-white/40 bg-zinc-900 px-2 py-1 font-mono text-[11px] font-bold text-zinc-300 hover:bg-white hover:text-black"
                  >
                    CLEAR
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="border border-white/40 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] font-bold text-zinc-300 hover:bg-white hover:text-black"
                  >
                    PASTE
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="retro-btn h-11 px-6 font-mono text-xs font-black uppercase disabled:opacity-40"
            >
              {loading ? "PROSES..." : "DOWNLOAD"}
            </button>
          </form>

          {/* Platform Status */}
          <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <span>TARGET:</span>
              <span className="border border-white bg-white px-1.5 py-0.2 font-bold text-black uppercase">
                {detectedPlatform === "unknown" ? "AUTO DETECT" : detectedPlatform}
              </span>
            </div>
            <span>[NO WATERMARK]</span>
          </div>

          {/* Error Box */}
          {error && (
            <div className="retro-box mt-4 border-white bg-black p-3.5 font-mono text-xs text-white">
              <span className="font-bold underline">[ERROR]:</span> {error}
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="retro-box mt-6 p-6 text-center font-mono text-xs text-zinc-400">
              <p className="animate-pulse font-bold text-white">
                [&gt;] SEDANG MENGAMBIL DATA MEDIA DARI SERVER...
              </p>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="mx-auto max-w-3xl">
          <MediaResultCard data={result} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
