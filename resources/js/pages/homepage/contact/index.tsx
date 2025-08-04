import { Head, Link, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Komponen yang sudah ada dan kita gunakan kembali
import AppHeader from '@/components/homepage/app-header';
import AppFooter from '@/components/homepage/app-footer';
import AppLoading from '@/components/homepage/app-loading';
import InputError from '@/components/input-error'; // <-- Import komponen untuk menampilkan error
import { Phone, MapPin, Clock, ChevronRight } from 'lucide-react';

const ContactPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    // --- Gunakan useForm untuk mengelola state form ---
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // --- Fungsi untuk menangani submit form ---
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const promise = new Promise((resolve, reject) => {
            // Kirim data ke route 'contact.send' yang ada di web.php
            post(route('contact.send'), {
                onSuccess: (page) => resolve(page),
                onError: (errors) => reject(errors),
                preserveScroll: true,
            });
        });

        toast.promise(promise, {
            loading: 'Mengirim pesan...',
            success: () => {
                reset(); // Kosongkan form setelah sukses
                return 'Pesan berhasil terkirim!';
            },
            error: 'Gagal mengirim pesan. Periksa kembali isian Anda.',
        });
    }

    if (isLoading) return <AppLoading />;

    return (
        <>
            <Head title="Kontak - UKM POLICY" />
            <AppHeader />
            <main className="bg-black text-white pt-20 sm:pt-20 min-h-screen">
                {/* Header Halaman */}
    <section className="relative overflow-hidden text-white bg-black py-8 text-left border-b border-white/10">
      {/* Background Blobs (sama seperti Hero) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-red-600/40 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl opacity-10" />
      </div>

      {/* Konten Utama */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="pt-0 pb-0 text-left md:pt-0">
                        {/* Breadcrumb: Home > Berita */}
                        <div className="mb-6 flex items-center text-xs md:text-sm">
                            <Link href="/" className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400">
                                Home
                            </Link>
                            <ChevronRight className="mx-2 h-4 w-4 text-white/60" />
                            <span className="font-bold text-red-500">Kontak</span>
                        </div>
                        {/* Judul Utama: BLOG KAMI */}
                        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl">HUBUNGI KAMI</h1>
                        {/* Deskripsi */}
                        <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                            Kami siap mendengar dari Anda. Sampaikan pertanyaan atau masukan Anda melalui form di bawah ini.
                        </p>
                    </div>
                </div>
    </section>

                {/* Konten Kontak */}
                <section id="contact" className="py-20 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12">
                            {/* Info Cards */}
                            <div className="xl:col-span-4">
                                <div className="space-y-8">
                                    <div className="flex gap-6 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-red-500 transition-colors duration-300">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 inline-flex items-center justify-center rounded-lg bg-red-600 text-white">
                                                <Phone className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">Kontak</h4>
                                            <p className="m-0 text-zinc-400">policy.lhokseumawe@gmail.com</p>
                                            <p className="m-0 text-zinc-400">+62 123 4567 890</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-red-500 transition-colors duration-300">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 inline-flex items-center justify-center rounded-lg bg-red-600 text-white">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">Alamat</h4>
                                            <p className="m-0 text-zinc-400">Jl. Medan - Banda Aceh, Lhokseumawe</p>
                                            <p className="m-0 text-zinc-400">Aceh, Indonesia</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-red-500 transition-colors duration-300">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 inline-flex items-center justify-center rounded-lg bg-red-600 text-white">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">Jadwal</h4>
                                            <p className="m-0 text-zinc-400">Senin - Jumat</p>
                                            <p className="m-0 text-zinc-400">09:00 - 17:00 WIB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="xl:col-span-8">
                                <div className="relative z-10 p-6 sm:p-10 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                    <div className="text-center max-w-lg mx-auto mb-12">
                                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Siap Memulai?</h2>
                                        <p className="text-zinc-400">
                                            Kirimkan pesan Anda dan kami akan segera menghubungi Anda kembali.
                                        </p>
                                    </div>

                                    {/* --- Sambungkan form ke useForm --- */}
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <input
                                                    type="text" name="name"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    className="block w-full px-5 py-3 text-base rounded-md bg-transparent border border-zinc-700 text-white focus:border-red-500 focus:ring-red-500 transition"
                                                    placeholder="Nama Anda" required
                                                />
                                                <InputError message={errors.name} className="mt-2" />
                                            </div>
                                            <div>
                                                <input
                                                    type="email" name="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className="block w-full px-5 py-3 text-base rounded-md bg-transparent border border-zinc-700 text-white focus:border-red-500 focus:ring-red-500 transition"
                                                    placeholder="Email Anda" required
                                                />
                                                <InputError message={errors.email} className="mt-2" />
                                            </div>
                                        </div>
                                        <div>
                                            <input
                                                type="text" name="subject"
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                                className="block w-full px-5 py-3 text-base rounded-md bg-transparent border border-zinc-700 text-white focus:border-red-500 focus:ring-red-500 transition"
                                                placeholder="Subjek" required
                                            />
                                            <InputError message={errors.subject} className="mt-2" />
                                        </div>
                                        <div>
                                            <textarea
                                                name="message" rows={5}
                                                value={data.message}
                                                onChange={e => setData('message', e.target.value)}
                                                className="block w-full px-5 py-3 text-base rounded-md bg-transparent border border-zinc-700 text-white focus:border-red-500 focus:ring-red-500 transition"
                                                placeholder="Tulis pesan Anda" required
                                            ></textarea>
                                            <InputError message={errors.message} className="mt-2" />
                                        </div>
                                        <div className="w-full text-right">
                                            <button
                                                type="submit"
                                                disabled={processing} // <-- Tombol nonaktif saat mengirim
                                                className="inline-block px-8 py-3 text-base font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:bg-red-900 disabled:cursor-not-allowed"
                                            >
                                                {processing ? 'Mengirim...' : 'Kirim Pesan'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section id="map" className="w-full h-[400px] md:h-[500px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15896.62349389953!2d97.1507347!3d5.1633318!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304776472b68cb15%3A0x4208d43874f63566!2sPoliteknik%20Negeri%20Lhokseumawe!5e0!3m2!1sid!2sid!4v1721552482390!5m2!1sid!2sid"
                        className="w-full h-full border-0"
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </section>
            </main>
            <AppFooter />
        </>
    );
};

export default ContactPage;
