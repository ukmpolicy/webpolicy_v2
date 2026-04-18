import { Head, Link } from '@inertiajs/react';
import React, { useEffect } from 'react';

import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';

interface LandingProps {
    period: any;
    pendaftaran: any;
}

const Landing: React.FC<LandingProps> = ({ period, pendaftaran }) => {
    useEffect(() => {
        document.body.classList.add('public-theme');
        return () => {
            document.body.classList.remove('public-theme');
        };
    }, []);

    // Cek progres
    let continueUrl = route('pendaftaran.data-diri');
    let btnText = 'Mulai Pendaftaran';
    
    if (pendaftaran) {
        // Kalau belum submit form-berkas biasanya ada status dll 
        // Tapi kita arahkan saja dari data awal, atau cek isi pendaftaran jika sudah selesai semua
        continueUrl = route('pendaftaran.data-diri');
        btnText = 'Lanjutkan Pendaftaran';
    }

    return (
        <>
            <Head title="Open Recruitment - UKM POLICY" />
            <AppHeader isBirthday={false} />

            <main className="min-h-screen bg-black pt-18 text-white">
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,53,69,0.18),transparent_40%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.9))]" />

                    <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center min-h-[70vh] gap-8 px-4 py-10 sm:px-6 lg:px-8">
                        <div className="max-w-3xl space-y-6 text-center">
                            <span className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                                Open Recruitment
                            </span>

                            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                                Bergabung dan Tunjukkan Versi Terbaik Dirimu
                            </h1>
                            <p className="mx-auto max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                                Lengkapi formulir pendaftaran Open Recruitment UKM-POLICY dengan data yang benar,
                                jawaban yang jujur, dan dokumen yang sesuai.
                            </p>
                            
                            <div className="pt-8">
                                <Link
                                    href={continueUrl}
                                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-red-600 px-8 py-4 font-bold text-white shadow-[0_0_40px_rgba(220,53,69,0.4)] transition-all duration-300 hover:scale-105 hover:bg-red-500 hover:shadow-[0_0_60px_rgba(220,53,69,0.6)]"
                                >
                                    <span className="relative z-10">{btnText}</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                    <div className="absolute inset-0 z-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 transition-opacity duration-300 group-hover:animate-shimmer group-hover:opacity-100" />
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

export default Landing;
