"use client";

import Link from "next/link";
import { IconBolt, IconBrandTiktok, IconBrandInstagram, IconBrandYoutube } from "@tabler/icons-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 outline-none">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md shadow-indigo-500/20 ring-1 ring-white/20 transition-transform group-hover:scale-105 active:scale-95">
            <IconBolt className="size-5 text-white" stroke={2.2} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">Save<span className="text-indigo-400">Aja</span></span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 ring-1 ring-indigo-500/30">
                v1.0
              </span>
            </div>
            <span className="hidden text-[10px] text-zinc-400 sm:inline">Universal Video & Audio Downloader</span>
          </div>
        </Link>

        {/* Supported Platform Badges */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/90 px-3 py-1 text-xs text-zinc-300">
            <IconBrandTiktok className="size-3.5 text-rose-400" />
            <span>TikTok</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/90 px-3 py-1 text-xs text-zinc-300">
            <IconBrandInstagram className="size-3.5 text-pink-400" />
            <span>Instagram</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/90 px-3 py-1 text-xs text-zinc-300">
            <IconBrandYoutube className="size-3.5 text-red-500" />
            <span>YouTube</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span>Server Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
