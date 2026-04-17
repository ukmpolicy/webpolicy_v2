import type { OpenRecruitmentFormData } from '../types';

type ReviewSectionProps = {
    data: OpenRecruitmentFormData;
};

function ReviewItem({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
    return (
        <div className="space-y-1 rounded-lg border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="text-sm text-foreground">{value && String(value).trim() !== '' ? value : '-'}</p>
        </div>
    );
}

function ReviewFileItem({
    label,
    file,
}: {
    label: string;
    file: File | null;
}) {
    return (
        <div className="space-y-1 rounded-lg border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="text-sm text-foreground">{file ? file.name : 'Belum ada file dipilih'}</p>
        </div>
    );
}

export default function ReviewSection({ data }: ReviewSectionProps) {
    return (
        <section className="space-y-8">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Review Data Pendaftaran</h2>
                <p className="text-sm text-muted-foreground">
                    Periksa kembali seluruh data sebelum mengirim form. Karena tentu akan lebih menyenangkan
                    menemukan salah ketik sekarang daripada setelah dikirim.
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="text-base font-semibold">Data Diri</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ReviewItem label="Nama Lengkap" value={data.nama} />
                    <ReviewItem label="NIM" value={data.nim} />
                    <ReviewItem label="Jurusan" value={data.jurusan} />
                    <ReviewItem label="Program Studi" value={data.prodi} />
                    <ReviewItem label="Tanggal Lahir" value={data.tgl_lahir} />
                    <ReviewItem label="Tempat Lahir" value={data.tempat_lahir} />
                    <ReviewItem
                        label="Jenis Kelamin"
                        value={data.jenis_kelamin === 'L' ? 'Laki-laki' : data.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
                    />
                    <ReviewItem label="Agama" value={data.agama} />
                    <ReviewItem label="Nomor WhatsApp" value={data.no_wa} />
                    <ReviewItem label="Email" value={data.email} />
                    <div className="md:col-span-2">
                        <ReviewItem label="Alamat" value={data.alamat} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-base font-semibold">Profil dan Motivasi</h3>
                <div className="grid grid-cols-1 gap-4">
                    <ReviewItem label="Soft Skill" value={data.soft_skill} />
                    <ReviewItem label="Pengalaman Organisasi" value={data.pengalaman_organisasi} />
                    <ReviewItem label="Motivasi" value={data.motivasi} />
                    <ReviewItem label="Motto" value={data.motto} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-base font-semibold">Kuisioner</h3>
                <div className="grid grid-cols-1 gap-4">
                    <ReviewItem label="Deskripsi Diri" value={data.deskripsi_diri} />
                    <ReviewItem label="Alasan Bergabung" value={data.alasan_bergabung} />
                    <ReviewItem label="Makna Logo" value={data.makna_logo} />
                    <ReviewItem label="Visi dan Misi" value={data.visi_misi} />
                    <ReviewItem label="Sejarah UKM" value={data.sejarah_ukm} />
                    <ReviewItem label="Pengetahuan Linux dan Open Source" value={data.pengetahuan_linux} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-base font-semibold">Bukti Sosial Media</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ReviewFileItem label="Bukti Follow Instagram" file={data.follow_ig} />
                    <ReviewFileItem label="Bukti Follow TikTok" file={data.follow_tiktok} />
                    <div className="md:col-span-2">
                        <ReviewFileItem label="Bukti Subscribe YouTube" file={data.follow_yt} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-base font-semibold">Dokumen Upload</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ReviewFileItem label="Pas Foto" file={data.pas_photo} />
                    <ReviewFileItem label="Sertifikat PPKMB" file={data.sertifikat_ppkmb} />
                    <ReviewFileItem label="Dokumen Pendukung Tanggal Lahir" file={data.tgl_lahir_doc} />
                    <ReviewFileItem label="Bukti Pembayaran" file={data.bukti_pembayaran} />
                    <ReviewFileItem label="Berkas Tambahan 1" file={data.berkas_tambahan_1} />
                    <ReviewFileItem label="Berkas Tambahan 2" file={data.berkas_tambahan_2} />
                </div>
            </div>
        </section>
    );
}