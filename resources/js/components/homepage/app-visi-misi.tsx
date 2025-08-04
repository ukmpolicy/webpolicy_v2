import astronaut from "@/assets/images/policy2.png";
import { usePage } from '@inertiajs/react';

export default function AppVisiMisi() {
  const { visi = '', misi = [] } = usePage().props as { visi?: string; misi?: string[] };

  // Jika visi adalah string multiline, ubah menjadi array berdasarkan newline
  const visiList = typeof visi === 'string' ? visi.split('\n').filter(Boolean) : [];

  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Ilustrasi */}
<div className="flex justify-center">
<img
  src={astronaut}
  alt="Astronaut holding flag"
  className="w-[200px] md:w-[240px] lg:w-[280px] object-contain"
/>

</div>


        {/* Konten Visi & Misi */}
        <div className="space-y-12">
          {/* Visi */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 border-l-4 border-red-600 pl-4">
              VISI
            </h2>
            <ul className="list-disc space-y-4 pl-6 text-base md:text-lg leading-relaxed text-gray-400">
              {visiList.length > 0 ? (
                visiList.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>

          {/* Misi */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 border-l-4 border-red-600 pl-4">
              MISI
            </h2>
            <ul className="list-disc space-y-4 pl-6 text-base md:text-lg leading-relaxed text-gray-400">
              {Array.isArray(misi) && misi.length > 0 ? (
                misi.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
