import logo from '@/assets/images/favicon.png';
import { usePage } from '@inertiajs/react';
import { SiInstagram, SiTiktok, SiYoutube } from 'react-icons/si';

export default function AppFooter() {
    // Ambil latestArticles dari props Inertia
    const { latestArticles } = usePage().props as {
        latestArticles?: { id: number; title: string; slug: string }[];
    };

    // Navigasi utama
    const navItems = [
        { label: 'Beranda', href: '/' },
        { label: 'Tentang', href: '/about' },
        { label: 'Berita', href: '/berita' },
        { label: 'Dokumentasi', href: '/dokumentasi' },
        { label: 'Kontak', href: '/kontak' },
    ];

    // Social media
    const socialLinks = [
        { icon: SiYoutube, href: 'https://www.youtube.com/@ukmpolicypnl' },
        { icon: SiTiktok, href: 'https://www.tiktok.com/@ukmpolicypnl' },
        { icon: SiInstagram, href: 'https://www.instagram.com/ukmpolicy.kbmpnl/' },
    ];

    return (
        <footer className="border-t border-white/10 bg-black pt-16 text-gray-300">
            {/* Bagian atas */}
            <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 border-b border-gray-800 px-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
                {/* Logo & Deskripsi */}
                <div>
                    <div className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                        <img src={logo} alt="Logo UKM POLICY" className="h-8 w-8" />
                        UKM POLICY
                    </div>
                    <p className="text-sm leading-relaxed text-gray-400">
                        Berpartisipasi aktif mengembangkan jaringan kerjasama dengan lembaga Politeknik Negeri Lhokseumawe, komunitas Linux dan Open
                        Source, perguruan tinggi, serta pemerintah daerah maupun pusat.
                    </p>
                    <div className="mt-6 flex space-x-4">
                        {socialLinks.map(({ icon: Icon, href }, idx) => (
                            <a
                                key={idx}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 transition-colors duration-300 hover:text-white"
                            >
                                <Icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Navigasi */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">Navigasi</h4>
                    <ul className="space-y-3 text-sm">
                        {navItems.map((item, idx) => (
                            <li key={idx}>
                                <a href={item.href} className="transition-colors hover:text-white">
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Berita Terbaru */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">Berita Terbaru</h4>
                    <ul className="space-y-3 text-sm">
                        {latestArticles && latestArticles.length > 0 ? (
                            latestArticles.map((article) => (
                                <li key={article.id}>
                                    <a href={`/berita/${article.slug}`} className="transition-colors hover:text-white">
                                        {article.title}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">Belum ada berita</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Bagian bawah */}
            <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-gray-500 md:flex-row">
                <div>© {new Date().getFullYear()} UKM POLICY. Hak cipta dilindungi.</div>
                <div className="flex flex-wrap gap-6">
                    {['Kebijakan Privasi', 'Pernyataan Hukum', 'Syarat Layanan'].map((link, idx) => (
                        <a key={idx} href="#" className="transition-colors hover:text-white">
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
