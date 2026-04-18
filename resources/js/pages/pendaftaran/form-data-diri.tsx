import { Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import FormActions from '@/components/homepage/open-recruitment/FormActions';
import StepIndicator from '@/components/homepage/open-recruitment/StepIndicator';
import PersonalDataSection from '@/components/homepage/open-recruitment/sections/PersonalDataSection';
import MotivationSection from '@/components/homepage/open-recruitment/sections/MotivationSection';

interface FormDataDiriProps {
    period: any;
    pendaftaran: any;
}

const FormDataDiri: React.FC<FormDataDiriProps> = ({ period, pendaftaran }) => {
    useEffect(() => {
        document.body.classList.add('public-theme');
        return () => {
            document.body.classList.remove('public-theme');
        };
    }, []);

    const draftKey = `draft_data_diri_${period?.id || 'default'}`;

    const getDraft = () => {
        try {
            const draft = localStorage.getItem(draftKey);
            return draft ? JSON.parse(draft) : null;
        } catch {
            return null;
        }
    };

    const draft = getDraft();

    const { data, setData, post, processing, errors } = useForm({
        nama: pendaftaran?.nama || draft?.nama || '',
        nim: pendaftaran?.nim || draft?.nim || '',
        jurusan: pendaftaran?.jurusan || draft?.jurusan || '',
        prodi: pendaftaran?.prodi || draft?.prodi || '',
        alamat: pendaftaran?.alamat || draft?.alamat || '',
        tgl_lahir: pendaftaran?.tgl_lahir || draft?.tgl_lahir || '',
        tempat_lahir: pendaftaran?.tempat_lahir || draft?.tempat_lahir || '',
        jenis_kelamin: pendaftaran?.jenis_kelamin || draft?.jenis_kelamin || '',
        agama: pendaftaran?.agama || draft?.agama || '',
        no_wa: pendaftaran?.no_wa || draft?.no_wa || '',
        email: pendaftaran?.email || draft?.email || '',
        soft_skill: draft?.soft_skill || '', 
        pengalaman_organisasi: pendaftaran?.pengalaman_organisasi || draft?.pengalaman_organisasi || '',
        motivasi: pendaftaran?.motivasi || draft?.motivasi || '',
        motto: pendaftaran?.motto || draft?.motto || '',
    });

    useEffect(() => {
        localStorage.setItem(draftKey, JSON.stringify(data));
    }, [data, draftKey]);

    const handleTextChange = (field: string, value: string) => {
        setData(field as any, value);
    };

    const handleSubmit = () => {
        post(route('pendaftaran.simpan-data-diri'));
    };

    return (
        <>
            <Head title="Data Diri - Open Recruitment" />
            <AppHeader isBirthday={false} />

            <main className="min-h-screen bg-black pt-18 text-white">
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,53,69,0.18),transparent_40%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.9))]" />

                    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                        <div className="max-w-3xl space-y-4">
                            <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                                Step 1: Data Diri & Motivasi
                            </h1>
                            <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                                Lengkapi identitas dan motivasi kamu sebelum lanjut mengunggah berkas.
                            </p>
                            
                            {Object.keys(errors).length > 0 && (
                                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 text-sm">
                                    <ul className="list-disc pl-5">
                                        {Object.values(errors).map((err, idx) => (
                                            <li key={idx}>{(err as string)}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm sm:p-6 lg:p-8 space-y-12">
                            {/* KOMPONEN PERSONAL DATA */}
                            <PersonalDataSection values={data as any} onChange={handleTextChange} />
                            
                            {/* KOMPONEN MOTIVASI */}
                            {/* Karena di SPA dipisah Step 1 dan 2, di multi-page kita gabung di halaman pertama agar sesuai dengan Controller yang menyimpan Data Diri dan Motivasi sekaligus */}
                            <MotivationSection values={data as any} onChange={handleTextChange} />
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <div/>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-red-600 px-8 py-3.5 font-bold text-white shadow-[0_0_40px_rgba(220,53,69,0.4)] transition-all duration-300 hover:scale-105 hover:bg-red-500 hover:shadow-[0_0_60px_rgba(220,53,69,0.6)] disabled:opacity-50"
                            >
                                <span className="relative z-10">{processing ? 'Menyimpan...' : 'Simpan & Lanjut'}</span>
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
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                                <div className="absolute inset-0 z-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 transition-opacity duration-300 group-hover:animate-shimmer group-hover:opacity-100" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <AppFooter />
        </>
    );
};

export default FormDataDiri;
