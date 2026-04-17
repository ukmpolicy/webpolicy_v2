import type { Period } from './types';

type FormHeaderProps = {
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

function getRecruitmentStatus(period: Period | null) {
    if (!period) {
        return {
            label: 'Periode belum tersedia',
            className: 'bg-muted text-muted-foreground',
        };
    }

    if (!period.is_open_recruitment) {
        return {
            label: 'OR belum dibuka',
            className: 'bg-yellow-100 text-yellow-800',
        };
    }

    const now = new Date();
    const start = period.recruitment_started_at ? new Date(period.recruitment_started_at) : null;
    const end = period.recruitment_ended_at ? new Date(period.recruitment_ended_at) : null;

    if (start && now < start) {
        return {
            label: 'Akan dibuka',
            className: 'bg-blue-100 text-blue-800',
        };
    }

    if (end && now > end) {
        return {
            label: 'Sudah ditutup',
            className: 'bg-red-100 text-red-800',
        };
    }

    return {
        label: 'Sedang dibuka',
        className: 'bg-green-100 text-green-800',
    };
}

export default function FormHeader({ period }: FormHeaderProps) {
    const status = getRecruitmentStatus(period);

    return (
        <section className="space-y-6">
            <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-primary">UKM-POLICY</p>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Form Open Recruitment</h1>
                    </div>

                    <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                    >
                        {status.label}
                    </span>
                </div>

                <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Lengkapi form pendaftaran open recruitment dengan data yang valid, jawaban yang jujur,
                    dan dokumen yang sesuai ketentuan. Template ini dibuat agar siap dipakai di desktop
                    maupun handphone, karena satu masalah dalam hidup saja seharusnya sudah cukup.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mulai</p>
                    <p className="mt-2 text-sm font-medium">{formatDateTime(period?.recruitment_started_at ?? null)}</p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Berakhir</p>
                    <p className="mt-2 text-sm font-medium">{formatDateTime(period?.recruitment_ended_at ?? null)}</p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Kuota</p>
                    <p className="mt-2 text-sm font-medium">
                        {period?.recruitment_quota ? `${period.recruitment_quota} peserta` : 'Tidak dibatasi / belum ditentukan'}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status Periode</p>
                    <p className="mt-2 text-sm font-medium">{period?.is_active ? 'Aktif' : 'Tidak aktif / belum tersedia'}</p>
                </div>
            </div>

            <div className="rounded-xl border p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pengumuman</p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                    {period?.recruitment_description?.trim()
                        ? period.recruitment_description
                        : 'Pengumuman open recruitment belum tersedia saat ini.'}
                </p>
            </div>
        </section>
    );
}