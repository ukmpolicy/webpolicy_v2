import logo from '@/assets/images/policy2.png';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React from 'react';

const AppLoading: React.FC = () => {
    return (
        <>
            <Head title="UKM POLICY - KBMPNL" />
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="flex flex-col items-center">
                    <motion.div
                        className="rounded-full border-4 border-red-600 p-3"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: 'loop',
                        }}
                    >
                        <img src={logo} alt="Policy Logo" className="h-24 w-24 object-contain" />
                    </motion.div>

                    <p className="mt-6 text-4xl font-bold text-red-600">UKM POLICY</p>
                </div>
            </motion.div>
        </>
    );
};

export default AppLoading;
