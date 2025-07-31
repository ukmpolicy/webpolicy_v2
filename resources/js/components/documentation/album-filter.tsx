// src/components/documentation/album-filter.tsx
import { motion } from 'framer-motion';
import { ListFilter, Search } from 'lucide-react';
import React from 'react';

// Definisikan tipe data Album yang sama seperti di DocumentationPage.tsx
interface Album {
    id: number;
    name: string;
    media_count: number;
    preview_media: any[];
}

interface AlbumFilterProps {
    albums: Album[]; // Menerima daftar semua album
    selectedAlbumName: string;
    setSelectedAlbumName: React.Dispatch<React.SetStateAction<string>>;
    currentSearch: string; // Tambahkan prop untuk pencarian teks
    setCurrentSearch: React.Dispatch<React.SetStateAction<string>>; // Tambahkan prop untuk mengatur pencarian teks
}

const fadeInSlideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Deklarasikan window._searchTimeout di luar komponen jika perlu
declare global {
    interface Window {
        _searchTimeout?: ReturnType<typeof setTimeout>;
    }
}

const AlbumFilter: React.FC<AlbumFilterProps> = ({ albums, selectedAlbumName, setSelectedAlbumName, currentSearch, setCurrentSearch }) => {
    const handleAlbumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAlbumName(e.target.value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        setCurrentSearch(newSearch);
        if (window._searchTimeout) {
            clearTimeout(window._searchTimeout);
        }
        window._searchTimeout = setTimeout(() => {
            console.log('Searching for:', newSearch);
        }, 300);
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInSlideUp}
            className="mb-20 flex flex-col items-center justify-between gap-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md md:flex-row"
        >
            {/* Input pencarian teks */}
            <div className="relative w-full md:w-1/2">
                <input
                    type="text"
                    placeholder="Cari album berdasarkan nama..."
                    value={currentSearch}
                    onChange={handleSearchChange}
                    className="w-full rounded-md border-zinc-700 bg-zinc-800 py-3 pr-12 pl-4 text-white placeholder-gray-500 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
                <Search className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Elemen filter dropdown */}
            <div className="relative w-full md:w-1/4">
                <select
                    value={selectedAlbumName}
                    onChange={handleAlbumChange}
                    className="w-full appearance-none rounded-md border-zinc-700 bg-zinc-800 py-3 pr-12 pl-4 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                    <option value="" className="truncate">
                        Semua Album
                    </option>
                    {[...new Set(albums.map((album) => album.name))].map((albumName) => (
                        <option key={albumName} value={albumName} className="truncate bg-zinc-800 text-white hover:bg-red-600 hover:text-white">
                            {albumName}
                        </option>
                    ))}
                </select>
                <ListFilter className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
        </motion.div>
    );
};

export default AlbumFilter;
