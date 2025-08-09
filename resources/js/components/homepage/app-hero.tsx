import React from "react";
import { motion } from "framer-motion";
import logo from '@/assets/images/banner-man.png';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black text-white h-[calc(100vh-60px)] flex items-center"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage: "url('/assets/bg.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-30"></div>
      </div>

      {/* Blur Effects */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-red-600/30 rounded-full blur-3xl absolute -top-20 -left-20 opacity-30" />
        <div className="w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-white/10 rounded-full blur-2xl absolute bottom-10 right-10 opacity-10" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] items-center gap-6 lg:gap-4">
          
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-snug tracking-tight uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              Selamat Datang di
              <br />
              <motion.span
                className="text-red-600 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Unit Kegiatan Mahasiswa
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
              className="text-sm sm:text-lg md:text-2xl text-gray-400 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <span className="font-semibold">Go Linux.</span>{" "}
              <span className="font-semibold">Go Open Source.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-6 py-3 text-base font-semibold shadow-md hover:scale-105 hover:bg-red-700 transition-all duration-300"
              >
                Bergabung Sekarang
              </a>
              <a
                href="/about"
                className="flex items-center justify-center gap-3 rounded-md border border-white/20 bg-white/5 px-6 py-3 text-base font-medium text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Kenali Lebih Lanjut
              </a>
            </motion.div>
          </motion.div>

          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center lg:justify-start"
          >
            <motion.img
              src={logo}
              alt="Pinguin Logo"
              className="w-56 sm:w-72 lg:w-96 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
