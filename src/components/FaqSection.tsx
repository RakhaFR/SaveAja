"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      q: "Bagaimana cara mendownload video atau audio dengan SaveAja?",
      a: "Cukup salin (copy) link video dari TikTok, Instagram Reels, atau YouTube, lalu tempel (paste) ke kolom input di atas. Klik tombol Download, pilih format MP4 (Video) atau MP3 (Audio), lalu klik Unduh.",
    },
    {
      q: "Apakah video TikTok yang diunduh bebas watermark?",
      a: "Ya, sistem kami secara otomatis menghapus tanda air / watermark TikTok sehingga Anda mendapatkan file video bersih dalam resolusi HD.",
    },
    {
      q: "Apakah layanan ini 100% gratis?",
      a: "Ya! SaveAja sepenuhnya gratis untuk digunakan tanpa batasan harian, tanpa perlu registrasi, dan tanpa instalasi aplikasi tambahan.",
    },
    {
      q: "Di mana file hasil download akan disimpan?",
      a: "File akan langsung masuk ke folder 'Downloads' atau 'Unduhan' di perangkat komputer/laptop Anda, atau langsung ke galeri / file manager di smartphone Android / iPhone Anda.",
    },
    {
      q: "Mengapa video tertentu tidak bisa diproses?",
      a: "Pastikan video yang Anda masukkan bersifat publik (bukan akun privat / private account) dan link masih aktif dapat diakses.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h2>
        <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
          Semua yang perlu Anda ketahui seputar penggunaan SaveAja.
        </p>
      </div>

      <Accordion className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 backdrop-blur-md transition-colors data-[state=open]:border-indigo-500/30 data-[state=open]:bg-zinc-900/90"
          >
            <AccordionTrigger className="text-left text-sm font-semibold text-zinc-200 hover:text-white hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-xs leading-relaxed text-zinc-400">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
