import React from 'react';

import FormTextareaField from '../fields/FormTextareaField';

interface QuestionnaireValues {
    deskripsi_diri: string;
    alasan_bergabung: string;
    makna_logo: string;
    visi_misi: string;
    sejarah_ukm: string;
    pengetahuan_linux: string;
}

interface QuestionnaireSectionProps {
    values: QuestionnaireValues;
    onChange: (field: keyof QuestionnaireValues, value: string) => void;
}

const QuestionnaireSection: React.FC<QuestionnaireSectionProps> = ({ values, onChange }) => {
    return (
        <section className="space-y-8">
            <div className="space-y-3">
                <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400">
                    Step 3
                </span>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                        Kuisioner Pendaftaran
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                        Jawab seluruh pertanyaan berikut dengan jujur dan jelas. Ini bukan lomba
                        menulis paling panjang, tapi juga jangan terlalu hemat kata sampai seperti
                        caption tugas kelompok.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <FormTextareaField
                    id="deskripsi_diri"
                    label="1. Deskripsikan diri anda dan ceritakan secara singkat"
                    value={values.deskripsi_diri}
                    onChange={(value) => onChange('deskripsi_diri', value)}
                    placeholder="Ceritakan siapa diri kamu, latar belakangmu, dan hal penting yang perlu diketahui tentang dirimu."
                    rows={6}
                    required
                />

                <FormTextareaField
                    id="alasan_bergabung"
                    label="2. Apa alasan serta tujuan ingin bergabung di UKM-POLICY?"
                    value={values.alasan_bergabung}
                    onChange={(value) => onChange('alasan_bergabung', value)}
                    placeholder="Jelaskan alasan dan tujuan kamu ingin bergabung di UKM-POLICY."
                    rows={6}
                    required
                />

                <FormTextareaField
                    id="makna_logo"
                    label="3. Jelaskan makna logo UKM-POLICY"
                    value={values.makna_logo}
                    onChange={(value) => onChange('makna_logo', value)}
                    placeholder="Tuliskan pemahamanmu tentang makna logo UKM-POLICY."
                    rows={6}
                    required
                />

                <FormTextareaField
                    id="visi_misi"
                    label="4. Sebutkan visi dan misi UKM-POLICY"
                    value={values.visi_misi}
                    onChange={(value) => onChange('visi_misi', value)}
                    placeholder="Tuliskan visi dan misi UKM-POLICY yang kamu ketahui."
                    rows={6}
                    required
                />

                <FormTextareaField
                    id="sejarah_ukm"
                    label="5. Jelaskan sejarah terbentuknya UKM-POLICY"
                    value={values.sejarah_ukm}
                    onChange={(value) => onChange('sejarah_ukm', value)}
                    placeholder="Ceritakan sejarah terbentuknya UKM-POLICY sesuai pemahamanmu."
                    rows={6}
                    required
                />

                <FormTextareaField
                    id="pengetahuan_linux"
                    label="6. Apa yang kamu ketahui tentang Linux dan Open Source?"
                    value={values.pengetahuan_linux}
                    onChange={(value) => onChange('pengetahuan_linux', value)}
                    placeholder="Jelaskan pemahamanmu tentang Linux, open source, dan hal-hal yang kamu ketahui terkait keduanya."
                    rows={6}
                    required
                />
            </div>
        </section>
    );
};

export default QuestionnaireSection;