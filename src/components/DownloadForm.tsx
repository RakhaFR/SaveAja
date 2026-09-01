"use client";

import { useState, useTransition, useEffect } from "react";
import {
  IconLink,
  IconClipboard,
  IconArrowRight,
  IconX,
  IconLoader2,
  IconAlertCircle,
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandYoutube,
  IconSparkles,
} from "@tabler/icons-react";
import { MediaMetadata, ApiResponse } from "@/lib/types";
import { detectPlatform } from "@/lib/extractors";
import { MediaResultCard } from "./MediaResultCard";

export function DownloadForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MediaMetadata | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<string>("unknown");

  // Track platform change in real-time as user types/pastes
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
      {/* Search / Input Box */}
      {!result && (
        <div className="relative mx-auto w-full max-w-2xl">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-pink-500/20 blur-lg transition duration-500 group-hover:opacity-100" />

          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/90 p-2 shadow-2xl backdrop-blur-xl transition-all sm:flex-row sm:items-center sm:gap-2 sm:p-2.5"
          >
            <div className="relative flex flex-1 items-center">
              <div className="pointer-events-none absolute left-3 flex items-center justify-center text-zinc-400">
                <IconLink className="size-5" />
              </div>

              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Tempel link TikTok, Instagram Reels, atau YouTube di sini..."
                className="w-full rounded-xl bg-transparent py-3 pr-20 pl-10 text-sm font-medium text-white placeholder-zinc-500 outline-none transition-colors focus:placeholder-zinc-400 sm:text-base"
                disabled={loading}
              />

              {/* Right Side Input Controls (Clear / Paste) */}
              <div className="absolute right-2 flex items-center gap-1">
                {url ? (
                  <button
                    type="button"
                    onClick={() => {
                      setUrl("");
                      setError(null);
                    }}
                    className="flex size-7 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  >
                    <IconX className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-zinc-800/90 px-2.5 py-1 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
                  >
                    <IconClipboard className="size-3.5 text-indigo-400" />
                    <span>Paste</span>
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95 disabled:pointer-events-none disabled:opacity-40 sm:h-12"
            >
              {loading ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Download</span>
                  <IconArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Platform Indicator Indicator Badges */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <span>Platform Terdeteksi:</span>
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium transition-all ${
                  detectedPlatform === "tiktok"
                    ? "bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40"
                    : detectedPlatform === "instagram"
                    ? "bg-pink-500/20 text-pink-300 ring-1 ring-pink-500/40"
                    : detectedPlatform === "youtube"
                    ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/40"
                    : "bg-zinc-800/50 text-zinc-500"
                }`}
              >
                {detectedPlatform === "tiktok" && <IconBrandTiktok className="size-3" />}
                {detectedPlatform === "instagram" && <IconBrandInstagram className="size-3" />}
                {detectedPlatform === "youtube" && <IconBrandYoutube className="size-3" />}
                {detectedPlatform === "unknown"
                  ? "Menunggu link..."
                  : detectedPlatform.toUpperCase()}
              </span>
            </div>

            <span className="text-[11px] text-zinc-500">
              ⚡ 100% Gratis & Tanpa Iklan Pop-up
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-200 backdrop-blur-md">
              <IconAlertCircle className="size-4 shrink-0 text-rose-400" />
              <div className="flex-1">
                <p className="font-semibold text-rose-300">Gagal Mengunduh</p>
                <p className="mt-0.5 text-rose-200/90">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="mt-6 animate-pulse rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-zinc-800" />
                <div className="h-4 w-40 rounded bg-zinc-800" />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="aspect-video rounded-xl bg-zinc-800 md:col-span-5" />
                <div className="space-y-3 md:col-span-7">
                  <div className="h-5 w-3/4 rounded bg-zinc-800" />
                  <div className="h-4 w-1/2 rounded bg-zinc-800" />
                  <div className="h-10 w-full rounded bg-zinc-800" />
                  <div className="h-10 w-full rounded bg-zinc-800" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="mx-auto max-w-3xl">
          <MediaResultCard data={result} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
