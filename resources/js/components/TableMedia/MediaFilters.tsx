import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Inertia } from '@inertiajs/inertia';
import { List, Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export function MediaFilters({ albums, selectedAlbumId, mediaType, globalFilter, perPage }) {
    const debouncedSearch = useDebouncedCallback((value) => {
        Inertia.get(
            '/gallery-media',
            {
                album_id: selectedAlbumId !== 'all' ? selectedAlbumId : undefined,
                search: value,
                per_page: perPage,
                media_type: mediaType !== 'all' ? mediaType : undefined,
            },
            { preserveScroll: true, replace: true },
        );
    }, 500);

    const handleFilterChange = (filterName, value) => {
        Inertia.get(
            '/gallery-media',
            {
                album_id: filterName === 'album_id' ? (value !== 'all' ? value : undefined) : selectedAlbumId !== 'all' ? selectedAlbumId : undefined,
                search: globalFilter,
                per_page: filterName === 'per_page' ? value : perPage,
                media_type: filterName === 'media_type' ? (value !== 'all' ? value : undefined) : mediaType !== 'all' ? mediaType : undefined,
            },
            { preserveScroll: true },
        );
    };

    return (
        <>
            {/* Filters */}
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="w-full sm:w-48">
                    <Select value={selectedAlbumId} onValueChange={(val) => handleFilterChange('album_id', val)}>
                        <SelectTrigger>
                            <SelectValue>
                                {selectedAlbumId === 'all'
                                    ? 'Semua Album'
                                    : albums.find((album) => String(album.id) === selectedAlbumId)?.name || 'Pilih Album'}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Album</SelectItem>
                            {albums.map((album) => (
                                <SelectItem key={album.id} value={String(album.id)}>
                                    {album.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full sm:w-48">
                    <Select value={mediaType} onValueChange={(val) => handleFilterChange('media_type', val)}>
                        <SelectTrigger>
                            <SelectValue>{mediaType === 'image' ? 'Gambar' : mediaType === 'video' ? 'Video' : 'Semua'}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="image">Gambar</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Search and Per Page */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="relative w-48">
                    <Input
                        type="search"
                        placeholder="Cari caption..."
                        value={globalFilter}
                        onChange={(e) => debouncedSearch(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                </div>
                <Select value={String(perPage)} onValueChange={(v) => handleFilterChange('per_page', v)}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 20, 50].map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                <List className="mr-2 inline h-4 w-4" />
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}
