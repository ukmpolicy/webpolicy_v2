import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion'; // MODIFIKASI: Import motion
import { ChevronRight } from 'lucide-react'; // Import ikon ChevronRight
import React from 'react';

const DocumentationHeader: React.FC = () => {
    // MODIFIKASI: Varian animasi untuk elemen-elemen
    const fadeInSlideUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    return (
        // py-8 di section ini akan memberikan padding atas dan bawah untuk header secara keseluruhan
        // MODIFIKASI: Bungkus section dengan motion.section
        <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeInSlideUp} // Animasi untuk section keseluruhan
            className="relative overflow-hidden bg-black py-12"
        >
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-red-600/40 opacity-40 blur-[120px]" />
                <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-white/10 opacity-10 blur-2xl" />
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {' '}
                {/* Container untuk konten utama */}
                {/* Sesuaikan padding-top dan padding-bottom agar mirip dengan halaman berita */}
                <div className="pt-12 pb-6 text-left md:pt-20">
                    {/* Breadcrumb: Home > Dokumentasi */}
                    {/* MODIFIKASI: div breadcrumb dibungkus motion.div */}
                    <motion.div variants={textVariants} className="mb-6 flex items-center text-xs md:text-sm">
                        {' '}
                        {/* Menggunakan mb-6 seperti berita */}
                        <Link href="/" className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400">
                            Beranda
                        </Link>
                        <ChevronRight className="mx-2 h-4 w-4 text-white/60" /> {/* Ikon panah */}
                        <span className="font-bold text-red-500">Dokumentasi</span>
                    </motion.div>
                    {/* Judul Utama: DOKUMENTASI */}
                    {/* MODIFIKASI: h1 judul dibungkus motion.h1 */}
                    <motion.h1
                        variants={textVariants}
                        className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl"
                    >
                        DOKUMENTASI
                    </motion.h1>{' '}
                    {/* Menggunakan mb-2 seperti berita */}
                    {/* Deskripsi */}
                    {/* MODIFIKASI: p deskripsi dibungkus motion.p */}
                    <motion.p variants={textVariants} className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                        Galeri Kegiatan UKM POLICY
                    </motion.p>
                </div>
            </div>
            <div className="w-full border-t border-neutral-800 px-4 sm:px-6 lg:px-8"></div> {/* Garis pemisah */}
        </motion.section>
    );
};

export default DocumentationHeader;
