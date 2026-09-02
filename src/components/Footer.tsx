import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-white bg-black py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 font-mono text-xs text-zinc-400 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">SAVEAJA</span>
          <span>© {new Date().getFullYear()} Rakha FR — All Rights Reserved</span>
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          <span className="hover:text-white transition-colors cursor-pointer">PRIVASI</span>
          <span>/</span>
          <span className="hover:text-white transition-colors cursor-pointer">KETENTUAN</span>
          <span>/</span>
          <span className="hover:text-white transition-colors cursor-pointer">KONTAK</span>
        </div>
      </div>
    </footer>
  );
}
