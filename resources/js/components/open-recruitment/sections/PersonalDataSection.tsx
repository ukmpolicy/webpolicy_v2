import FormDateField from '../fields/FormDateField';
import FormSelectField from '../fields/FormSelectField';
import FormTextField from '../fields/FormTextField';
import FormTextareaField from '../fields/FormTextareaField';
import type { OpenRecruitmentFormData, OpenRecruitmentFormErrors, SelectOption } from '../types';

type PersonalDataSectionProps = {
    data: OpenRecruitmentFormData;
    errors: OpenRecruitmentFormErrors;
    setData: <K extends keyof OpenRecruitmentFormData>(key: K, value: OpenRecruitmentFormData[K]) => void;
};

const genderOptions: SelectOption[] = [
    { label: 'Laki-laki', value: 'L' },
    { label: 'Perempuan', value: 'P' },
];

export default function PersonalDataSection({ data, errors, setData }: PersonalDataSectionProps) {
    return (
        <section className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Data Diri</h2>
                <p className="text-sm text-muted-foreground">
                    Isi data pribadi dan data akademik dengan lengkap dan benar.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormTextField
                    id="nama"
                    name="nama"
                    label="Nama Lengkap"
                    value={data.nama}
                    onChange={(value) => setData('nama', value)}
                    error={errors.nama}
                    placeholder="Masukkan nama lengkap"
                    required
                />

                <FormTextField
                    id="nim"
                    name="nim"
                    label="NIM"
                    value={data.nim}
                    onChange={(value) => setData('nim', value)}
                    error={errors.nim}
                    placeholder="Masukkan NIM"
                    required
                />

                <FormTextField
                    id="jurusan"
                    name="jurusan"
                    label="Jurusan"
                    value={data.jurusan}
                    onChange={(value) => setData('jurusan', value)}
                    error={errors.jurusan}
                    placeholder="Masukkan jurusan"
                    required
                />

                <FormTextField
                    id="prodi"
                    name="prodi"
                    label="Program Studi"
                    value={data.prodi}
                    onChange={(value) => setData('prodi', value)}
                    error={errors.prodi}
                    placeholder="Masukkan program studi"
                    required
                />

                <FormDateField
                    id="tgl_lahir"
                    name="tgl_lahir"
                    label="Tanggal Lahir"
                    value={data.tgl_lahir}
                    onChange={(value) => setData('tgl_lahir', value)}
                    error={errors.tgl_lahir}
                    required
                />

                <FormTextField
                    id="tempat_lahir"
                    name="tempat_lahir"
                    label="Tempat Lahir"
                    value={data.tempat_lahir}
                    onChange={(value) => setData('tempat_lahir', value)}
                    error={errors.tempat_lahir}
                    placeholder="Masukkan tempat lahir"
                    required
                />

                <FormSelectField
                    id="jenis_kelamin"
                    name="jenis_kelamin"
                    label="Jenis Kelamin"
                    value={data.jenis_kelamin}
                    onChange={(value) => setData('jenis_kelamin', value as OpenRecruitmentFormData['jenis_kelamin'])}
                    options={genderOptions}
                    error={errors.jenis_kelamin}
                    placeholder="Pilih jenis kelamin"
                    required
                />

                <FormTextField
                    id="agama"
                    name="agama"
                    label="Agama"
                    value={data.agama}
                    onChange={(value) => setData('agama', value)}
                    error={errors.agama}
                    placeholder="Masukkan agama"
                    required
                />

                <FormTextField
                    id="no_wa"
                    name="no_wa"
                    label="Nomor WhatsApp"
                    type="tel"
                    value={data.no_wa}
                    onChange={(value) => setData('no_wa', value)}
                    error={errors.no_wa}
                    placeholder="Contoh: 081234567890"
                    helperText="Gunakan nomor aktif yang bisa dihubungi."
                    required
                />

                <FormTextField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(value) => setData('email', value)}
                    error={errors.email}
                    placeholder="contoh@email.com"
                    required
                />

                <FormTextareaField
                    id="alamat"
                    name="alamat"
                    label="Alamat"
                    value={data.alamat}
                    onChange={(value) => setData('alamat', value)}
                    error={errors.alamat}
                    placeholder="Masukkan alamat lengkap"
                    rows={4}
                    containerClassName="md:col-span-2"
                    required
                />
            </div>
        </section>
    );
}