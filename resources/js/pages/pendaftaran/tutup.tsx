import { Head, Link } from '@inertiajs/react';
import React, { useEffect } from 'react';

import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';

const Tutup: React.FC = () => {
    useEffect(() => {
        document.body.classList.add('public-theme');
        return () => {
            document.body.classList.remove('public-theme');
        };
    }, []);

    return (
        <>
            <Head title="Pendaftaran Tutup - Open Recruitment" />
            <AppHeader isBirthday={false} />

            <main className="min-h-screen bg-black pt-18 text-white">
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,53,69,0.18),transparent_40%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.9))]" />

                    <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center min-h-[70vh] gap-8 px-4 py-10 sm:px-6 lg:px-8">
                        <div className="max-w-xl space-y-6 text-center">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                            </div>

                            <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                                Pendaftaran Belum/Sudah Ditutup
                            </h1>
                            <p className="mx-auto max-w-lg text-base leading-7 text-zinc-300">
                                Saat ini tidak ada masa Open Recruitment yang sedang berlangsung. Silakan tunggu informasi pembukaan berikutnya di halaman Beranda.
                            </p>

                            <div className="pt-8">
                                <Link
                                    href="/"
                                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-zinc-800 border border-zinc-700 px-8 py-3.5 font-bold text-white transition-all duration-300 hover:bg-zinc-700"
                                >
                                    <span>Kembali ke Beranda</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <AppFooter />
        </>
    );
};

export default Tutup;
