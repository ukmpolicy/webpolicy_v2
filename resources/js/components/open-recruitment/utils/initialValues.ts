import type { OpenRecruitmentFormData } from '../types';

export const openRecruitmentInitialValues: OpenRecruitmentFormData = {
    period_id: '',

    // Data pendaftaran
    nama: '',
    nim: '',
    jurusan: '',
    prodi: '',
    alamat: '',
    tgl_lahir: '',
    tempat_lahir: '',
    jenis_kelamin: '',
    agama: '',
    no_wa: '',
    email: '',
    soft_skill: '',
    pengalaman_organisasi: '',
    motivasi: '',
    motto: '',

    // Kuisioner pendaftaran
    deskripsi_diri: '',
    alasan_bergabung: '',
    makna_logo: '',
    visi_misi: '',
    sejarah_ukm: '',
    pengetahuan_linux: '',

    // Dokumen berkas
    pas_photo: null,
    sertifikat_ppkmb: null,
    follow_ig: null,
    follow_tiktok: null,
    follow_yt: null,
    tgl_lahir_doc: null,
    bukti_pembayaran: null,
    berkas_tambahan_1: null,
    berkas_tambahan_2: null,
};