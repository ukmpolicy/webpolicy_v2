import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function SectionLabel() {
    return (
        <section className="relative overflow-hidden bg-black py-8 text-left text-white">
            {/* Background Blobs */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-red-600/40 opacity-40 blur-[120px]" />
                <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-white/10 opacity-10 blur-2xl" />
            </div>

            {/* Konten Utama */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="pt-0 pb-0 text-left md:pt-0"
                >
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center text-xs md:text-sm">
                        <Link href={route('home')} className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400">
                            Beranda
                        </Link>
                        <ChevronRight className="mx-2 h-4 w-4 text-white/60" />
                        <span className="font-bold text-red-500">Tentang</span>
                    </div>

                    {/* Judul dan Deskripsi */}
                    <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl">Pengenalan</h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">Pengenalan singkat tentang UKM POLICY</p>
                </motion.div>
            </div>
        </section>
    );
}
