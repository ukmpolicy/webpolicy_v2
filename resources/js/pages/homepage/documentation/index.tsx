import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

// Komponen yang sudah ada
import AppHeader from '@/components/homepage/app-header';
import AppFooter from '@/components/homepage/app-footer';
import AppLoading from '@/components/homepage/app-loading';

// Komponen baru yang kita buat
import DocumentationHeader from '@/components/documentation/dokumentasi-header';
import AlbumGrid from '@/components/documentation/album-grid';

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

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <AppLoading />;

    return (
        <>
            <Head title="Dokumentasi - UKM POLICY" />
            <AppHeader />
            <main className="bg-black text-white pt-20 sm:pt-20 min-h-screen">
                <DocumentationHeader />
                <AlbumGrid albums={albums} />
            </main>
            <AppFooter />
        </>
    );
};

export default DocumentationPage;
