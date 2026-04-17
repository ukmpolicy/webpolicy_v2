import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { openRecruitmentInitialValues } from '../utils/initialValues';
import { DEFAULT_STEP, openRecruitmentStepKeys, openRecruitmentSteps } from '../utils/stepConfig';
import type {
    OpenRecruitmentFormData,
    OpenRecruitmentFormErrors,
    OpenRecruitmentPageProps,
    StepKey,
} from '../types';

const SUBMIT_ENDPOINT = '#';

const STEP_FIELDS: Record<Exclude<StepKey, 'info' | 'review'>, (keyof OpenRecruitmentFormData)[]> = {
    'personal-data': [
        'nama',
        'nim',
        'jurusan',
        'prodi',
        'alamat',
        'tgl_lahir',
        'tempat_lahir',
        'jenis_kelamin',
        'agama',
        'no_wa',
        'email',
    ],
    motivation: ['soft_skill', 'pengalaman_organisasi', 'motivasi', 'motto'],
    questionnaire: [
        'deskripsi_diri',
        'alasan_bergabung',
        'makna_logo',
        'visi_misi',
        'sejarah_ukm',
        'pengetahuan_linux',
    ],
    documents: [
        'pas_photo',
        'sertifikat_ppkmb',
        'follow_ig',
        'follow_tiktok',
        'follow_yt',
        'tgl_lahir_doc',
        'bukti_pembayaran',
        'berkas_tambahan_1',
        'berkas_tambahan_2',
    ],
};

function isEmptyValue(value: OpenRecruitmentFormData[keyof OpenRecruitmentFormData]) {
    if (value === null) return true;
    if (typeof value === 'string') return value.trim() === '';
    return false;
}

function buildRequiredErrors(
    step: StepKey,
    data: OpenRecruitmentFormData,
): OpenRecruitmentFormErrors {
    const errors: OpenRecruitmentFormErrors = {};

    if (step === 'info' || step === 'review') {
        return errors;
    }

    const fields = STEP_FIELDS[step];

    fields.forEach((field) => {
        if (isEmptyValue(data[field])) {
            errors[field] = 'Field ini wajib diisi.';
        }
    });

    return errors;
}

export default function useOpenRecruitmentForm(period: OpenRecruitmentPageProps['period']) {
    const form = useForm<OpenRecruitmentFormData>({
        ...openRecruitmentInitialValues,
        period_id: period?.id ?? '',
    });

    const [currentStep, setCurrentStep] = useState<StepKey>(DEFAULT_STEP);
    const [clientErrors, setClientErrors] = useState<OpenRecruitmentFormErrors>({});

    const currentStepIndex = openRecruitmentStepKeys.indexOf(currentStep);
    const totalSteps = openRecruitmentSteps.length;

    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === totalSteps - 1;

    const errors = useMemo<OpenRecruitmentFormErrors>(() => {
        return {
            ...(form.errors as OpenRecruitmentFormErrors),
            ...clientErrors,
        };
    }, [form.errors, clientErrors]);

    const clearFieldError = <K extends keyof OpenRecruitmentFormData>(key: K) => {
        setClientErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const setFieldValue = <K extends keyof OpenRecruitmentFormData>(
        key: K,
        value: OpenRecruitmentFormData[K],
    ) => {
        form.setData((previousData) => ({
            ...previousData,
            [key]: value,
        }));
        clearFieldError(key);
    };

    const handleFileChange = <K extends keyof OpenRecruitmentFormData>(
        key: K,
        file: OpenRecruitmentFormData[K],
    ) => {
        form.setData((previousData) => ({
            ...previousData,
            [key]: file,
        }));
        clearFieldError(key);
    };

    const validateCurrentStep = () => {
        const stepErrors = buildRequiredErrors(currentStep, form.data);
        setClientErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const validateAllSteps = () => {
        const combinedErrors: OpenRecruitmentFormErrors = {
            ...buildRequiredErrors('personal-data', form.data),
            ...buildRequiredErrors('motivation', form.data),
            ...buildRequiredErrors('questionnaire', form.data),
            ...buildRequiredErrors('documents', form.data),
        };

        setClientErrors(combinedErrors);
        return Object.keys(combinedErrors).length === 0;
    };

    const goToStep = (step: StepKey) => {
        setCurrentStep(step);
    };

    const nextStep = () => {
        if (currentStep === 'review') return;

        const isValid = validateCurrentStep();
        if (!isValid) return;

        const nextIndex = currentStepIndex + 1;
        const nextStepKey = openRecruitmentStepKeys[nextIndex];

        if (nextStepKey) {
            setCurrentStep(nextStepKey);
        }
    };

    const prevStep = () => {
        if (currentStep === 'info') return;

        const prevIndex = currentStepIndex - 1;
        const prevStepKey = openRecruitmentStepKeys[prevIndex];

        if (prevStepKey) {
            setCurrentStep(prevStepKey);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValid = validateAllSteps();
        if (!isValid) {
            setCurrentStep('personal-data');
            return;
        }

        if (SUBMIT_ENDPOINT === '#') {
            console.log('Template submit data:', form.data);
            return;
        }

        form.post(SUBMIT_ENDPOINT, {
            forceFormData: true,
            onError: () => {
                // Error backend nanti akan masuk ke form.errors
            },
        });
    };

    return {
        data: form.data,
        errors,
        processing: form.processing,
        currentStep,
        currentStepIndex,
        totalSteps,
        isFirstStep,
        isLastStep,
        setData: setFieldValue,
        setCurrentStep: goToStep,
        nextStep,
        prevStep,
        handleFileChange,
        handleSubmit,
        validateCurrentStep,
        reset: form.reset,
    };
}