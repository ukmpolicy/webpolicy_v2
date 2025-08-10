import logo from '@/assets/images/policy2.png';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React from 'react';

const AppLoading: React.FC = () => {
    return (
        <>
            <Head title="UKM POLICY - KBMPNL" />
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Radial Glow di belakang logo */}
                <div className="absolute flex items-center justify-center">
                    <div className="absolute w-[350px] h-[350px] rounded-full bg-red-500/20 blur-3xl"></div>
                    <div className="absolute w-[600px] h-[600px] rounded-full bg-red-500/10 blur-[100px]"></div>
                </div>

                {/* Partikel background */}
                <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => {
                        const size = Math.random() * 4 + 2;
                        return (
                            <motion.div
                                key={i}
                                className="absolute bg-red-500 rounded-full"
                                style={{
                                    width: size,
                                    height: size,
                                    left: Math.random() * window.innerWidth,
                                    top: Math.random() * window.innerHeight,
                                    opacity: 0.15,
                                }}
                                animate={{
                                    y: [0, Math.random() * 50 - 25],
                                    x: [0, Math.random() * 50 - 25],
                                    opacity: [0.15, 0.4, 0.15],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 4,
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    ease: "easeInOut",
                                }}
                            />
                        );
                    })}
                </div>

                {/* Konten Utama */}
                <div className="flex flex-col items-center relative z-10">
                    {/* Logo dengan animasi pulse */}
                    <motion.div
                        className="rounded-full p-4 shadow-lg"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.img
                            src={logo}
                            alt="Policy Logo"
                            className="h-28 w-28 object-contain drop-shadow-[0_0_25px_rgba(255,0,0,0.5)]"
                            animate={{
                                scale: [1, 1.1, 1],
                                filter: [
                                    "drop-shadow(0 0 10px rgba(255,0,0,0.5))",
                                    "drop-shadow(0 0 20px rgba(255,0,0,0.8))",
                                    "drop-shadow(0 0 10px rgba(255,0,0,0.5))"
                                ]
                            }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                repeatType: 'loop',
                            }}
                        />
                    </motion.div>

                    {/* Teks dengan glow dan fade-in di tempat */}
                    <motion.p
                        className="mt-10 text-4xl font-bold tracking-wide uppercase"
                        style={{
                            color: "#f5f5f5cc",
                            textShadow: "0 0 15px rgba(255, 0, 0, 0.6), 0 0 30px rgba(255,255,255,0.3)"
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: 1,
                            delay: 0.4,
                            ease: "easeOut"
                        }}
                    >
                        UKM POLICY
                    </motion.p>
                </div>
            </motion.div>
        </>
    );
};

export default AppLoading;
