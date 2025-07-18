import logoImage from "@/assets/images/policy2.png";
import { BadgeCheck } from "lucide-react";

export default function AboutLogo() {
  return (
    <section className="relative bg-gradient-to-br from-zinc-900/80 to-black text-white py-20 px-6 md:px-12 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
        
        {/* Gambar Logo */}
        <div className="flex justify-center">
          <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700 shadow-2xl">
            <img
              src={logoImage}
              alt="Logo UKM POLICY"
              className="max-w-[250px] md:max-w-[350px] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            />
          </div>
        </div>

        {/* Konten Makna Logo */}
        <div className="text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight flex items-center gap-3">
            <BadgeCheck className="text-red-500 w-7 h-7" />
            Makna Logo UKM POLICY
          </h2>

          <ul className="space-y-5 text-zinc-300 text-base md:text-lg leading-relaxed font-light list-disc list-inside marker:text-red-500">
            <li>
              <span className="text-white font-medium">Gambar Pinguin:</span> Menandakan maskot dari Linux.
            </li>
            <li>
              <span className="text-white font-medium">Kata POLICY:</span> Singkatan dari <span className="italic">Polytechnic Linux Community</span>.
            </li>
            <li>
              <span className="text-white font-medium">Pistol pada kata POLICY:</span> Melambangkan bahwa keamanan dengan Linux lebih terjamin.
            </li>
            <li>
              <span className="text-white font-medium">Lencana warna hitam:</span> Melambangkan bakat terpendam dan persatuan anggota.
            </li>
            <li>
              <span className="text-white font-medium">Target merah:</span> Menunjukkan bahwa Linux dan Open Source adalah fokus utama organisasi.
            </li>
            <li>
              <span className="text-white font-medium">Kata Lhokseumawe:</span> Menandakan bahwa UKM ini berasal dari Kota Lhokseumawe.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
