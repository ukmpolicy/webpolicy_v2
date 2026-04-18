import React from 'react';

import FormFileField from '../fields/FormFileField';

interface SocialRequirementValues {
    follow_ig: File | null;
    follow_tiktok: File | null;
    follow_yt: File | null;
}

interface SocialRequirementSectionProps {
    values: SocialRequirementValues;
    onChange: (field: keyof SocialRequirementValues, value: File | null) => void;
}

const SocialRequirementSection: React.FC<SocialRequirementSectionProps> = ({ values, onChange }) => {
    return (
        <section className="space-y-8">
            <div className="space-y-3">
                <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400">
                    Step 4
                </span>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                        Bukti Persyaratan Sosial Media
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                        Unggah bukti follow atau subscribe sesuai persyaratan Open Recruitment.
                        Iya, yang benar-benar jelas ya, bukan screenshot buram hasil crop setengah hati.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <FormFileField
                    id="follow_ig"
                    label="Bukti Follow Instagram"
                    file={values.follow_ig}
                    onChange={(file) => onChange('follow_ig', file)}
                    helperText="Unggah screenshot bukti follow akun Instagram UKM-POLICY."
                    accept=".jpg,.jpeg,.png"
                    required
                />

                <FormFileField
                    id="follow_tiktok"
                    label="Bukti Follow TikTok"
                    file={values.follow_tiktok}
                    onChange={(file) => onChange('follow_tiktok', file)}
                    helperText="Unggah screenshot bukti follow akun TikTok UKM-POLICY."
                    accept=".jpg,.jpeg,.png"
                    required
                />

                <div className="lg:col-span-2">
                    <FormFileField
                        id="follow_yt"
                        label="Bukti Subscribe YouTube"
                        file={values.follow_yt}
                        onChange={(file) => onChange('follow_yt', file)}
                        helperText="Unggah screenshot bukti subscribe kanal YouTube UKM-POLICY."
                        accept=".jpg,.jpeg,.png"
                        required
                    />
                </div>
            </div>
        </section>
    );
};

export default SocialRequirementSection;