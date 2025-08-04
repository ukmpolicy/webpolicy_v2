import { Button } from '@/components/ui/button';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SiInstagram, SiTiktok } from 'react-icons/si';
import AppLogoHome from './app-logo';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AppHeader() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { url, props } = usePage<{ auth: { user?: { name: string; email: string; role_id?: number | null } } }>();
    const { auth } = props;

    const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Beranda', href: '/' },
        { label: 'Tentang', href: '/about' },
        { label: 'Berita', href: '/berita' },
        { label: 'Dokumentasi', href: '/dokumentasi' },
        { label: 'Kontak', href: '/kontak' },
    ];

    const isActive = (href: string) => url === href || (href !== '/' && url.startsWith(href));

    const getProfileImageUrl = () => {
        if (auth.user) {
            return '/assets/default_picture.webp';
        }
        return '';
    };

    const profileImageSrc = getProfileImageUrl();

    const handleLogout = () => {
        Inertia.post(
            route('logout'),
            {},
            {
                onSuccess: () => {
                    Inertia.visit('/');
                    setMobileSidebarOpen(false);
                },
                onError: (errors) => {
                    console.error('Logout failed:', errors);
                },
            },
        );
    };

    const userHasRole = auth.user && auth.user.role_id !== null;

    return (
        <>
            {/* HEADER UTAMA */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 z-50 w-full border-b border-neutral-800 transition-all duration-300 ${
                    scrolled ? 'bg-black/60 shadow-lg backdrop-blur-md' : 'backdrop-blur-0 bg-black/100 shadow-none'
                }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        {/* Logo Aplikasi */}
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogoHome />
                        </Link>

                        {/* Navigasi Desktop */}
                        <nav className="hidden gap-8 font-semibold tracking-wide text-white lg:flex">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group relative text-sm uppercase transition-all duration-300 ${
                                        isActive(item.href) ? 'text-red-500' : 'text-white'
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    <span
                                        className={`absolute bottom-0 left-0 h-0.5 bg-red-500 transition-all duration-300 ${
                                            isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`}
                                    />
                                </Link>
                            ))}
                        </nav>

                        {/* Aksi Desktop (Login/Dropdown Profil) */}
                        <div className="hidden items-center gap-4 lg:flex">
                            {auth.user ? (
                                <DropdownMenu>
                                    {/* Tombol Pemicu Dropdown (menggunakan gambar profil) */}
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full p-0 hover:bg-neutral-700/50"
                                        >
                                            <img src={profileImageSrc} alt="User Profile" className="h-full w-full object-cover" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    {/* Konten Dropdown Menu */}
                                    <DropdownMenuContent className="z-50 w-56 border-neutral-700 bg-neutral-800 text-white">
                                        {/* Label Nama & Email Pengguna */}
                                        <DropdownMenuLabel className="p-2 text-sm font-normal text-neutral-300">
                                            {/* MODIFIKASI: Tambahkan 'truncate', 'overflow-hidden', 'whitespace-nowrap' */}
                                            <div className="truncate overflow-hidden font-bold whitespace-nowrap" title={auth.user.name}>
                                                {auth.user.name}
                                            </div>
                                            <div
                                                className="truncate overflow-hidden text-xs whitespace-nowrap text-neutral-400"
                                                title={auth.user.email}
                                            >
                                                {auth.user.email}
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-neutral-700" />

                                        {/* Item Menu Umum (Profile, Notification, Settings) */}
                                        <DropdownMenuItem asChild>
                                            <Link href={route('profile.edit')} className="block cursor-pointer p-2 hover:bg-neutral-700">
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={route('home')} className="block cursor-pointer p-2 hover:bg-neutral-700">
                                                Notification
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={route('home')} className="block cursor-pointer p-2 hover:bg-neutral-700">
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>

                                        {/* Item Menu Dashboard (Kondisional) */}
                                        {userHasRole && (
                                            <DropdownMenuItem asChild>
                                                <Link href={route('dashboard')} className="block cursor-pointer p-2 hover:bg-neutral-700">
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuSeparator className="bg-neutral-700" />
                                        {/* Item Menu Logout */}
                                        <DropdownMenuItem
                                            className="cursor-pointer p-2 text-red-400 hover:bg-red-600 hover:text-white"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/login">
                                    <Button className="bg-red-600 font-semibold text-white hover:bg-red-700">LOGIN</Button>
                                </Link>
                            )}
                        </div>

                        {/* Toggle Mobile (Hanya Menu Hamburger) */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <Button onClick={toggleMobileSidebar} variant="ghost" size="icon" className="text-white">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* SIDEBAR MOBILE */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-0 right-0 z-50 flex h-full w-80 flex-col bg-[#111] p-6 text-white shadow-xl lg:hidden"
                    >
                        {/* Header Sidebar (Logo Aplikasi & Tombol Tutup) */}
                        <div className="mb-6 flex items-center justify-between">
                            <AppLogoHome />
                            <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
                                <X className="h-6 w-6 text-white" />
                            </Button>
                        </div>
                        {/* Konten Utama Sidebar (Bisa di-scroll) */}
                        <div className="flex flex-grow flex-col overflow-y-auto pr-2">
                            {/* Bagian Profil Pengguna / Login */}
                            {auth.user ? (
                                <div className="mb-6 flex flex-col items-center rounded-lg border border-neutral-700 bg-neutral-800/50 p-4">
                                    <Link href={route('profile.edit')} onClick={toggleMobileSidebar}>
                                        <Button
                                            variant="ghost"
                                            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full p-0 text-base font-semibold text-white hover:bg-neutral-700/50"
                                        >
                                            <img src={profileImageSrc} alt="User Profile" className="h-full w-full object-cover" />
                                        </Button>
                                    </Link>
                                    {/* MODIFIKASI: Tambahkan 'truncate', 'overflow-hidden', 'whitespace-nowrap' */}
                                    <p
                                        className="w-full truncate overflow-hidden px-2 text-center text-lg font-bold whitespace-nowrap text-white"
                                        title={auth.user.name}
                                    >
                                        {auth.user.name}
                                    </p>
                                    <p
                                        className="w-full truncate overflow-hidden px-2 text-center text-sm whitespace-nowrap text-neutral-400"
                                        title={auth.user.email}
                                    >
                                        {auth.user.email}
                                    </p>
                                    <hr className="my-4 border-neutral-700" />
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <Link href="/login" className="block w-full" onClick={toggleMobileSidebar}>
                                        <Button className="w-full bg-red-600 font-semibold text-white hover:bg-red-700">LOGIN</Button>
                                    </Link>
                                    <hr className="my-4 border-neutral-700" />
                                </div>
                            )}

                            {/* Navigasi Utama */}
                            <nav className="mb-6 flex flex-col space-y-4">
                                <h3 className="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Navigasi Utama</h3>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={toggleMobileSidebar}
                                        className={`text-base font-semibold transition ${
                                            isActive(item.href) ? 'text-red-500' : 'text-white hover:text-red-500'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Link Akun Saya (Kondisional: jika user login) */}
                            {auth.user && (
                                <>
                                    <hr className="mb-6 border-neutral-700" />
                                    <nav className="mb-6 flex flex-col space-y-4">
                                        <h3 className="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Akun Saya</h3>
                                        <Link
                                            href={route('profile.edit')}
                                            onClick={toggleMobileSidebar}
                                            className="text-base font-semibold text-white transition hover:text-red-500"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href={route('home')}
                                            onClick={toggleMobileSidebar}
                                            className="text-base font-semibold text-white transition hover:text-red-500"
                                        >
                                            Notification
                                        </Link>
                                        <Link
                                            href={route('home')}
                                            onClick={toggleMobileSidebar}
                                            className="text-base font-semibold text-white transition hover:text-red-500"
                                        >
                                            Settings
                                        </Link>
                                        {userHasRole && (
                                            <Link
                                                href={route('dashboard')}
                                                onClick={toggleMobileSidebar}
                                                className="text-base font-semibold text-white transition hover:text-red-500"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                    </nav>
                                </>
                            )}

                            {/* Tombol Logout (Kondisional: jika user login) */}
                            {auth.user && (
                                <div className="mt-auto pt-4">
                                    <Button className="w-full bg-red-600 text-white hover:bg-red-700" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </div>
                            )}

                            {/* Informasi Kontak & Sosial Media */}
                            <hr className="my-6 border-neutral-700" />
                            <div className="space-y-4 text-left text-sm text-neutral-400">
                                <h3 className="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Informasi Kontak</h3>
                                <p className="text-sm leading-relaxed text-neutral-300">
                                    Berpartisipasi dan berperan aktif dalam mengembangkan jaringan kerjasama dengan lembaga Politeknik Negeri
                                    Lhokseumawe, komunitas Linux dan Open Source lainnya, Perguruan tinggi dan Pemerintah Daerah maupun Pusat.
                                </p>
                                <div>
                                    <span className="mb-1 block font-semibold text-white">ALAMAT</span>
                                    <p>Lhokseumawe, Bukit Rata</p>
                                </div>
                                <div>
                                    <span className="mb-1 block font-semibold text-white">EMAIL</span>
                                    <p>policy.lhokseumawe@gmail.com</p>
                                </div>
                            </div>

                            {/* Ikon Media Sosial */}
                            <div className="mt-6 flex justify-center gap-4">
                                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700">
                                        <SiTiktok size={22} />
                                    </div>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700">
                                        <SiInstagram size={22} />
                                    </div>
                                </a>
                            </div>
                        </div>{' '}
                        {/* End flex-grow overflow-y-auto pr-2 */}
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
