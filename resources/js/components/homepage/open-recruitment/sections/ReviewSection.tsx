import React from 'react';

interface ReviewSectionProps {
    values: {
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

        soft_skill: string;
        pengalaman_organisasi: string;
        motivasi: string;
        motto: string;

        deskripsi_diri: string;
        alasan_bergabung: string;
        makna_logo: string;
        visi_misi: string;
        sejarah_ukm: string;
        pengetahuan_linux: string;

        follow_ig: File | null;
        follow_tiktok: File | null;
        follow_yt: File | null;

        pas_photo: File | null;
        sertifikat_ppkmb: File | null;
    
        bukti_pembayaran: File | null;
      
    };
}

const ReviewCard = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {children}
        </div>
    );
};

const ReviewItem = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => {
    return (
        <div className="space-y-1 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {label}
            </p>
            <div className="text-sm leading-7 text-zinc-200">{value || '-'}</div>
        </div>
    );
};

const FilePreviewItem = ({
    label,
    file,
}: {
    label: string;
    file: File | null;
}) => {
    const previewUrl = file ? URL.createObjectURL(file) : null;

    return (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {label}
            </p>

            {file ? (
                <div className="space-y-3">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                        <img
                            src={previewUrl as string}
                            alt={label}
                            className="h-28 w-full object-cover sm:h-32"
                        />
                    </div>
                    <p className="break-all text-sm text-zinc-300">{file.name}</p>
                </div>
            ) : (
                <p className="text-sm text-zinc-400">Belum ada file dipilih</p>
            )}
        </div>
    );
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ values }) => {
    return (
        <section className="space-y-8">
            <div className="space-y-3">
                <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400">
                    Step 5
                </span>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                        Review Pendaftaran
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                        Cek ulang semua data dan dokumen sebelum dikirim. Ini tahap terakhir buat
                        memastikan tidak ada typo, file salah, atau keputusan hidup kecil lain yang
                        menjengkelkan.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <ReviewCard title="Data Diri">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <ReviewItem label="Nama Lengkap" value={values.nama} />
                        <ReviewItem label="NIM" value={values.nim} />
                        <ReviewItem label="Jurusan" value={values.jurusan} />
                        <ReviewItem label="Program Studi" value={values.prodi} />
                        <ReviewItem label="Tanggal Lahir" value={values.tgl_lahir} />
                        <ReviewItem label="Tempat Lahir" value={values.tempat_lahir} />
                        <ReviewItem
                            label="Jenis Kelamin"
                            value={
                                values.jenis_kelamin === 'L'
                                    ? 'Laki-laki'
                                    : values.jenis_kelamin === 'P'
                                      ? 'Perempuan'
                                      : values.jenis_kelamin
                            }
                        />
                        <ReviewItem label="Agama" value={values.agama} />
                        <ReviewItem label="Nomor WhatsApp" value={values.no_wa} />
                        <ReviewItem label="Email" value={values.email} />
                        <div className="md:col-span-2">
                            <ReviewItem label="Alamat" value={values.alamat} />
                        </div>
                    </div>
                </ReviewCard>

                <ReviewCard title="Profil dan Motivasi">
                    <div className="grid grid-cols-1 gap-4">
                        <ReviewItem label="Soft Skill" value={values.soft_skill} />
                        <ReviewItem
                            label="Pengalaman Organisasi"
                            value={values.pengalaman_organisasi}
                        />
                        <ReviewItem label="Motivasi" value={values.motivasi} />
                        <ReviewItem label="Motto" value={values.motto} />
                    </div>
                </ReviewCard>

                <ReviewCard title="Kuisioner">
                    <div className="grid grid-cols-1 gap-4">
                        <ReviewItem label="Deskripsi Diri" value={values.deskripsi_diri} />
                        <ReviewItem label="Alasan Bergabung" value={values.alasan_bergabung} />
                        <ReviewItem label="Makna Logo" value={values.makna_logo} />
                        <ReviewItem label="Visi dan Misi" value={values.visi_misi} />
                        <ReviewItem label="Sejarah UKM" value={values.sejarah_ukm} />
                        <ReviewItem
                            label="Pengetahuan Linux dan Open Source"
                            value={values.pengetahuan_linux}
                        />
                    </div>
                </ReviewCard>

                <ReviewCard title="Bukti Sosial Media">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <FilePreviewItem label="Bukti Follow Instagram" file={values.follow_ig} />
                        <FilePreviewItem label="Bukti Follow TikTok" file={values.follow_tiktok} />
                        <FilePreviewItem label="Bukti Subscribe YouTube" file={values.follow_yt} />
                    </div>
                </ReviewCard>

                <ReviewCard title="Dokumen Upload">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <FilePreviewItem label="Pas Foto" file={values.pas_photo} />
                        <FilePreviewItem
                            label="Sertifikat / Bukti PPKMB"
                            file={values.sertifikat_ppkmb}
                        />
                  
                        <FilePreviewItem
                            label="Bukti Pembayaran"
                            file={values.bukti_pembayaran}
                        />
        
                    </div>
                </ReviewCard>
            </div>
        </section>
    );
};

export default ReviewSection;