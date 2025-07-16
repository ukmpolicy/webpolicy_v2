import astronaut from "@/assets/images/policy2.png";

export default function AppVisiMisi() {
  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Ilustrasi */}
        <div className="flex justify-center">
          <img
            src={astronaut}
            alt="Astronaut holding flag"
            className="w-full max-w-[320px] md:max-w-[420px] object-contain"
          />
        </div>

        {/* Konten Visi & Misi */}
        <div className="space-y-12">
          {/* Visi */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 border-l-4 border-red-600 pl-4">
              VISI
            </h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              Mewujudkan Politeknik Negeri Lhokseumawe sebagai <span className="text-white font-semibold">Cyber Campus</span> dan <span className="text-white font-semibold">Cyber Community</span>.<br />
              Memerdekakan dan membudayakan penggunaan ICT dengan GNU/Linux dan Open Source.
            </p>
          </div>

          {/* Misi */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 border-l-4 border-red-600 pl-4">
              MISI
            </h2>
            <ul className="list-disc space-y-4 pl-6 text-base md:text-lg leading-relaxed text-gray-400">
              <li>Memasyarakatkan GNU/Linux dan Open Source.</li>
              <li>Mensosialisasikan Linux dan Open Source melalui event rutin.</li>
              <li>
                Berpartisipasi aktif dalam mengembangkan jaringan kerjasama dengan lembaga di Politeknik Negeri Lhokseumawe, komunitas Linux/Open Source lain, Perguruan Tinggi, dan Pemerintah.
              </li>
              <li>Mengembangkan dan memanfaatkan aplikasi Open Source.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
