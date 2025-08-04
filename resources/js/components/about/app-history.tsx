import { motion } from "framer-motion";
import { History } from "lucide-react";

export default function AboutHistory() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="relative bg-gradient-to-b from-zinc-900/70 to-black/80 backdrop-blur-md p-10 md:p-16 rounded-2xl border border-zinc-800 shadow-2xl"
    >
      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-center space-x-3">
          <History className="w-10 h-10 text-red-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Sejarah UKM POLICY
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-6 text-zinc-300 text-base md:text-lg leading-relaxed font-light text-justify">
          <p>
            Pembentukan komunitas Linux di <span className="text-white font-medium">Politeknik Negeri Lhokseumawe</span> mulai direncanakan sejak akhir tahun <span className="font-medium text-white">2006</span> oleh angkatan pertama <span className="font-medium text-white">Teknik Informatika</span>. Saat itu, belajar Linux dan aplikasi open source masih dilakukan sendiri-sendiri dan dalam kelompok kecil.
          </p>

          <p>
            Seiring waktu, Linux makin diminati oleh mahasiswa dan dosen. <span className="text-white font-medium">Munawir</span>, salah satu angkatan pertama, memprakarsai pembentukan komunitas bersama <span className="text-white font-medium">Muhammad Rizka</span>, <span className="text-white font-medium">Fachri</span>, <span className="text-white font-medium">Bagus</span>, <span className="text-white font-medium">Irhas</span>, <span className="text-white font-medium">Zulfahmi</span>, dan <span className="text-white font-medium">Mahendar Dwipayana</span>. Komunitas ini terbuka untuk seluruh civitas akademika Politeknik.
          </p>

          <p>
            Pada <span className="font-medium text-white">13 November 2008</span>, diadakan Rapat Umum yang dihadiri lebih dari 60 peserta. Dalam rapat tersebut disepakati pembentukan komunitas dan penggunaan nama <span className="text-red-400 font-semibold">“POLICY” (Polytechnic Linux Community)</span> sebagai nama resmi organisasi.
          </p>

          <p>
            Sejak saat itu, <span className="font-medium text-white">UKM POLICY</span> resmi berdiri sebagai wadah pengembangan teknologi, open source, dan kolaborasi mahasiswa Politeknik Negeri Lhokseumawe.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
