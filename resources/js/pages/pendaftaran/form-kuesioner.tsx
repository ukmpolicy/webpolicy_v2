import { Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';

interface Pertanyaan {
    id: number;
    urutan: number;
    pertanyaan: string;
    is_active: boolean;
}

interface Jawaban {
    id: number;
    pertanyaan_kuesioner_id: number;
    jawaban: string;
}

interface FormKuesionerProps {
    pendaftaran: any;
    pertanyaan: Pertanyaan[];
    jawaban: Jawaban[];
}

const FormKuesioner: React.FC<FormKuesionerProps> = ({ pendaftaran, pertanyaan, jawaban }) => {
    useEffect(() => {
        document.body.classList.add('public-theme');
        return () => {
            document.body.classList.remove('public-theme');
        };
    }, []);

    // Draft Mechanism
    const draftKey = `draft_kuesioner_${pendaftaran?.period_id || 'default'}`;

    const getDraft = () => {
        try {
            const draft = localStorage.getItem(draftKey);
            return draft ? JSON.parse(draft) : null;
        } catch {
            return null;
        }
    };

    const draft = getDraft();

    // Set form initial state dynamically from frontend
    const initialData: Record<string, string> = {};
    pertanyaan.forEach((p) => {
        const checkExist = jawaban?.find(j => j.pertanyaan_kuesioner_id === p.id);
        const fieldKey = `jawaban_${p.id}`;
        // Prioritas: Data dari database (jika ada), lalu Draft Local Storage, lalu Kosong
        initialData[fieldKey] = checkExist ? checkExist.jawaban : (draft?.[fieldKey] || '');
    });

    const { data, setData, post, processing, errors } = useForm(initialData);

    useEffect(() => {
        localStorage.setItem(draftKey, JSON.stringify(data));
    }, [data, draftKey]);

    const handleTextChange = (field: string, value: string) => {
        setData(field, value);
    };

    const handleSubmit = () => {
        post(route('pendaftaran.simpan-kuesioner'), {
            onSuccess: () => {
                localStorage.removeItem(draftKey);
                localStorage.removeItem(`draft_data_diri_${pendaftaran?.period_id || 'default'}`);
            }
        });
    };

    return (
        <>
            <Head title="Kuesioner - Open Recruitment" />
            <AppHeader isBirthday={false} />

            <main className="min-h-screen bg-black pt-18 text-white">
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,53,69,0.18),transparent_40%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.9))]" />

                    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                        <div className="max-w-3xl space-y-4">
                            <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                                Step 3: Kuesioner Pendaftaran
                            </h1>
                            <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                                Jawablah pertanyaan-pertanyaan ini sesuai dengan opini dan pengetahuanmu. Jangan nyontek AI, karena pasti ujung-ujungnya ketahuan pas interview.
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
                            
                            <div className="space-y-3">
                                <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400">
                                    Studi Kasus & Opini
                                </span>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">Wawasan & Pandangan</h2>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {pertanyaan.map((p, idx) => {
                                    const fieldName = `jawaban_${p.id}`;
                                    return (
                                        <div key={p.id} className="space-y-2">
                                            <label htmlFor={fieldName} className="block text-sm font-bold text-white">
                                                {idx + 1}. {p.pertanyaan} <span className="text-red-500">*</span>
                                            </label>
                                            <p className="text-xs text-zinc-400 leading-relaxed mb-3">Tuliskan jawaban yang jujur dan logis (min 3 karakter).</p>
                                            <div className="relative">
                                                <textarea
                                                    id={fieldName}
                                                    value={data[fieldName]}
                                                    onChange={(e) => handleTextChange(fieldName, e.target.value)}
                                                    required
                                                    rows={4}
                                                    className={`block w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-black/40 border-white/10 transition-colors hover:border-zinc-500`}
                                                    placeholder="Tulis jawabanmu di sini..."
                                                />
                                            </div>
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
                                <span className="relative z-10">{processing ? 'Menyimpan...' : 'Kirim Pendaftaran'}</span>
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
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <AppFooter />
        </>
    );
};

export default FormKuesioner;
