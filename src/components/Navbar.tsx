"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-white bg-black">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand with Image Logo Placeholder */}
        <Link href="/" className="group flex items-center gap-3 outline-none">
          <div className="flex size-9 items-center justify-center border-2 border-white bg-black shadow-[2px_2px_0px_0px_#ffffff] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5">
            <img
              src="/logo.svg"
              alt="SaveAja Logo"
              className="size-6 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-lg font-black tracking-tight text-white">
              SAVE<span className="text-zinc-400">AJA</span>
            </span>
          </div>
        </Link>

        {/* Supported Platform Badges in Retro Style */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px]">
          <span className="border border-white/40 bg-zinc-950 px-2 py-0.5 text-zinc-300">
            [TIKTOK]
          </span>
          <span className="border border-white/40 bg-zinc-950 px-2 py-0.5 text-zinc-300">
            [INSTAGRAM]
          </span>
          <span className="border border-white/40 bg-zinc-950 px-2 py-0.5 text-zinc-300">
            [YOUTUBE]
          </span>
        </div>
      </div>
    </header>
  );
}
