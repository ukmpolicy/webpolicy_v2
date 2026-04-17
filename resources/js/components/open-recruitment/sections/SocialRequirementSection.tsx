import FormFileField from '../fields/FormFileField';
import { documentRules } from '../utils/documentRules';
import type { OpenRecruitmentFormData, OpenRecruitmentFormErrors } from '../types';

type SocialRequirementSectionProps = {
    data: OpenRecruitmentFormData;
    errors: OpenRecruitmentFormErrors;
    setData: <K extends keyof OpenRecruitmentFormData>(key: K, value: OpenRecruitmentFormData[K]) => void;
};

export default function SocialRequirementSection({ data, errors, setData }: SocialRequirementSectionProps) {
    return (
        <section className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Bukti Persyaratan Sosial Media</h2>
                <p className="text-sm text-muted-foreground">
                    Unggah screenshot bukti follow atau subscribe sesuai persyaratan open recruitment.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormFileField
                    id="follow_ig"
                    name="follow_ig"
                    label={documentRules.follow_ig.label}
                    file={data.follow_ig}
                    onChange={(file) => setData('follow_ig', file)}
                    error={errors.follow_ig}
                    helperText={documentRules.follow_ig.description}
                    accept={documentRules.follow_ig.accept}
                    maxSizeMb={documentRules.follow_ig.maxSizeMb}
                    required={documentRules.follow_ig.required}
                />

                <FormFileField
                    id="follow_tiktok"
                    name="follow_tiktok"
                    label={documentRules.follow_tiktok.label}
                    file={data.follow_tiktok}
                    onChange={(file) => setData('follow_tiktok', file)}
                    error={errors.follow_tiktok}
                    helperText={documentRules.follow_tiktok.description}
                    accept={documentRules.follow_tiktok.accept}
                    maxSizeMb={documentRules.follow_tiktok.maxSizeMb}
                    required={documentRules.follow_tiktok.required}
                />

                <FormFileField
                    id="follow_yt"
                    name="follow_yt"
                    label={documentRules.follow_yt.label}
                    file={data.follow_yt}
                    onChange={(file) => setData('follow_yt', file)}
                    error={errors.follow_yt}
                    helperText={documentRules.follow_yt.description}
                    accept={documentRules.follow_yt.accept}
                    maxSizeMb={documentRules.follow_yt.maxSizeMb}
                    required={documentRules.follow_yt.required}
                    containerClassName="md:col-span-2"
                />
            </div>
        </section>
    );
}