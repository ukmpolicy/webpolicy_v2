export type StepKey =
    | 'info'
    | 'personal-data'
    | 'motivation'
    | 'questionnaire'
    | 'documents'
    | 'review';

export type Period = {
    id: number;
    is_active: boolean;
    is_open_recruitment: boolean;
    recruitment_started_at: string | null;
    recruitment_ended_at: string | null;
    recruitment_description: string | null;
    recruitment_quota: number | null;
};

export type OpenRecruitmentPageProps = {
    period: Period | null;
};

export type UploadedFileValue = File | null;

export type OpenRecruitmentFormData = {
    period_id: number | '';

    // Data pendaftaran
    nama: string;
    nim: string;
    jurusan: string;
    prodi: string;
    alamat: string;
    tgl_lahir: string;
    tempat_lahir: string;
    jenis_kelamin: 'L' | 'P' | '';
    agama: string;
    no_wa: string;
    email: string;
    soft_skill: string;
    pengalaman_organisasi: string;
    motivasi: string;
    motto: string;

    // Kuisioner pendaftaran
    deskripsi_diri: string;
    alasan_bergabung: string;
    makna_logo: string;
    visi_misi: string;
    sejarah_ukm: string;
    pengetahuan_linux: string;

    // Dokumen berkas
    pas_photo: UploadedFileValue;
    sertifikat_ppkmb: UploadedFileValue;
    follow_ig: UploadedFileValue;
    follow_tiktok: UploadedFileValue;
    follow_yt: UploadedFileValue;
    tgl_lahir_doc: UploadedFileValue;
    bukti_pembayaran: UploadedFileValue;
    berkas_tambahan_1: UploadedFileValue;
    berkas_tambahan_2: UploadedFileValue;
};

export type OpenRecruitmentFormErrors = Partial<Record<keyof OpenRecruitmentFormData, string>>;

export type SelectOption = {
    label: string;
    value: string;
    disabled?: boolean;
};

export type StepConfigItem = {
    key: StepKey;
    title: string;
    description: string;
};

export type DocumentFieldKey =
    | 'pas_photo'
    | 'sertifikat_ppkmb'
    | 'follow_ig'
    | 'follow_tiktok'
    | 'follow_yt'
    | 'tgl_lahir_doc'
    | 'bukti_pembayaran'
    | 'berkas_tambahan_1'
    | 'berkas_tambahan_2';

export type DocumentRule = {
    label: string;
    description: string;
    accept: string;
    required: boolean;
    maxSizeMb: number;
};