import Link from "next/link";
import { IconBolt, IconHeart } from "@tabler/icons-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-zinc-950/80 py-8 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-zinc-500 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-indigo-600">
            <IconBolt className="size-3.5 text-white" />
          </div>
          <span className="font-semibold text-zinc-300">SaveAja</span>
          <span>© {new Date().getFullYear()} - All rights reserved.</span>
        </div>

        <div className="flex items-center gap-1 text-zinc-400">
          <span>Dibuat dengan</span>
          <IconHeart className="size-3.5 text-rose-500 fill-rose-500" />
          <span>untuk kemudahan download media</span>
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          <span className="hover:text-white transition-colors cursor-pointer">Privasi</span>
          <span className="hover:text-white transition-colors cursor-pointer">Syarat & Ketentuan</span>
          <span className="hover:text-white transition-colors cursor-pointer">Kontak</span>
        </div>
      </div>
    </footer>
  );
}
