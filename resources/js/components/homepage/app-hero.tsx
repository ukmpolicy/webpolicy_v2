import logo from '@/assets/images/banner-man.png';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-black pt-20 text-white">
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
            <div className="pointer-events-none absolute inset-0 z-10">
                <div className="absolute -top-20 -left-20 h-[300px] w-[300px] rounded-full bg-red-600/30 opacity-30 blur-3xl sm:h-[400px] sm:w-[400px]" />
                <div className="absolute right-10 bottom-10 h-[200px] w-[200px] rounded-full bg-white/10 opacity-10 blur-2xl sm:h-[300px] sm:w-[300px]" />
            </div>

            {/* Main Content */}
            <div className="relative z-20 container mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-6 md:-mt-20 lg:grid-cols-[70%_30%] lg:gap-4">
                    {/* Text Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 text-center lg:text-left"
                    >
                        <motion.h1
                            className="text-3xl leading-snug font-extrabold tracking-tight uppercase sm:text-4xl lg:text-5xl"
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
                            className="mx-auto max-w-xl text-sm leading-relaxed text-gray-400 sm:text-lg md:text-2xl lg:mx-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3, duration: 0.5 }}
                        >
                            <span className="font-semibold">Go Linux.</span> <span className="font-semibold">Go Open Source.</span>
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:items-start lg:justify-start"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                        >
                            <a
                                href="#"
                                className="inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-700"
                            >
                                Bergabung Sekarang
                            </a>
                            <a
                                href="/about"
                                className="flex items-center justify-center gap-3 rounded-md border border-white/20 bg-white/5 px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white/10"
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
                            className="w-56 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] sm:w-72 lg:w-96"
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: 'loop',
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
