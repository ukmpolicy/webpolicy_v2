import { useEffect, useState } from 'react';
import { MediaFilters } from './MediaFilters'; // Import komponen baru
import { MediaGrid } from './MediaGrid'; // Import komponen baru
import { MediaModals } from './MediaModals'; // Import komponen baru

export function MediaTable({ media, albums, selectedAlbumId, mediaType, globalFilter, perPage, onEdit }) {
    const [preview, setPreview] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [moveData, setMoveData] = useState<{ id: number; album_id: string } | null>(null);

    useEffect(() => {
        // Membersihkan state modal saat ada perubahan props utama
        setPreview(null);
        setDeleteId(null);
        setMoveData(null);
    }, [media, selectedAlbumId, mediaType, globalFilter, perPage]);

    return (
        <>
            <MediaFilters albums={albums} selectedAlbumId={selectedAlbumId} mediaType={mediaType} globalFilter={globalFilter} perPage={perPage} />

            <MediaGrid media={media} onEdit={onEdit} onPreview={setPreview} onDelete={setDeleteId} onMove={setMoveData} />

            <MediaModals
                preview={preview}
                setPreview={setPreview}
                deleteId={deleteId}
                setDeleteId={setDeleteId}
                moveData={moveData}
                setMoveData={setMoveData}
                albums={albums}
            />
        </>
    );
}
