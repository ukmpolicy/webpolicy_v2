import React from "react";
import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import { SiTiktok, SiInstagram } from "react-icons/si";
import logo from "@/assets/images/policy2.png";

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
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 z-50 h-screen w-[300px] bg-black text-white p-6 border-l-2 border-b-2 border-white-600 rounded-bl-xl flex flex-col"
        >
          <div className="flex-1 flex flex-col justify-between overflow-y-auto pb-6">
            {/* Top section */}
            <div>
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={onClose}
                  className="text-white bg-red-600 p-2 rounded-md"
                  aria-label="Close Sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Login button */}
              <Link href="/login">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md flex items-center justify-center gap-2 mb-4 text-base">
                  <ArrowRight className="w-4 h-4" />
                  Login
                </button>
              </Link>

              <hr className="border-neutral-700 mb-5" />

              {/* Logo and description */}
              <div className="text-center mb-5">
                <img src={logo} alt="Logo Policy" className="w-16 h-16 mx-auto mb-3" />
                <h2 className="text-white font-bold text-lg mb-2">UKM POLICY</h2>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Berpartisipasi dan berperan aktif dalam mengembangkan jaringan
                  kerjasama dengan lembaga Politeknik Negeri Lhokseumawe,
                  komunitas Linux dan Open Source lainnya, Perguruan tinggi dan
                  Pemerintah Daerah maupun Pusat.
                </p>
              </div>

              {/* Contact info */}
              <div className="text-left text-sm text-neutral-400 space-y-4">
                <div>
                  <span className="block font-semibold text-white mb-1">ADDRESS</span>
                  <p>Lhokseumawe, Bukit Rata</p>
                </div>
                <div>
                  <span className="block font-semibold text-white mb-1">EMAIL</span>
                  <p>policy.lhokseumawe@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Bottom social icons */}
            <div className="flex justify-center mt-8 gap-4">
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition">
                  <SiTiktok size={22} />
                </div>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition">
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
