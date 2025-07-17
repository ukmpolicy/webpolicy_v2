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
    <section className="px-6 md:px-10 py-12 bg-black text-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-center text-3xl md:text-4xl font-bold italic mb-12 relative">
            Bidang
            <div className="absolute w-28 h-[2px] bg-red-600 left-1/2 -translate-x-1/2 -bottom-2" />
          </h2>
        </div>

        <div className="space-y-8">
          {divisions.length > 0 ? (
            divisions.map((item, idx) => (
              <div
                key={item.id}
                className={clsx(
                  "group flex items-start justify-between border-b border-gray-700 pb-6 transition-all duration-300 hover:border-red-600"
                )}
              >
                <div className="flex flex-col md:flex-row md:items-start md:space-x-10 w-full">
                  <div className="text-lg font-mono text-white w-12 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between w-full">
                    <div>
                      <div className="text-base font-bold text-white">Bidang</div>
                      <div className="text-3xl font-extrabold transition-colors duration-300 group-hover:text-red-500">
                        {item.name}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:max-w-2xl text-gray-400">
                      Bidang ini memiliki fokus utama pada{" "}
                      <span className="text-white font-semibold">
                        {item.name ?? "bidang yang belum terdefinisi"}
                      </span>
                      , yang memainkan peran penting dalam menjalankan visi dan misi organisasi.
                    </div>

                  </div>
                </div>
                <div className="ml-4 shrink-0">
                  <button className="p-3 rounded-md bg-zinc-900 group-hover:bg-red-600 transition-colors duration-300">
                    <ArrowUpRight size={20} className="group-hover:text-black" />
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
