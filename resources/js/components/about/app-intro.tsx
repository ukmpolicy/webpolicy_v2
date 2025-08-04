import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

export default function AboutIntro() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-2xl p-10 md:p-16"
    >
      <div className="max-w-[1200px] mx-auto grid gap-8 text-left">
        
        <div className="flex items-center space-x-3">
          <Info className="w-10 h-10 text-red-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Apa Itu UKM POLICY?
          </h1>
        </div>

        <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-light">
          <span className="font-medium text-white">
            Unit Kegiatan Mahasiswa Polytechnic Linux Community (UKM POLICY)
          </span>{' '}
          adalah organisasi kemahasiswaan di bawah naungan{' '}
          <span className="text-white font-medium">Politeknik Negeri Lhokseumawe</span> yang
          berfokus pada pengembangan teknologi komputer, khususnya seputar{' '}
          <span className="text-white font-medium">Linux</span> dan{' '}
          <span className="text-white font-medium">Open Source</span>. Organisasi ini menjadi wadah untuk
          meningkatkan literasi teknologi informasi, kolaborasi pengembangan aplikasi, dan edukasi digital
          berbasis perangkat lunak bebas dan terbuka.
        </p>
      </div>
    </motion.section>
  );
}
