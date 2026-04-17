import type { DocumentFieldKey, DocumentRule } from '../types';

const IMAGE_ACCEPT = '.jpg,.jpeg,.png';
const DEFAULT_MAX_SIZE_MB = 2;

export const documentRules: Record<DocumentFieldKey, DocumentRule> = {
    pas_photo: {
        label: 'Pas Foto',
        description: 'Unggah pas foto terbaru dengan latar yang jelas.',
        accept: IMAGE_ACCEPT,
        required: true,
        maxSizeMb: DEFAULT_MAX_SIZE_MB,
    },
    sertifikat_ppkmb: {
        label: 'Sertifikat PPKMB',
        description: 'Unggah bukti atau sertifikat PPKMB dalam format gambar.',
        accept: IMAGE_ACCEPT,
        required: true,
        maxSizeMb: DEFAULT_MAX_SIZE_MB,
    },
    follow_ig: {
        label: 'Bukti Follow Instagram',
        description: 'Unggah screenshot bukti follow akun Instagram UKM.',
        accept: IMAGE_ACCEPT,
        required: true,
        maxSizeMb: DEFAULT_MAX_SIZE_MB,
    },
    follow_tiktok: {
        label: 'Bukti Follow TikTok',
        description: 'Unggah screenshot bukti follow akun TikTok UKM.',
        accept: IMAGE_ACCEPT,
        required: true,
        maxSizeMb: DEFAULT_MAX_SIZE_MB,
    },
    follow_yt: {
        label: 'Bukti Subscribe YouTube',
        description: 'Unggah screenshot bukti subscribe kanal YouTube UKM.',
        accept: IMAGE_ACCEPT,
        required: true,
        maxSizeMb: DEFAULT_MAX_SIZE_MB,
    },
    tgl_lahir_doc: {
        label: 'Dokumen Pendukung Tanggal Lahir',
        description: 'Unggah bukti tanggal lahir, misalnya KTP, KTM, atau akta lahir.',
        accept: IMAGE_ACCEPT,
        required: true,
        maxSizeMb: DEFAULT_MAX_SIZE_MB,
    },
    bukti_pembayaran: {
        label: 'Bukti Pembayaran',
        description: 'Unggah bukti pembayaran pendaftaran jika diperlukan.',
        accept: IMAGE_ACCEPT,
        required: true,
        maxSizeMb: DEFAULT_MAX_SIZE_MB,
    },
    berkas_tambahan_1: {
        label: 'Berkas Tambahan 1',
        description: 'Unggah berkas tambahan pertama sesuai arahan panitia.',
        accept: IMAGE_ACCEPT,
        required: true,
        maxSizeMb: DEFAULT_MAX_SIZE_MB,
    },
    berkas_tambahan_2: {
        label: 'Berkas Tambahan 2',
        description: 'Unggah berkas tambahan kedua sesuai arahan panitia.',
        accept: IMAGE_ACCEPT,
        required: true,
        maxSizeMb: DEFAULT_MAX_SIZE_MB,
    },
};

export const documentFieldOrder: DocumentFieldKey[] = [
    'pas_photo',
    'sertifikat_ppkmb',
    'follow_ig',
    'follow_tiktok',
    'follow_yt',
    'tgl_lahir_doc',
    'bukti_pembayaran',
    'berkas_tambahan_1',
    'berkas_tambahan_2',
];