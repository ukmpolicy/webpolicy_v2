import FormTextField from '../fields/FormTextField';
import FormTextareaField from '../fields/FormTextareaField';
import type { OpenRecruitmentFormData, OpenRecruitmentFormErrors } from '../types';

type MotivationSectionProps = {
    data: OpenRecruitmentFormData;
    errors: OpenRecruitmentFormErrors;
    setData: <K extends keyof OpenRecruitmentFormData>(key: K, value: OpenRecruitmentFormData[K]) => void;
};

export default function MotivationSection({ data, errors, setData }: MotivationSectionProps) {
    return (
        <section className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Profil dan Motivasi</h2>
                <p className="text-sm text-muted-foreground">
                    Jelaskan kemampuan, pengalaman, motivasi, dan prinsip yang kamu pegang.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <FormTextareaField
                    id="soft_skill"
                    name="soft_skill"
                    label="Soft Skill"
                    value={data.soft_skill}
                    onChange={(value) => setData('soft_skill', value)}
                    error={errors.soft_skill}
                    placeholder="Ceritakan soft skill yang kamu miliki"
                    helperText="Contoh: komunikasi, teamwork, problem solving, public speaking."
                    rows={5}
                    required
                />

                <FormTextareaField
                    id="pengalaman_organisasi"
                    name="pengalaman_organisasi"
                    label="Pengalaman Organisasi"
                    value={data.pengalaman_organisasi}
                    onChange={(value) => setData('pengalaman_organisasi', value)}
                    error={errors.pengalaman_organisasi}
                    placeholder="Tuliskan pengalaman organisasi yang pernah kamu ikuti"
                    rows={5}
                    required
                />

                <FormTextareaField
                    id="motivasi"
                    name="motivasi"
                    label="Motivasi Bergabung"
                    value={data.motivasi}
                    onChange={(value) => setData('motivasi', value)}
                    error={errors.motivasi}
                    placeholder="Jelaskan motivasi kamu mengikuti open recruitment ini"
                    rows={6}
                    required
                />

                <FormTextField
                    id="motto"
                    name="motto"
                    label="Motto Hidup"
                    value={data.motto}
                    onChange={(value) => setData('motto', value)}
                    error={errors.motto}
                    placeholder="Tuliskan motto hidup kamu"
                    required
                />
            </div>
        </section>
    );
}