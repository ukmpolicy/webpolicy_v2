import logo from '@/assets/images/favicon.png';
import { Facebook, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';

export default function AppFooter() {
    return (
        <footer className="border-t border-white/10 bg-black pt-16 text-gray-300">
            <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 border-b border-gray-800 px-4 pb-12 md:grid-cols-2 lg:grid-cols-4">
                {/* Logo & Deskripsi */}
                <div>
                    <div className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                        <img src={logo} alt="Logo UKM POLICY" className="h-8 w-8" />
                        UKM POLICY
                    </div>
                    <p className="text-sm leading-relaxed text-gray-400">
                        Berpartisipasi dan berperan aktif dalam mengembangkan jaringan kerjasama dengan lembaga Politeknik Negeri Lhokseumawe ,
                        komunitas Linux dan Open Source lainnya, Perguruan tinggi dan Pemerintah Daerah maupun Pusat.
                    </p>
                    <div className="mt-6 flex space-x-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                            <Icon key={idx} className="h-5 w-5 cursor-pointer text-gray-500 transition-colors duration-300 hover:text-white" />
                        ))}
                    </div>
                </div>

                {/* Kebijakan */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">Kebijakan</h4>
                    <ul className="space-y-3 text-sm">
                        {['Kebijakan Privasi', 'Syarat Layanan', 'Penggunaan Data', 'Hak Akses'].map((item, idx) => (
                            <li key={idx}>
                                <a href="#" className="transition-colors hover:text-white">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sumber Daya */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">Sumber Daya</h4>
                    <ul className="space-y-3 text-sm">
                        {['Dokumentasi', 'Buku Panduan Mahasiswa', 'Pusat Bantuan', 'Panduan Komunitas'].map((item, idx) => (
                            <li key={idx}>
                                <a href="#" className="transition-colors hover:text-white">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Berlangganan */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">Berlangganan</h4>
                    <p className="mb-4 text-sm text-gray-400">
                        Dapatkan pembaruan kebijakan dan berita terbaru dari UKM POLICY langsung ke email Anda.
                    </p>
                    <form className="flex overflow-hidden rounded-md border border-gray-700 focus-within:border-red-500">
                        <input
                            type="email"
                            placeholder="Alamat email"
                            className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
                        />
                        <button type="submit" className="bg-red-600 p-2 transition-colors hover:bg-red-700">
                            <Mail className="h-4 w-4 text-white" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Bagian Bawah */}
            <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-gray-500 md:flex-row">
                <div>© 2025 UKM POLICY. Hak cipta dilindungi.</div>
                <div className="flex space-x-6">
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
