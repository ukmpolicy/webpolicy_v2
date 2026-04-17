import FormTextareaField from '../fields/FormTextareaField';
import type { OpenRecruitmentFormData, OpenRecruitmentFormErrors } from '../types';

type QuestionnaireSectionProps = {
    data: OpenRecruitmentFormData;
    errors: OpenRecruitmentFormErrors;
    setData: <K extends keyof OpenRecruitmentFormData>(key: K, value: OpenRecruitmentFormData[K]) => void;
};

export default function QuestionnaireSection({ data, errors, setData }: QuestionnaireSectionProps) {
    return (
        <section className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Kuisioner Pendaftaran</h2>
                <p className="text-sm text-muted-foreground">
                    Jawab seluruh pertanyaan berikut dengan jujur, jelas, dan lengkap.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <FormTextareaField
                    id="deskripsi_diri"
                    name="deskripsi_diri"
                    label="1. Deskripsikan diri anda dan ceritakan secara singkat"
                    value={data.deskripsi_diri}
                    onChange={(value) => setData('deskripsi_diri', value)}
                    error={errors.deskripsi_diri}
                    placeholder="Tuliskan deskripsi singkat tentang diri kamu"
                    rows={6}
                    required
                />

                <FormTextareaField
                    id="alasan_bergabung"
                    name="alasan_bergabung"
                    label="2. Apa alasan serta tujuan ingin bergabung di UKM-POLICY?"
                    value={data.alasan_bergabung}
                    onChange={(value) => setData('alasan_bergabung', value)}
                    error={errors.alasan_bergabung}
                    placeholder="Jelaskan alasan dan tujuan kamu bergabung"
                    rows={6}
                    required
                />

                <FormTextareaField
                    id="makna_logo"
                    name="makna_logo"
                    label="3. Jelaskan makna logo UKM-POLICY"
                    value={data.makna_logo}
                    onChange={(value) => setData('makna_logo', value)}
                    error={errors.makna_logo}
                    placeholder="Jelaskan pemahaman kamu tentang makna logo UKM-POLICY"
                    rows={6}
                    required
                />

                <FormTextareaField
                    id="visi_misi"
                    name="visi_misi"
                    label="4. Sebutkan visi dan misi UKM-POLICY"
                    value={data.visi_misi}
                    onChange={(value) => setData('visi_misi', value)}
                    error={errors.visi_misi}
                    placeholder="Tuliskan visi dan misi UKM-POLICY yang kamu ketahui"
                    rows={6}
                    required
                />

                <FormTextareaField
                    id="sejarah_ukm"
                    name="sejarah_ukm"
                    label="5. Jelaskan sejarah terbentuknya UKM-POLICY"
                    value={data.sejarah_ukm}
                    onChange={(value) => setData('sejarah_ukm', value)}
                    error={errors.sejarah_ukm}
                    placeholder="Tuliskan sejarah singkat terbentuknya UKM-POLICY"
                    rows={6}
                    required
                />

                <FormTextareaField
                    id="pengetahuan_linux"
                    name="pengetahuan_linux"
                    label="6. Apa yang kamu ketahui tentang Linux dan Open Source?"
                    value={data.pengetahuan_linux}
                    onChange={(value) => setData('pengetahuan_linux', value)}
                    error={errors.pengetahuan_linux}
                    placeholder="Jelaskan pengetahuan kamu tentang Linux dan Open Source"
                    rows={6}
                    required
                />
            </div>
        </section>
    );
}