import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion'; // MODIFIKASI: Import motion
import React, { useEffect, useState } from 'react';

// Komponen yang sudah ada
import AppFooter from '@/components/homepage/app-footer';
import AppHeader from '@/components/homepage/app-header';
import AppLoading from '@/components/homepage/app-loading';

// Komponen baru yang kita buat
import AlbumFilter from '@/components/documentation/album-filter'; // Import komponen filter
import AlbumGrid from '@/components/documentation/album-grid';
import DocumentationHeader from '@/components/documentation/dokumentasi-header';
import Pagination from '@/components/homepage/blog/Pagination'; // Import komponen Pagination dari blog

// Definisikan tipe data
interface Album {
    id: number;
    name: string;
    media_count: number;
    preview_media: any[];
}

interface DocumentationPageProps {
    albums: Album[];
}

const DocumentationPage: React.FC<DocumentationPageProps> = ({ albums }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAlbumName, setSelectedAlbumName] = useState<string>(''); // State untuk filter dropdown
    const [currentSearch, setCurrentSearch] = useState<string>(''); // State untuk pencarian teks

    // --- State dan Logika untuk Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const albumsPerPage = 9; // Jumlah album per halaman, sesuai permintaan (muncul ketika ada 9 atau lebih)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Reset halaman ke 1 setiap kali filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedAlbumName, currentSearch]);

    // Logika filter album berdasarkan nama album yang dipilih DAN pencarian teks
    const filteredAlbums = albums.filter((album) => {
        const matchesDropdown = selectedAlbumName === '' || album.name === selectedAlbumName;
        const matchesSearch = album.name.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesDropdown && matchesSearch;
    });

    // --- Logika Pagination ---
    const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);
    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const paginatedAlbums = filteredAlbums.slice(indexOfFirstAlbum, indexOfLastAlbum);

    // Fungsi untuk mengelola klik pagination
    const handleClientPaginationClick = (url: string | null) => {
        if (url) {
            // "url" di sini akan menjadi string representasi nomor halaman
            setCurrentPage(parseInt(url));
            // Opsional: Gulir ke bagian atas grid album saat berpindah halaman
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Membuat struktur link pagination yang sesuai dengan komponen Pagination
    const paginationLinks = [];
    // Link Previous
    paginationLinks.push({
        url: currentPage > 1 ? String(currentPage - 1) : null,
        label: '&laquo; Previous',
        active: false,
    });

    // Link nomor halaman
    for (let i = 1; i <= totalPages; i++) {
        paginationLinks.push({
            url: String(i),
            label: String(i),
            active: i === currentPage,
        });
    }

    // Link Next
    paginationLinks.push({
        url: currentPage < totalPages ? String(currentPage + 1) : null,
        label: 'Next &raquo;',
        active: false,
    });
    // --- Akhir Logika Pagination ---

    // MODIFIKASI: Varian animasi untuk elemen-elemen
    const fadeInSlideUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    if (isLoading) return <AppLoading />;

    return (
        <>
            <Head title="Dokumentasi - UKM POLICY" />
            <AppHeader />
            <main className="min-h-screen bg-black text-white">
                <DocumentationHeader />
                {/* MODIFIKASI: Bungkus section dengan motion.section */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={fadeInSlideUp} // Animasi untuk section keseluruhan konten
                    className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
                >
                    <AlbumFilter
                        albums={albums}
                        selectedAlbumName={selectedAlbumName}
                        setSelectedAlbumName={setSelectedAlbumName}
                        currentSearch={currentSearch}
                        setCurrentSearch={setCurrentSearch}
                    />

                    {/* Gunakan paginatedAlbums di sini */}
                    {paginatedAlbums.length > 0 ? (
                        <AlbumGrid albums={paginatedAlbums} />
                    ) : (
                        // MODIFIKASI: Tambahkan motion.div untuk pesan "Tidak ada album"
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={fadeInSlideUp}
                            className="rounded-lg border border-zinc-800 bg-zinc-900/50 py-10 text-center text-lg text-gray-400"
                        >
                            <p>Tidak ada album yang ditemukan untuk kriteria ini.</p>
                        </motion.div>
                    )}

                    {/* Tampilkan Pagination hanya jika ada lebih dari 1 halaman, menggunakan pagination album. */}
                    {totalPages > 1 && <Pagination links={paginationLinks} handlePaginationClick={handleClientPaginationClick} />}
                </motion.section>{' '}
                {/* MODIFIKASI: Penutup motion.section */}
            </main>
            <AppFooter />
        </>
    );
};

export default DocumentationPage;
