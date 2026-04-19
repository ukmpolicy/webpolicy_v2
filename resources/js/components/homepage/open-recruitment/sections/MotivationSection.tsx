import React from 'react';

import FormTextField from '../fields/FormTextField';
import FormTextareaField from '../fields/FormTextareaField';

interface MotivationValues {
    soft_skill: string;
    pengalaman_organisasi: string;
    motivasi: string;
    motto: string;
}

interface MotivationSectionProps {
    values: MotivationValues;
    onChange: (field: keyof MotivationValues, value: string) => void;
}

const MotivationSection: React.FC<MotivationSectionProps> = ({ values, onChange }) => {
    return (
        <section className="space-y-8">
            <div className="space-y-3">
                <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400">
                    Step 2
                </span>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                        Profil dan Motivasi
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                        Ceritakan kemampuan, pengalaman, dan alasan kamu ingin bergabung. Bagian ini
                        penting untuk menunjukkan siapa kamu, bukan sekadar formalitas yang diisi sambil
                        setengah ngantuk.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <FormTextareaField
                    id="soft_skill"
                    label="Soft Skill"
                    value={values.soft_skill}
                    onChange={(value) => onChange('soft_skill', value)}
                    placeholder="Jelaskan soft skill yang kamu miliki, misalnya komunikasi, kerja tim, problem solving, atau public speaking."
                    rows={5}
                    required
                />

                <FormTextareaField
                    id="pengalaman_organisasi"
                    label="Pengalaman Organisasi (Opsional)"
                    value={values.pengalaman_organisasi}
                    onChange={(value) => onChange('pengalaman_organisasi', value)}
                    placeholder="Tuliskan pengalaman organisasi yang pernah kamu ikuti, baik di kampus, sekolah, maupun di luar. (Kosongkan jika tidak ada)"
                    rows={5}
                />

                <FormTextareaField
                    id="motivasi"
                    label="Motivasi Bergabung"
                    value={values.motivasi}
                    onChange={(value) => onChange('motivasi', value)}
                    placeholder="Jelaskan alasan dan motivasi kamu mengikuti Open Recruitment UKM-POLICY."
                    rows={6}
                    required
                />

                <FormTextField
                    id="motto"
                    label="Motto Hidup"
                    value={values.motto}
                    onChange={(value) => onChange('motto', value)}
                    placeholder="Tuliskan motto hidup kamu"
                    required
                />
            </div>
        </section>
    );
};

export default MotivationSection;