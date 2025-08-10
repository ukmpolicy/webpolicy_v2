import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import AppLoading from '@/components/homepage/app-loading';
import NotificationSection from '@/components/homepage/profile-user/notification-section';
import OpenRequirement from '@/components/homepage/profile-user/open-requirement';
import UpdateProfileInformation from '@/components/homepage/profile-user/update-profile-information';

// Mengimpor komponen-komponen yang sudah dipisahkan

export default function ProfileUser() {
    // Menerima props 'isBirthday' dan 'memberName' dari server
    const { props } = usePage();
    const { user, status, isBirthday, memberName } = props;

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
                staggerChildren: 0.1,
            },
        },
        hidden: { opacity: 0 },
    };

    const itemVariants = {
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        hidden: { opacity: 0, y: 20 },
    };

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        // Saat komponen dimuat, tambahkan kelas 'public-theme'
        document.body.classList.add('public-theme');

        // Saat komponen tidak lagi digunakan (berpindah halaman), hapus kelasnya
        return () => {
            document.body.classList.remove('public-theme');
        };
    }, []); // Array kosong memastikan efek ini hanya berjalan sekali

    if (isLoading) return <AppLoading />;

    return (
        <>
            <Head title="Profile Pengguna - UKM POLICY" />
            <AppHeader />
            <main className="min-h-screen bg-black text-white">
                {/* Header Halaman - Dengan Animasi */}
                <motion.section initial="hidden" animate="visible" variants={fadeInSlideUp} className="relative overflow-hidden bg-black py-12">
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
                                <span className="font-bold text-red-500">Profil</span>
                            </motion.div>
                            <motion.h1
                                variants={itemVariants}
                                className="mb-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-3xl md:text-4xl"
                            >
                                PROFIL PENGGUNA
                            </motion.h1>
                            <motion.p variants={itemVariants} className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                                Kelola informasi akun Anda dan pengaturan lainnya.
                            </motion.p>
                        </div>
                    </div>
                    <div className="w-full border-t border-neutral-800"></div>
                </motion.section>

                {/* Konten Profil - Dengan Animasi */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.section id="profile" initial="hidden" animate="visible" variants={containerVariants} className="py-10 md:py-12">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
                            {/* Kolom Kiri: Form Update Profil */}
                            <motion.div variants={itemVariants}>
                                <UpdateProfileInformation user={user} status={status} />
                            </motion.div>

                            {/* Kolom Kanan: Notifikasi dan Open Requirement */}
                            <div className="flex flex-col space-y-8 md:space-y-12">
                                <motion.div variants={itemVariants}>
                                    {/* Meneruskan props ke komponen Notifikasi */}
                                    <NotificationSection isBirthday={isBirthday} memberName={memberName} />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <OpenRequirement />
                                </motion.div>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </main>
            <AppFooter />
        </>
    );
}
