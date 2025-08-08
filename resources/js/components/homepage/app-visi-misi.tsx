import astronaut from '@/assets/images/policy2.png';
import { usePage } from '@inertiajs/react';

export default function AppVisiMisi() {
    const { visi = '', misi = [] } = usePage().props as { visi?: string; misi?: string[] };

    // Jika visi adalah string multiline, ubah menjadi array berdasarkan newline
    const visiList = typeof visi === 'string' ? visi.split('\n').filter(Boolean) : [];

    return (
        <section className="bg-black px-6 py-20 text-white">
            <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-2">
                {/* Ilustrasi */}
                <div className="flex justify-center">
                    <img src={astronaut} alt="Astronaut holding flag" className="w-[200px] object-contain md:w-[240px] lg:w-[280px]" />
                </div>

                {/* Konten Visi & Misi */}
                <div className="space-y-12">
                    {/* Visi */}
                    <div>
                        <h2 className="mb-4 border-l-4 border-red-600 pl-4 text-3xl font-bold md:text-4xl">VISI</h2>
                        <ul className="list-disc space-y-4 pl-6 text-base leading-relaxed text-gray-400 md:text-lg">
                            {visiList.length > 0 ? visiList.map((item, idx) => <li key={idx}>{item}</li>) : <li>-</li>}
                        </ul>
                    </div>

                    {/* Misi */}
                    <div>
                        <h2 className="mb-4 border-l-4 border-red-600 pl-4 text-3xl font-bold md:text-4xl">MISI</h2>
                        <ul className="list-disc space-y-4 pl-6 text-base leading-relaxed text-gray-400 md:text-lg">
                            {Array.isArray(misi) && misi.length > 0 ? misi.map((item, idx) => <li key={idx}>{item}</li>) : <li>-</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
