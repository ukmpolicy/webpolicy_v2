import { ChevronRight } from "lucide-react";
import { Link } from '@inertiajs/react';
import { motion } from "framer-motion";
import React from "react";

export default function SectionLabel() {
  return (
    <section className="relative overflow-hidden text-white bg-black py-8 text-left border-b border-white/10">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-red-600/40 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl opacity-10" />
      </div>

      {/* Konten Utama */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-0 pb-0 text-left md:pt-0"
        >
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center text-xs md:text-sm">
            <Link
              href="/"
              className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400"
            >
              Home
            </Link>
            <ChevronRight className="mx-2 h-4 w-4 text-white/60" />
            <span className="font-bold text-red-500">Dokumentasi</span>
          </div>

          {/* Judul dan Deskripsi */}
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl">
            Dokumentasi
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Gallery Kegiatan UKM POLICY
          </p>
        </motion.div>
      </div>
    </section>
  );
}
