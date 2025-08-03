import { Link } from '@inertiajs/react';
import React from 'react';

const DocumentationHeader: React.FC = () => {
    return (
        <section className="relative text-center py-16 bg-zinc-900/50">
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-red-600/30 rounded-full blur-[120px] opacity-30" />
            </div>
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider">Dokumentasi</h1>
                <p className="mt-2 text-gray-400 text-lg">
                    Galeri Kegiatan UKM POLICY
                </p>
                <div className="mt-6 text-base">
                    <Link href="/" className="italic text-white hover:underline">Home</Link>
                    <span className="mx-2 text-white">/</span>
                    <span className="italic text-red-600 font-semibold">Dokumentasi</span>
                </div>
            </div>
        </section>
    );
};

export default DocumentationHeader;
