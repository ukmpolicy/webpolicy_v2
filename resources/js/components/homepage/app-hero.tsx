import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black text-white h-screen flex items-center justify-center"
    >
      {/* Dekorasi latar belakang */}
      <div className="absolute inset-0 -z-10">
        <div className="w-[400px] h-[400px] bg-red-600/30 rounded-full blur-3xl absolute -top-20 -left-20 opacity-30" />
        <div className="w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl absolute bottom-10 right-10 opacity-10" />
      </div>

      {/* Konten utama */}
      <div className="container mx-auto px-4">
        <div className="w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[1000px]"
          >
            <motion.h1
              className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-snug tracking-tight uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              Selamat Datang di{" "}
              <motion.span
                className="text-red-600 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Policy
              </motion.span>
              <br />
              <motion.span
                className="text-gray-300"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                Polytechnic Linux Community
              </motion.span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-9 max-w-[600px] text-base sm:text-lg text-gray-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              Kami adalah komunitas penggemar Linux dari Politeknik yang penuh semangat.
              Bergabunglah bersama kami untuk menjelajahi open source, berkontribusi ke proyek nyata, dan mengembangkan karier teknologi Anda.
            </motion.p>

            <motion.div
              className="mb-10 flex flex-wrap justify-center gap-4 md:gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-5 py-3 text-base font-semibold shadow-md hover:scale-105 hover:bg-red-700 transition-all duration-300 md:px-7 md:py-[14px]"
              >
                Bergabung Sekarang
              </a>

              <a
                href="/about"
                className="flex items-center gap-3 rounded-md border border-white/20 bg-white/5 px-5 py-3 text-base font-medium text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 md:px-7 md:py-[14px]"
              >
                Pelajari Lebih Lanjut
              </a>

            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
