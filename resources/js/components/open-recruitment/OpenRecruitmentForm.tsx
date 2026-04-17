import FormActions from './FormActions';
import StepIndicator from './StepIndicator';
import type { Period } from './types';
import useOpenRecruitmentForm from './hooks/useOpenRecruitmentForm';
import DocumentUploadSection from './sections/DocumentUploadSection';
import MotivationSection from './sections/MotivationSection';
import PersonalDataSection from './sections/PersonalDataSection';
import QuestionnaireSection from './sections/QuestionnaireSection';
import ReviewSection from './sections/ReviewSection';
import SocialRequirementSection from './sections/SocialRequirementSection';

type OpenRecruitmentFormProps = {
    period: Period | null;
};

function formatDateTime(value: string | null) {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

function InfoStep({ period }: { period: Period | null }) {
    return (
        <section className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Informasi Open Recruitment</h2>
                <p className="text-sm text-muted-foreground">
                    Baca informasi berikut sebelum mulai mengisi form pendaftaran.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status OR</p>
                    <p className="mt-2 text-sm font-medium">
                        {period?.is_open_recruitment ? 'Open Recruitment tersedia' : 'Belum ada status OR aktif'}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Kuota</p>
                    <p className="mt-2 text-sm font-medium">
                        {period?.recruitment_quota ? `${period.recruitment_quota} peserta` : 'Belum ditentukan'}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mulai Pendaftaran</p>
                    <p className="mt-2 text-sm font-medium">{formatDateTime(period?.recruitment_started_at ?? null)}</p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Akhir Pendaftaran</p>
                    <p className="mt-2 text-sm font-medium">{formatDateTime(period?.recruitment_ended_at ?? null)}</p>
                </div>
            </div>

            <div className="rounded-xl border p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Deskripsi</p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                    {period?.recruitment_description?.trim()
                        ? period.recruitment_description
                        : 'Deskripsi open recruitment belum tersedia.'}
                </p>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <h3 className="text-sm font-semibold">Catatan Penting</h3>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p>• Seluruh field pada template ini sementara dianggap wajib diisi.</p>
                    <p>• Format file yang diterima: JPG, JPEG, atau PNG.</p>
                    <p>• Pastikan file jelas dan mudah dibaca sebelum diunggah.</p>
                    <p>• Periksa ulang data pada langkah review sebelum mengirim pendaftaran.</p>
                </div>
            </div>
        </section>
    );
}

export default function OpenRecruitmentForm({ period }: OpenRecruitmentFormProps) {
    const {
        data,
        errors,
        processing,
        currentStep,
        isFirstStep,
        isLastStep,
        setData,
        nextStep,
        prevStep,
        handleSubmit,
    } = useOpenRecruitmentForm(period);

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'info':
                return <InfoStep period={period} />;

            case 'personal-data':
                return <PersonalDataSection data={data} errors={errors} setData={setData} />;

            case 'motivation':
                return <MotivationSection data={data} errors={errors} setData={setData} />;

            case 'questionnaire':
                return <QuestionnaireSection data={data} errors={errors} setData={setData} />;

            case 'documents':
                return (
                    <div className="space-y-8">
                        <SocialRequirementSection data={data} errors={errors} setData={setData} />
                        <DocumentUploadSection data={data} errors={errors} setData={setData} />
                    </div>
                );

            case 'review':
                return <ReviewSection data={data} />;

            default:
                return <InfoStep period={period} />;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <StepIndicator currentStep={currentStep} />

            <div className="rounded-2xl border bg-background p-4 shadow-sm sm:p-6 lg:p-8">
                {renderCurrentStep()}
            </div>

            <FormActions
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                processing={processing}
                onBack={prevStep}
                onNext={nextStep}
            />
        </form>
    );
}