import React from 'react';

import FormDateField from '../fields/FormDateField';
import FormSelectField from '../fields/FormSelectField';
import FormTextField from '../fields/FormTextField';
import FormTextareaField from '../fields/FormTextareaField';

interface PersonalDataValues {
    nama: string;
    nim: string;
    jurusan: string;
    prodi: string;
    alamat: string;
    tgl_lahir: string;
    tempat_lahir: string;
    jenis_kelamin: string;
    agama: string;
    no_wa: string;
    email: string;
}

interface PersonalDataSectionProps {
    values: PersonalDataValues;
    onChange: (field: keyof PersonalDataValues, value: string) => void;
}

const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ values, onChange }) => {
    return (
        <section className="space-y-8">
            <div className="space-y-3">
                <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400">
                    Step 1
                </span>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">Data Diri</h2>
                    <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                        Lengkapi data diri dengan benar. Jangan sampai salah isi nomor WhatsApp lalu bingung
                        kenapa tidak pernah dihubungi.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormTextField
                    id="nama"
                    label="Nama Lengkap"
                    value={values.nama}
                    onChange={(value) => onChange('nama', value)}
                    placeholder="Masukkan nama lengkap"
                    required
                />

                <FormTextField
                    id="nim"
                    label="NIM"
                    value={values.nim}
                    onChange={(value) => onChange('nim', value)}
                    placeholder="Masukkan NIM"
                    required
                />

                <FormTextField
                    id="jurusan"
                    label="Jurusan"
                    value={values.jurusan}
                    onChange={(value) => onChange('jurusan', value)}
                    placeholder="Masukkan jurusan"
                    required
                />

                <FormTextField
                    id="prodi"
                    label="Program Studi"
                    value={values.prodi}
                    onChange={(value) => onChange('prodi', value)}
                    placeholder="Masukkan program studi"
                    required
                />

                <div className="md:col-span-2">
                    <FormTextareaField
                        id="alamat"
                        label="Alamat"
                        value={values.alamat}
                        onChange={(value) => onChange('alamat', value)}
                        placeholder="Masukkan alamat lengkap"
                        rows={4}
                        required
                    />
                </div>

                <FormDateField
                    id="tgl_lahir"
                    label="Tanggal Lahir"
                    value={values.tgl_lahir}
                    onChange={(value) => onChange('tgl_lahir', value)}
                    required
                />

                <FormTextField
                    id="tempat_lahir"
                    label="Tempat Lahir"
                    value={values.tempat_lahir}
                    onChange={(value) => onChange('tempat_lahir', value)}
                    placeholder="Masukkan tempat lahir"
                    required
                />

                <FormSelectField
                    id="jenis_kelamin"
                    label="Jenis Kelamin"
                    value={values.jenis_kelamin}
                    onChange={(value) => onChange('jenis_kelamin', value)}
                    options={[
                        { label: 'Laki-laki', value: 'L' },
                        { label: 'Perempuan', value: 'P' },
                    ]}
                    placeholder="Pilih jenis kelamin"
                    required
                />

                <FormTextField
                    id="agama"
                    label="Agama"
                    value={values.agama}
                    onChange={(value) => onChange('agama', value)}
                    placeholder="Masukkan agama"
                    required
                />

                <FormTextField
                    id="no_wa"
                    label="Nomor WhatsApp"
                    value={values.no_wa}
                    onChange={(value) => onChange('no_wa', value)}
                    placeholder="Contoh: 081234567890"
                    type="tel"
                    required
                />

                <FormTextField
                    id="email"
                    label="Email"
                    value={values.email}
                    onChange={(value) => onChange('email', value)}
                    placeholder="Masukkan email aktif"
                    type="email"
                    required
                />
            </div>
        </section>
    );
};

export default PersonalDataSection;