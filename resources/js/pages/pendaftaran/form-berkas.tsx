import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import FormFileField from '@/components/homepage/open-recruitment/fields/FormFileField';

interface JenisBerkas {
    id: number;
    nama: string;
    label: string;
    keterangan: string;
    is_required: boolean;
}

interface DokumenPendaftaran {
    id: number;
    jenis_berkas_id: number;
    file_path: string;
}

interface FormBerkasProps {
    pendaftaran: any;
    jenisBerkas: JenisBerkas[];
    dokumen: DokumenPendaftaran[];
}

const FormBerkas: React.FC<FormBerkasProps> = ({ pendaftaran, jenisBerkas, dokumen }) => {
    useEffect(() => {
        document.body.classList.add('public-theme');
        return () => {
            document.body.classList.remove('public-theme');
        };
    }, []);

    // Inisialisasi initial data form secara dinamis
    const initialData: Record<string, File | null> = {};
    jenisBerkas.forEach((jb) => {
        initialData[`berkas_${jb.id}`] = null;
    });

    const { data, setData, post, processing, errors } = useForm(initialData);

    const handleFileChange = (field: string, value: File | null) => {
        setData(field, value);
    };

    const handleSubmit = () => {
        post(route('pendaftaran.upload-berkas'));
    };

    // Fungsi cek apa file sudah pernah diupload
    const getUploadedDoc = (jbId: number) => {
        return dokumen?.find((d) => d.jenis_berkas_id === jbId);
    };

    return (
        <>
            <Head title="Upload Berkas - Open Recruitment" />
            <AppHeader isBirthday={false} />

            <main className="min-h-screen bg-black pt-18 text-white">
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,53,69,0.18),transparent_40%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.9))]" />

                    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                        <div className="max-w-3xl space-y-4">
                            <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                                Step 2: Upload Berkas
                            </h1>
                            <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                                Unggah dokumen persyaratan pendaftaran dengan format yang benar (Maks 5MB).
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

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm sm:p-6 lg:p-8 space-y-8">
                            
                            <div className="space-y-3">
                                <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400">
                                    Dokumen Administrasi & Sosial Media
                                </span>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">Pemberkasan</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                {jenisBerkas.map((jb) => {
                                    const fileKey = `berkas_${jb.id}`;
                                    const uploaded = getUploadedDoc(jb.id);
                                    
                                    // Bikin label tambahan kalo udah ada record di db
                                    const fileLabel = uploaded ? `${jb.label} (Sudah Diunggah)` : jb.label;

                                    return (
                                        <div key={jb.id} className={jb.nama.includes('sertifikat_prestasi') || jb.nama.includes('follow_yt') ? "lg:col-span-2" : ""}>
                                            <FormFileField
                                                id={fileKey}
                                                label={fileLabel}
                                                file={data[fileKey]}
                                                onChange={(file) => handleFileChange(fileKey, file)}
                                                helperText={jb.keterangan}
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                required={jb.is_required && !uploaded} // Wajib jika pengaturan is_required true DAN belum pernah diupload sebelumnya
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <button
                                onClick={() => window.history.back()}
                                className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                <span>Kembali</span>
                            </button>
                            
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-red-600 px-8 py-3.5 font-bold text-white shadow-[0_0_40px_rgba(220,53,69,0.4)] transition-all duration-300 hover:scale-105 hover:bg-red-500 hover:shadow-[0_0_60px_rgba(220,53,69,0.6)] disabled:opacity-50"
                            >
                                <span className="relative z-10">{processing ? 'Mengunggah...' : 'Unggah & Lanjut'}</span>
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
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <AppFooter />
        </>
    );
};

export default FormBerkas;
