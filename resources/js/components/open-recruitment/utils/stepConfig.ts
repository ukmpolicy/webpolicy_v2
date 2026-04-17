import type { StepConfigItem, StepKey } from '../types';

export const DEFAULT_STEP: StepKey = 'info';

export const openRecruitmentSteps: StepConfigItem[] = [
    {
        key: 'info',
        title: 'Informasi OR',
        description: 'Baca informasi open recruitment sebelum mulai mengisi form.',
    },
    {
        key: 'personal-data',
        title: 'Data Diri',
        description: 'Isi data pribadi dan data akademik dengan benar.',
    },
    {
        key: 'motivation',
        title: 'Profil & Motivasi',
        description: 'Ceritakan soft skill, pengalaman organisasi, motivasi, dan motto kamu.',
    },
    {
        key: 'questionnaire',
        title: 'Kuisioner',
        description: 'Jawab seluruh pertanyaan kuisioner dengan lengkap.',
    },
    {
        key: 'documents',
        title: 'Dokumen',
        description: 'Unggah seluruh dokumen persyaratan yang diminta.',
    },
    {
        key: 'review',
        title: 'Review & Submit',
        description: 'Periksa kembali seluruh data sebelum mengirim pendaftaran.',
    },
];

export const openRecruitmentStepKeys: StepKey[] = openRecruitmentSteps.map((step) => step.key);