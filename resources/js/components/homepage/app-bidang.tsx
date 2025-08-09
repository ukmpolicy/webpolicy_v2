"use client";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";

type Division = {
  id: number;
  name: string;
  description?: string;
};

export default function AppBidang({ divisions }: { divisions: Division[] }) {
  return (
    <section className="relative px-6 md:px-10 py-16 bg-black text-white overflow-hidden border-b border-zinc-800">
      {/* Pattern Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]"
        style={{ backgroundSize: "50px 50px" }}
      ></div>

      {/* Glow efek */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[400px] h-[400px] bg-red-500/10 blur-[120px] rounded-full"></div>

      {/* Garis animasi */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[pulse_6s_ease-in-out_infinite]"></div>
      </div>

      <div className="relative max-w-[1200px] mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold italic relative inline-block">
            Bidang
            <span className="block w-28 h-[3px] bg-red-600 absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full"></span>
          </h2>
        </div>

        {/* List */}
        <div className="space-y-10">
          {divisions.length > 0 ? (
            divisions.map((item, idx) => (
              <div
                key={item.id}
                className={clsx(
                  "group flex items-start justify-between border-b border-gray-800 pb-8 transition-all duration-300 hover:border-red-600 hover:bg-white/[0.02] rounded-xl px-4"
                )}
              >
                {/* Left: Number + Content */}
                <div className="flex flex-col md:flex-row md:items-start md:space-x-10 w-full">
                  {/* Nomor */}
                  <div className="text-2xl md:text-3xl font-mono font-bold text-red-500 w-16 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col md:flex-row md:justify-between w-full">
                    <div className="mb-4 md:mb-0">
                      <div className="text-lg uppercase tracking-wider text-gray-400">
                        Bidang
                      </div>
                      <div className="text-3xl md:text-4xl font-extrabold transition-colors duration-300 group-hover:text-red-500">
                        {item.name}
                      </div>
                    </div>
                    <div className="md:max-w-2xl text-gray-400 leading-relaxed text-lg">
                      Bidang ini memiliki fokus utama pada{" "}
                      <span className="text-white font-semibold">
                        {item.name ?? "bidang yang belum terdefinisi"}
                      </span>
                      , yang memainkan peran penting dalam menjalankan visi dan misi organisasi.
                    </div>
                  </div>
                </div>

                {/* Button */}
                <div className="ml-6 shrink-0">
                  <button className="p-4 rounded-lg bg-zinc-900 group-hover:bg-red-600 transition-colors duration-300">
                    <ArrowUpRight
                      size={22}
                      className="group-hover:text-black transition-colors"
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-lg italic">
              Tidak ada bidang.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
