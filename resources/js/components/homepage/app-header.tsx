import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Menu, X, LayoutGrid } from 'lucide-react';
import AppLogoHome from './app-logo';
import AppSidebar from './app-sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { url } = usePage();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- PERUBAHAN: Sesuaikan href untuk Dokumentasi ---
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Dokumentasi', href: '/gallery' }, // <-- Diubah dari /documentation menjadi /gallery
    { label: 'Kontak', href: '/contact' },
  ];

  const isActive = (href: string) =>
    url === href || (href !== '/' && url.startsWith(href));

  return (
    <>
      {/* HEADER */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 z-50 w-full border-b border-neutral-800 transition-all duration-300 ${
          scrolled
            ? 'bg-black/60 backdrop-blur-md shadow-lg'
            : 'bg-black/100 backdrop-blur-0 shadow-none'
        }`}
      >
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="flex items-center justify-between py-4">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2">
              <AppLogoHome />
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex gap-8 text-white font-semibold tracking-wide">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative transition-all duration-300 text-sm uppercase ${
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

            {/* DESKTOP ACTIONS */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/login">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold transition">
                  Login
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label="Open Sidebar"
              >
                <LayoutGrid className="h-5 w-5 text-white" />
              </Button>
            </div>

            {/* MOBILE ACTIONS */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                onClick={toggleMenu}
                variant="ghost"
                size="icon"
                className="text-white"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="icon"
                className="text-white"
                aria-label="Open Sidebar"
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-[70px] left-0 right-0 z-40 w-full bg-[#111]/90 text-white px-6 py-6 shadow-2xl lg:hidden border-t border-neutral-800 backdrop-blur-xl rounded-b-2xl"
          >
            <nav className="flex flex-col divide-y divide-neutral-700 text-sm font-semibold">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-4 uppercase tracking-wide block transition ${
                    isActive(item.href)
                      ? 'text-red-500'
                      : 'text-white hover:text-red-500'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6">
              <Link href="/login">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
