import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogoHome from './app-logo';
import AppSidebar from './app-sidebar';

export default function AppHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { url, props } = usePage(); // Destructure props dari usePage()
>>>>>>>>> Temporary merge branch 2

    const { auth } = props; // Ambil object auth dari props. auth.user akan ada jika sudah login.

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Berita', href: '/berita' },
        { label: 'Dokumentasi', href: '/gallery' },
        { label: 'Contact', href: '/contact' },
    ];

    const isActive = (href: string) => url === href || (href !== '/' && url.startsWith(href));

    // Fungsi untuk mendapatkan inisial dari nama
    const getUserInitials = (name) => {
        if (!name) return '';
        const parts = name.split(' ').filter((part) => part.length > 0);
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const userInitials = auth.user ? getUserInitials(auth.user.name) : '';

    return (
        <>
            {/* HEADER */}
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
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogoHome />
                        </Link>

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

                        <div className="hidden items-center gap-4 lg:flex">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 p-0 text-base font-semibold text-white transition hover:bg-red-700">
                                        {userInitials}
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <Button className="bg-red-600 font-semibold text-white transition hover:bg-red-700">LOGIN</Button>
                                </Link>
                            )}
                            <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Open Sidebar">
                                <LayoutGrid className="h-5 w-5 text-white" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 lg:hidden">
                            <Button onClick={toggleMenu} variant="ghost" size="icon" className="text-white" aria-label="Toggle menu">
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 p-0 text-sm font-semibold text-white transition hover:bg-red-700">
                                        {userInitials}
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <Button className="bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
                                        LOGIN
                                    </Button>
                                </Link>
                            )}
                            <Button onClick={toggleSidebar} variant="ghost" size="icon" className="text-white" aria-label="Open Sidebar">
                                <LayoutGrid className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed top-[70px] right-0 left-0 z-40 w-full rounded-b-2xl border-t border-neutral-800 bg-[#111]/90 px-6 py-6 text-white shadow-2xl backdrop-blur-xl lg:hidden"
                    >
                        <nav className="flex flex-col divide-y divide-neutral-700 text-sm font-semibold">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block py-4 tracking-wide uppercase transition ${
                                        isActive(item.href) ? 'text-red-500' : 'text-white hover:text-red-500'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-6">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button className="w-full bg-red-600 font-semibold text-white hover:bg-red-700">Dashboard</Button>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <Button className="w-full bg-red-600 font-semibold text-white hover:bg-red-700">LOGIN</Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SIDEBAR */}
            <AnimatePresence>{sidebarOpen && <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}</AnimatePresence>
        </>
    );
}
