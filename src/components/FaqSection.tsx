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
      a: "Cukup salin link video dari TikTok, Instagram Reels, atau YouTube, lalu tempel ke kolom input. Klik DOWNLOAD, pilih format MP4 (Video) atau MP3 (Audio), lalu klik Unduh.",
    },
    {
      q: "Apakah video TikTok yang diunduh bebas watermark?",
      a: "Ya, sistem kami secara otomatis menghapus watermark TikTok sehingga Anda mendapatkan file video bersih dalam resolusi HD.",
    },
    {
      q: "Apakah layanan ini 100% gratis?",
      a: "Ya! SaveAja sepenuhnya gratis untuk digunakan tanpa batasan harian dan tanpa perlu registrasi akun.",
    },
    {
      q: "Di mana file hasil download akan disimpan?",
      a: "File akan langsung masuk ke folder Downloads / Unduhan di browser perangkat Anda.",
    },
    {
      q: "Mengapa video tertentu tidak bisa diproses?",
      a: "Pastikan video yang Anda masukkan bersifat publik (bukan akun privat / private account) dan link masih aktif dapat diakses.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
          [ FAQ / PANDUAN ]
        </h2>
        <p className="mt-1 font-mono text-xs text-zinc-400">
          Pertanyaan umum seputar penggunaan SaveAja
        </p>
      </div>

      <Accordion className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="retro-box p-3.5 transition-none"
          >
            <AccordionTrigger className="font-mono text-xs font-bold text-white hover:no-underline sm:text-sm">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-xs leading-relaxed text-zinc-300">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
