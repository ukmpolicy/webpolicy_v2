import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import logo from "@/assets/images/favicon.png";
import { toast } from 'sonner';


export default function AppFooter() {
  return (
    <footer className="bg-black text-gray-300 pt-16 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-800">

        {/* Logo & Deskripsi */}
        <div>
          <div className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <img src={logo} alt="Logo UKM POLICY" className="w-8 h-8" />
            UKM POLICY
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Menyediakan informasi kebijakan yang transparan, mudah diakses, dan selalu diperbarui untuk organisasi mahasiswa dan masyarakat umum.
          </p>
          <div className="flex space-x-4 mt-6">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
              <Icon
                key={idx}
                className="w-5 h-5 text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Kebijakan */}
        <div>
          <h4 className="text-white font-semibold mb-4">Kebijakan</h4>
          <ul className="space-y-3 text-sm">
            {["Kebijakan Privasi", "Syarat Layanan", "Penggunaan Data", "Hak Akses"].map((item, idx) => (
              <li key={idx}>
                <a href="#" className="hover:text-white transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sumber Daya */}
        <div>
          <h4 className="text-white font-semibold mb-4">Sumber Daya</h4>
          <ul className="space-y-3 text-sm">
            {["Dokumentasi", "Buku Panduan Mahasiswa", "Pusat Bantuan", "Panduan Komunitas"].map((item, idx) => (
              <li key={idx}>
                <a href="#" className="hover:text-white transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Berlangganan */}
        <div>
          <h4 className="text-white font-semibold mb-4">Berlangganan</h4>
          <p className="text-sm mb-4 text-gray-400">
            Dapatkan pembaruan kebijakan dan berita terbaru dari UKM POLICY langsung ke email Anda.
          </p>
          <form className="flex rounded-md overflow-hidden border border-gray-700 focus-within:border-red-500">
            <input
              type="email"
              placeholder="Alamat email"
              className="w-full px-3 py-2 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
            />
            <button type="submit" className="bg-red-600 hover:bg-red-700 transition-colors p-2">
              <Mail className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>

      {/* Bagian Bawah */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4">
        <div>© 2025 UKM POLICY. Hak cipta dilindungi.</div>
        <div className="flex space-x-6">
          {["Kebijakan Privasi", "Pernyataan Hukum", "Syarat Layanan"].map((link, idx) => (
            <a key={idx} href="#" className="hover:text-white transition-colors">{link}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
