import React from "react";

export default function SectionLabel() {
  return (
    <section className="relative overflow-hidden text-white bg-black py-16 text-center">
      {/* Background Blobs (sama seperti Hero) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-red-600/40 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl opacity-10" />
      </div>

      {/* Konten Utama */}
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold uppercase">Introduction</h1>
        <p className="mt-2 text-gray-400 text-lg">
          Mari Mengenal UKM-POLICY Lebih Jauh
        </p>
        <div className="mt-6 text-base md:text-lg">
          <span className="italic text-white">Home</span>
          <span className="mx-2 text-white">/</span>
          <span className="italic text-red-600 font-semibold">Tentang</span>
        </div>
      </div>
    </section>
  );
}
