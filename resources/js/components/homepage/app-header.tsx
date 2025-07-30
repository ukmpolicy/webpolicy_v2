import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogoHome from './app-logo';
import { SiInstagram, SiTiktok } from 'react-icons/si';
import { LogOut } from 'lucide-react'; // Pastikan ini di bagian import atas
import { Inertia } from '@inertiajs/inertia';


export default function AppHeader() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { url, props } = usePage();
  const { auth } = props;

  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);
  const toggleDesktopSidebar = () => setDesktopSidebarOpen(!desktopSidebarOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) =>
    url === href || (href !== '/' && url.startsWith(href));

  const getUserInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ').filter(Boolean);
    return parts.length === 1
      ? parts[0].substring(0, 2).toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const userInitials = auth.user ? getUserInitials(auth.user.name) : '';

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Tentang', href: '/about' },
    { label: 'Dokumentasi', href: '/gallery' },
    { label: 'Kontak', href: '/contact' },
  ];

  return (
    <>
      {/* HEADER */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 z-50 w-full border-b border-neutral-800 transition-all duration-300 ${
          scrolled
            ? 'bg-black/60 shadow-lg backdrop-blur-md'
            : 'backdrop-blur-0 bg-black/100 shadow-none'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <AppLogoHome />
            </Link>

            {/* Desktop Navigation */}
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

            {/* Desktop Actions */}
            <div className="hidden items-center gap-4 lg:flex">
              {auth.user ? (
                <Link href={route('dashboard')}>
                  <Button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 p-0 text-base font-semibold text-white hover:bg-red-700">
                    {userInitials}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="bg-red-600 font-semibold text-white hover:bg-red-700">
                    LOGIN
                  </Button>
                </Link>
              )}
              {/* <Button variant="ghost" size="icon" onClick={toggleDesktopSidebar}>
                <LayoutGrid className="h-5 w-5 text-white" />
              </Button> */}
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button onClick={toggleMobileSidebar} variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
              {auth.user ? (
                <Link href={route('dashboard')}>
                  <Button className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 p-0 text-sm font-semibold text-white hover:bg-red-700">
                    {userInitials}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                    LOGIN
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {mobileSidebarOpen && (
<motion.aside
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ duration: 0.3 }}
  className="fixed top-0 right-0 z-50 h-full w-80 bg-[#111] text-white shadow-xl border-l border-neutral-800 p-6 lg:hidden flex flex-col justify-between"

>

   <div>
  <div className="flex justify-between items-center mb-6">
    <AppLogoHome />
    <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
      <X className="h-6 w-6 text-white" />
    </Button>
  </div>

  <nav className="flex flex-col space-y-4 mb-6">
    {navItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        onClick={toggleMobileSidebar}
        className={`text-sm uppercase tracking-wide font-semibold transition ${
          isActive(item.href) ? 'text-red-500' : 'text-white hover:text-red-500'
        }`}
      >
        {item.label}
      </Link>
    ))}
  </nav>

{auth.user && (
<Button
  className="w-full bg-red-600 text-white hover:bg-red-700 mb-6"
  onClick={() => {
    Inertia.post(route('logout'), {}, {
      onSuccess: () => {
        Inertia.visit('/');
        toggleMobileSidebar();
      },
    });
  }}
>
  Logout
</Button>

)}


  <hr className='mb-6' />

  <div className="text-left text-sm text-neutral-400 space-y-4 mb-6">
                    <h2 className="text-white font-bold text-lg mb-2">UKM POLICY</h2>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Berpartisipasi dan berperan aktif dalam mengembangkan jaringan
                  kerjasama dengan lembaga Politeknik Negeri Lhokseumawe,
                  komunitas Linux dan Open Source lainnya, Perguruan tinggi dan
                  Pemerintah Daerah maupun Pusat.
                </p>
    <div>
      <span className="block font-semibold text-white mb-1">ADDRESS</span>
      <p>Lhokseumawe, Bukit Rata</p>
    </div>
    <div>
      <span className="block font-semibold text-white mb-1">EMAIL</span>
      <p>policy.lhokseumawe@gmail.com</p>
    </div>
  </div>
</div>

{/* SOCIAL MEDIA fixed di bawah */}
<div className="flex justify-center gap-4 mt-6">
  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition">
      <SiTiktok size={22} />
    </div>
  </a>
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition">
      <SiInstagram size={22} />
    </div>
  </a>
</div>


          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
