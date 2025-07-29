import logoImage from '@/assets/images/policy2.png';
import { BadgeCheck } from 'lucide-react';

export default function AboutLogo() {
    return (
        <section className="relative bg-gradient-to-br from-zinc-900/80 to-black px-6 py-20 text-white backdrop-blur-md md:px-12">
            <div className="mx-auto grid max-w-[1200px] items-start gap-16 lg:grid-cols-[1fr_1.6fr]">
                {/* Gambar Logo */}
                <div className="flex justify-center">
                    <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6 shadow-2xl">
                        <img
                            src={logoImage}
                            alt="Logo UKM POLICY"
                            className="max-w-[250px] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] md:max-w-[350px]"
                        />
                    </div>
                </div>

                {/* Konten Makna Logo */}
                <div className="text-left">
                    <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold tracking-tight md:text-4xl">
                        <BadgeCheck className="h-7 w-7 text-red-500" />
                        Makna Logo UKM POLICY
                    </h2>

                    <ul className="list-inside list-disc space-y-5 text-base leading-relaxed font-light text-zinc-300 marker:text-red-500 md:text-lg">
                        <li>
                            <span className="font-medium text-white">Gambar Pinguin:</span> Menandakan maskot dari Linux.
                        </li>
                        <li>
                            <span className="font-medium text-white">Kata POLICY:</span> Singkatan dari{' '}
                            <span className="italic">Polytechnic Linux Community</span>.
                        </li>
                        <li>
                            <span className="font-medium text-white">Pistol pada kata POLICY:</span> Melambangkan bahwa keamanan dengan Linux lebih
                            terjamin.
                        </li>
                        <li>
                            <span className="font-medium text-white">Lencana warna hitam:</span> Melambangkan bakat terpendam dan persatuan anggota.
                        </li>
                        <li>
                            <span className="font-medium text-white">Target merah:</span> Menunjukkan bahwa Linux dan Open Source adalah fokus utama
                            organisasi.
                        </li>
                        <li>
                            <span className="font-medium text-white">Kata Lhokseumawe:</span> Menandakan bahwa UKM ini berasal dari Kota Lhokseumawe.
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
