import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion'; // Import motion dari framer-motion
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Komponen yang sudah ada dan kita gunakan kembali
import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import AppLoading from '@/components/homepage/app-loading';
import InputError from '@/components/input-error';
import { ChevronRight, Clock, MapPin, Phone } from 'lucide-react';

const ContactPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

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

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const promise = new Promise((resolve, reject) => {
            post(route('contact.send'), {
                onSuccess: (page) => resolve(page),
                onError: (errors) => reject(errors),
                preserveScroll: true,
            });
        });

        toast.promise(promise, {
            loading: 'Mengirim pesan...',
            success: () => {
                reset();
                return 'Pesan berhasil terkirim!';
            },
            error: 'Gagal mengirim pesan. Periksa kembali isian Anda.',
        });
    }

    // Variasi animasi untuk elemen-elemen
    const fadeInSlideUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    const containerVariants = {
        visible: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.1, // Memberikan efek stagger pada children
            },
        },
        hidden: { opacity: 0 },
    };

    const itemVariants = {
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        hidden: { opacity: 0, y: 20 },
    };

    if (isLoading) return <AppLoading />;

    return (
        <>
            <Head title="Kontak - UKM POLICY" />
            <AppHeader />
            <main className="min-h-screen bg-black text-white">
                {/* Header Halaman - Dengan Animasi */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={fadeInSlideUp} // Animasi untuk section keseluruhan
                    className="relative overflow-hidden bg-black py-8"
                >
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-red-600/40 opacity-40 blur-[120px]" />
                        <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-white/10 opacity-10 blur-2xl" />
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="pt-12 pb-6 text-left md:pt-20">
                            <motion.div variants={itemVariants} className="mb-6 flex items-center text-xs md:text-sm">
                                <Link href={route('home')} className="font-medium text-gray-300 transition-colors duration-200 hover:text-red-400">
                                    Beranda
                                </Link>
                                <ChevronRight className="mx-2 h-4 w-4 text-white/60" />
                                <span className="font-bold text-red-500">Kontak</span>
                            </motion.div>
                            <motion.h1
                                variants={itemVariants}
                                className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl"
                            >
                                HUBUNGI KAMI
                            </motion.h1>
                            <motion.p variants={itemVariants} className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                                Kami siap mendengar dari Anda. Sampaikan pertanyaan atau masukan Anda melalui form di bawah ini.
                            </motion.p>
                        </div>
                    </div>
                    <div className="w-full border-t border-neutral-800"></div>
                </motion.section>

                {/* Konten Kontak - Dengan Animasi */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.section
                        id="contact"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants} // Animasi untuk section kontak
                        className="py-20 md:py-24"
                    >
                        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-12">
                            {/* Info Cards - Dengan Animasi */}
                            <motion.div variants={itemVariants} className="xl:col-span-4">
                                <div className="space-y-6 sm:space-y-8">
                                    <motion.div
                                        variants={itemVariants}
                                        className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors duration-300 hover:border-red-500 sm:gap-6 sm:p-6"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white sm:h-12 sm:w-12">
                                                <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-lg font-bold text-white sm:text-xl">Kontak</h4>
                                            <p className="m-0 text-sm text-zinc-400 sm:text-base">policy.lhokseumawe@gmail.com</p>
                                            <p className="m-0 text-sm text-zinc-400 sm:text-base">+62 123 4567 890</p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        variants={itemVariants}
                                        className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors duration-300 hover:border-red-500 sm:gap-6 sm:p-6"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white sm:h-12 sm:w-12">
                                                <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-lg font-bold text-white sm:text-xl">Alamat</h4>
                                            <p className="m-0 text-sm text-zinc-400 sm:text-base">Jl. Medan - Banda Aceh, Lhokseumawe</p>
                                            <p className="m-0 text-sm text-zinc-400 sm:text-base">Aceh, Indonesia</p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        variants={itemVariants}
                                        className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors duration-300 hover:border-red-500 sm:gap-6 sm:p-6"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white sm:h-12 sm:w-12">
                                                <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-lg font-bold text-white sm:text-xl">Jadwal</h4>
                                            <p className="m-0 text-sm text-zinc-400 sm:text-base">Senin - Jumat</p>
                                            <p className="m-0 text-sm text-zinc-400 sm:text-base">09:00 - 17:00 WIB</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Contact Form - Dengan Animasi */}
                            <motion.div variants={itemVariants} className="xl:col-span-8">
                                <div className="relative z-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-10">
                                    <motion.div variants={itemVariants} className="mx-auto mb-8 max-w-lg text-center sm:mb-12">
                                        <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">Siap Memulai?</h2>
                                        <p className="text-zinc-400">Kirimkan pesan Anda dan kami akan segera menghubungi Anda kembali.</p>
                                    </motion.div>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
                                        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="block w-full rounded-md border border-zinc-700 bg-transparent px-5 py-3 text-base text-white transition focus:border-red-500 focus:ring-red-500"
                                                    placeholder="Nama Anda"
                                                    required
                                                />
                                                <InputError message={errors.name} className="mt-2" />
                                            </div>
                                            <div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="block w-full rounded-md border border-zinc-700 bg-transparent px-5 py-3 text-base text-white transition focus:border-red-500 focus:ring-red-500"
                                                    placeholder="Email Anda"
                                                    required
                                                />
                                                <InputError message={errors.email} className="mt-2" />
                                            </div>
                                        </motion.div>
                                        <motion.div variants={itemVariants}>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                                className="block w-full rounded-md border border-zinc-700 bg-transparent px-5 py-3 text-base text-white transition focus:border-red-500 focus:ring-red-500"
                                                placeholder="Subjek"
                                                required
                                            />
                                            <InputError message={errors.subject} className="mt-2" />
                                        </motion.div>
                                        <motion.div variants={itemVariants}>
                                            <textarea
                                                name="message"
                                                rows={5}
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                className="block w-full rounded-md border border-zinc-700 bg-transparent px-5 py-3 text-base text-white transition focus:border-red-500 focus:ring-red-500"
                                                placeholder="Tulis pesan Anda"
                                                required
                                            ></textarea>
                                            <InputError message={errors.message} className="mt-2" />
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="w-full text-center">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-block rounded-md bg-red-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-900"
                                            >
                                                {processing ? 'Mengirim...' : 'Kirim Pesan'}
                                            </button>
                                        </motion.div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </motion.section>
                </div>
                {/* Map Section - Tanpa Animasi (karena iframe bisa jadi kompleks untuk animasi) */}
                <section id="map" className="h-[300px] w-full md:h-[400px] lg:h-[500px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.89519653191!2d97.15526301037409!3d5.120586994835039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304783da9c916c53%3A0xf41547f42ad1dbbc!2sSekretariat%20UKM%20POLICY!5e0!3m2!1sid!2sid!4v1754212125977!5m2!1sid!2sid"
                        className="h-full w-full border-0"
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
