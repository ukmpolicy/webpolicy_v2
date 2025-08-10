import astronaut from "@/assets/images/policy2.png";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function AppVisiMisi() {
  const { visi = "", misi = [] } = usePage().props as {
    visi?: string;
    misi?: string[];
  };

  const visiList =
    typeof visi === "string" ? visi.split("\n").filter(Boolean) : [];

  return (
    <section className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white py-24 px-6 overflow-hidden">
      
      {/* Pattern Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]"
        style={{ backgroundSize: "50px 50px" }}
      ></div>

      {/* Radial Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-red-600/20 blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-red-500/10 blur-[100px]"></div>

      {/* Partikel animasi */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-500/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0.1,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[30%_70%] gap-16 items-center relative z-10">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center lg:justify-start"
        >
          <img
            src={astronaut}
            alt="Policy Logo"
            className="w-[220px] md:w-[260px] lg:w-[300px] drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* VISI & MISI */}
        <div className="space-y-14">
          {/* VISI */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="mb-6">
              <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                <span className="block w-2 h-10 bg-red-600 rounded-full"></span>
                VISI
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Tujuan utama dan arah gerak komunitas.
              </p>
            </div>
            <ul className="space-y-4">
              {visiList.length > 0 ? (
                visiList.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition"
                  >
                    <CheckCircle2 className="text-red-500 w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-lg leading-relaxed">{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">-</li>
              )}
            </ul>
          </motion.div>

          {/* MISI */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="mb-6">
              <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                <span className="block w-2 h-10 bg-red-600 rounded-full"></span>
                MISI
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Langkah-langkah strategis untuk mencapai visi.
              </p>
            </div>
            <ul className="space-y-4">
              {Array.isArray(misi) && misi.length > 0 ? (
                misi.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition"
                  >
                    <CheckCircle2 className="text-red-500 w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-lg leading-relaxed">{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">-</li>
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
