import logo from '@/assets/images/policy2.png';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import React from 'react';
import { SiInstagram, SiTiktok } from 'react-icons/si';

interface AppSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {isOpen && (
                <motion.aside
                    key="sidebar"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="border-white-600 fixed top-0 right-0 z-50 flex h-screen w-[300px] flex-col rounded-bl-xl border-b-2 border-l-2 bg-black p-6 text-white"
                >
                    <div className="flex flex-1 flex-col justify-between overflow-y-auto pb-6">
                        {/* Top section */}
                        <div>
                            {/* Close button */}
                            <div className="mb-4 flex justify-end">
                                <button onClick={onClose} className="rounded-md bg-red-600 p-2 text-white" aria-label="Close Sidebar">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Login button */}
                            <Link href="/login">
                                <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-md bg-red-600 py-2 text-base text-white hover:bg-red-700">
                                    <ArrowRight className="h-4 w-4" />
                                    Login
                                </button>
                            </Link>

                            <hr className="mb-5 border-neutral-700" />

                            {/* Logo and description */}
                            <div className="mb-5 text-center">
                                <img src={logo} alt="Logo Policy" className="mx-auto mb-3 h-16 w-16" />
                                <h2 className="mb-2 text-lg font-bold text-white">UKM POLICY</h2>
                                <p className="text-sm leading-relaxed text-neutral-300">
                                    Berpartisipasi dan berperan aktif dalam mengembangkan jaringan kerjasama dengan lembaga Politeknik Negeri
                                    Lhokseumawe, komunitas Linux dan Open Source lainnya, Perguruan tinggi dan Pemerintah Daerah maupun Pusat.
                                </p>
                            </div>

                            {/* Contact info */}
                            <div className="space-y-4 text-left text-sm text-neutral-400">
                                <div>
                                    <span className="mb-1 block font-semibold text-white">ADDRESS</span>
                                    <p>Lhokseumawe, Bukit Rata</p>
                                </div>
                                <div>
                                    <span className="mb-1 block font-semibold text-white">EMAIL</span>
                                    <p>policy.lhokseumawe@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom social icons */}
                        <div className="mt-8 flex justify-center gap-4">
                            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700">
                                    <SiTiktok size={22} />
                                </div>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700">
                                    <SiInstagram size={22} />
                                </div>
                            </a>
                        </div>
                    </div>
                </motion.aside>
            )}
        </>
    );
};

export default AppSidebar;
