import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react'; // Import ikon ChevronRight
import React from 'react';

const DocumentationHeader: React.FC = () => {
    return (
        // py-8 di section ini akan memberikan padding atas dan bawah untuk header secara keseluruhan
        <section className="relative overflow-hidden bg-black py-8">
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
                    <div className="mb-6 flex items-center text-xs md:text-sm">
                        {' '}
                        {/* Menggunakan mb-6 seperti berita */}
                        <Link href="/" className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400">
                            Beranda
                        </Link>
                        <ChevronRight className="mx-2 h-4 w-4 text-white/60" /> {/* Ikon panah */}
                        <span className="font-bold text-red-500">Dokumentasi</span>
                    </div>
                    {/* Judul Utama: DOKUMENTASI */}
                    <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl">DOKUMENTASI</h1>{' '}
                    {/* Menggunakan mb-2 seperti berita */}
                    {/* Deskripsi */}
                    <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">Galeri Kegiatan UKM POLICY</p>
                </div>
            </div>
            <div className="w-full border-t border-neutral-800 px-4 sm:px-6 lg:px-8"></div> {/* Garis pemisah */}
        </section>
    );
};

export default DocumentationHeader;
