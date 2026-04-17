import FormFileField from '../fields/FormFileField';
import { documentRules } from '../utils/documentRules';
import type { OpenRecruitmentFormData, OpenRecruitmentFormErrors } from '../types';

type DocumentUploadSectionProps = {
    data: OpenRecruitmentFormData;
    errors: OpenRecruitmentFormErrors;
    setData: <K extends keyof OpenRecruitmentFormData>(key: K, value: OpenRecruitmentFormData[K]) => void;
};

export default function DocumentUploadSection({ data, errors, setData }: DocumentUploadSectionProps) {
    return (
        <section className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Upload Dokumen</h2>
                <p className="text-sm text-muted-foreground">
                    Pastikan semua file yang diunggah jelas, sesuai format, dan tidak melebihi ukuran yang ditentukan.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormFileField
                    id="pas_photo"
                    name="pas_photo"
                    label={documentRules.pas_photo.label}
                    file={data.pas_photo}
                    onChange={(file) => setData('pas_photo', file)}
                    error={errors.pas_photo}
                    helperText={documentRules.pas_photo.description}
                    accept={documentRules.pas_photo.accept}
                    maxSizeMb={documentRules.pas_photo.maxSizeMb}
                    required={documentRules.pas_photo.required}
                />

                <FormFileField
                    id="sertifikat_ppkmb"
                    name="sertifikat_ppkmb"
                    label={documentRules.sertifikat_ppkmb.label}
                    file={data.sertifikat_ppkmb}
                    onChange={(file) => setData('sertifikat_ppkmb', file)}
                    error={errors.sertifikat_ppkmb}
                    helperText={documentRules.sertifikat_ppkmb.description}
                    accept={documentRules.sertifikat_ppkmb.accept}
                    maxSizeMb={documentRules.sertifikat_ppkmb.maxSizeMb}
                    required={documentRules.sertifikat_ppkmb.required}
                />

                <FormFileField
                    id="tgl_lahir_doc"
                    name="tgl_lahir_doc"
                    label={documentRules.tgl_lahir_doc.label}
                    file={data.tgl_lahir_doc}
                    onChange={(file) => setData('tgl_lahir_doc', file)}
                    error={errors.tgl_lahir_doc}
                    helperText={documentRules.tgl_lahir_doc.description}
                    accept={documentRules.tgl_lahir_doc.accept}
                    maxSizeMb={documentRules.tgl_lahir_doc.maxSizeMb}
                    required={documentRules.tgl_lahir_doc.required}
                />

                <FormFileField
                    id="bukti_pembayaran"
                    name="bukti_pembayaran"
                    label={documentRules.bukti_pembayaran.label}
                    file={data.bukti_pembayaran}
                    onChange={(file) => setData('bukti_pembayaran', file)}
                    error={errors.bukti_pembayaran}
                    helperText={documentRules.bukti_pembayaran.description}
                    accept={documentRules.bukti_pembayaran.accept}
                    maxSizeMb={documentRules.bukti_pembayaran.maxSizeMb}
                    required={documentRules.bukti_pembayaran.required}
                />

                <FormFileField
                    id="berkas_tambahan_1"
                    name="berkas_tambahan_1"
                    label={documentRules.berkas_tambahan_1.label}
                    file={data.berkas_tambahan_1}
                    onChange={(file) => setData('berkas_tambahan_1', file)}
                    error={errors.berkas_tambahan_1}
                    helperText={documentRules.berkas_tambahan_1.description}
                    accept={documentRules.berkas_tambahan_1.accept}
                    maxSizeMb={documentRules.berkas_tambahan_1.maxSizeMb}
                    required={documentRules.berkas_tambahan_1.required}
                />

                <FormFileField
                    id="berkas_tambahan_2"
                    name="berkas_tambahan_2"
                    label={documentRules.berkas_tambahan_2.label}
                    file={data.berkas_tambahan_2}
                    onChange={(file) => setData('berkas_tambahan_2', file)}
                    error={errors.berkas_tambahan_2}
                    helperText={documentRules.berkas_tambahan_2.description}
                    accept={documentRules.berkas_tambahan_2.accept}
                    maxSizeMb={documentRules.berkas_tambahan_2.maxSizeMb}
                    required={documentRules.berkas_tambahan_2.required}
                />
            </div>
        </section>
    );
}