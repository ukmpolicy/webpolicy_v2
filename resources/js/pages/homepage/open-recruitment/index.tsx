import { Head } from '@inertiajs/react';
import React, { useEffect } from 'react';

import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import OpenRecruitmentMultiStepForm from '@/components/homepage/open-recruitment/OpenRecruitmentMultiStepForm';

interface OpenRecruitmentPageProps {
    isBirthday?: boolean;
}

const OpenRecruitmentPage: React.FC<OpenRecruitmentPageProps> = ({ isBirthday = false }) => {
    useEffect(() => {
        document.body.classList.add('public-theme');

        return () => {
            document.body.classList.remove('public-theme');
        };
    }, []);

    return (
        <>
            <Head title="Open Recruitment - UKM POLICY" />

            <AppHeader isBirthday={isBirthday} />

            <main className="min-h-screen bg-black pt-18 text-white">
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,53,69,0.18),transparent_40%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.9))]" />

                    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                        <div className="max-w-3xl space-y-4">
                            <span className="inline-flex w-fit rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                                Open Recruitment
                            </span>

                            <div className="space-y-3">
                                <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                                    Bergabung dan Tunjukkan Versi Terbaik Dirimu
                                </h1>
                                <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                                    Lengkapi formulir pendaftaran Open Recruitment UKM-POLICY dengan data yang benar,
                                    jawaban yang jujur, dan dokumen yang sesuai. Biar prosesnya rapi, meski dunia
                                    tidak selalu begitu.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm sm:p-6 lg:p-8">
                            <OpenRecruitmentMultiStepForm />
                        </div>
                    </div>
                </section>
            </main>

            <AppFooter />
        </>
    );
};

export default OpenRecruitmentPage;