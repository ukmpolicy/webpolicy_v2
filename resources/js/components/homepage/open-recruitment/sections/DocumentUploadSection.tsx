import React from 'react';

import FormFileField from '../fields/FormFileField';

interface DocumentUploadValues {
    pas_photo: File | null;
    sertifikat_ppkmb: File | null;

    bukti_pembayaran: File | null;
}

interface DocumentUploadSectionProps {
    values: DocumentUploadValues;
    onChange: (field: keyof DocumentUploadValues, value: File | null) => void;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ values, onChange }) => {
    return (
        <section className="space-y-8">
            <div className="space-y-3">
                <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400">
                    Step 4
                </span>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                        Upload Dokumen
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                        Unggah seluruh dokumen yang diminta dengan file yang jelas dan mudah dibaca.
                        Jangan sampai yang terunggah justru screenshot galeri atau foto blur setengah gelap.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <FormFileField
                    id="pas_photo"
                    label="Pas Foto"
                    file={values.pas_photo}
                    onChange={(file) => onChange('pas_photo', file)}
                    helperText="Unggah pas foto terbaru dengan format JPG, JPEG, atau PNG."
                    accept=".jpg,.jpeg,.png"
                    required
                />

                <FormFileField
                    id="sertifikat_ppkmb"
                    label="Sertifikat / Bukti PPKMB"
                    file={values.sertifikat_ppkmb}
                    onChange={(file) => onChange('sertifikat_ppkmb', file)}
                    helperText="Unggah bukti atau sertifikat PPKMB yang masih jelas terbaca."
                    accept=".jpg,.jpeg,.png"
                    required
                />

                <FormFileField
                    id="bukti_pembayaran"
                    label="Bukti Pembayaran"
                    file={values.bukti_pembayaran}
                    onChange={(file) => onChange('bukti_pembayaran', file)}
                    helperText="Unggah bukti pembayaran jika memang ada biaya pendaftaran."
                    accept=".jpg,.jpeg,.png"
                    required
                />

            </div>
        </section>
    );
};

export default DocumentUploadSection;