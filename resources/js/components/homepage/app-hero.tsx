import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section id="home" className="relative flex h-screen items-center justify-center overflow-hidden bg-black text-white">
            {/* Dekorasi latar belakang */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-red-600/30 opacity-30 blur-3xl" />
                <div className="absolute right-10 bottom-10 h-[300px] w-[300px] rounded-full bg-white/10 opacity-10 blur-2xl" />
            </div>

            {/* Konten utama */}
            <div className="container mx-auto px-4">
                <div className="flex w-full flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-[1000px]"
                    >
                        <motion.h1
                            className="mb-6 text-3xl leading-snug font-extrabold tracking-tight uppercase sm:text-4xl lg:text-5xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 1 }}
                        >
                            Selamat Datang di <br />
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
                            className="mx-auto mb-9 max-w-[800px] text-left text-base leading-relaxed text-gray-400 sm:text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3, duration: 0.5 }}
                        >
                            Kami adalah komunitas penggiat Linux dari <span className="font-semibold text-white">Politeknik</span> yang memiliki
                            semangat tinggi dalam membangun ekosistem teknologi berbasis open source.
                            <br />
                            Bergabunglah bersama kami untuk memperluas jaringan, meningkatkan portofolio, serta mempersiapkan karier profesional di
                            bidang teknologi informasi dengan landasan yang kuat pada nilai-nilai kolaboratif dan inovatif.
                            <br />
                        </motion.p>

                        <motion.div
                            className="mb-10 flex flex-wrap justify-center gap-4 md:gap-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                        >
                            <a
                                href="#"
                                className="inline-flex items-center justify-center rounded-md bg-red-700 px-5 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-800 md:px-7 md:py-[14px]"
                            >
                                Bergabung Sekarang
                            </a>

                            <a
                                href="/about"
                                className="flex items-center gap-3 rounded-md border border-white/20 bg-white/5 px-5 py-3 text-base font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white/10 md:px-7 md:py-[14px]"
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
