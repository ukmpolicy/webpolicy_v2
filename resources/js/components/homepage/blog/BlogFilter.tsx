import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ListFilter, Search } from 'lucide-react';
import React from 'react';

interface Category {
    id: number;
    name: string;
}

interface BlogFilterProps {
    categories: Category[];
    currentSearch: string;
    currentCategoryId: number | '';
    initialPerPage?: number;
    setCurrentSearch: React.Dispatch<React.SetStateAction<string>>;
    setCurrentCategoryId: React.Dispatch<React.SetStateAction<number | ''>>;
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

const BlogFilter: React.FC<BlogFilterProps> = ({
    categories,
    currentSearch,
    currentCategoryId,
    initialPerPage = 6,
    setCurrentSearch,
    setCurrentCategoryId,
}) => {
    const applyFilters = (page: number = 1, newSearch: string = currentSearch, newCategoryId: number | '' = currentCategoryId) => {
        const queryParams: {
            page: number;
            per_page: number;
            search?: string;
            category_id?: number;
        } = {
            page: page,
            per_page: initialPerPage,
        };

        if (newSearch) {
            queryParams.search = newSearch;
        }
        if (newCategoryId) {
            queryParams.category_id = newCategoryId;
        }

        router.get(route('blog.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        setCurrentSearch(newSearch);
        if (window._searchTimeout) {
            clearTimeout(window._searchTimeout);
        }
        window._searchTimeout = setTimeout(() => {
            applyFilters(1, newSearch, currentCategoryId);
        }, 300);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategoryId = e.target.value === '' ? '' : parseInt(e.target.value, 10);
        setCurrentCategoryId(newCategoryId);
        applyFilters(1, currentSearch, newCategoryId);
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInSlideUp}
            className="mb-20 flex flex-col items-center justify-between gap-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md md:flex-row"
        >
            <div className="relative w-full md:w-1/2">
                <input
                    type="text"
                    placeholder="Cari artikel berdasarkan judul atau ringkasan..."
                    value={currentSearch}
                    onChange={handleSearchChange}
                    className="w-full rounded-md border-zinc-700 bg-zinc-800 py-3 pr-12 pl-4 text-white placeholder-gray-500 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
                <Search className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative w-full md:w-1/4">
                <select
                    value={currentCategoryId}
                    onChange={handleCategoryChange}
                    className="w-full appearance-none rounded-md border-zinc-700 bg-zinc-800 py-3 pr-12 pl-4 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                    <option value="">Semua Kategori</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id} className="bg-zinc-800 text-white hover:bg-red-600 hover:text-white">
                            {category.name}
                        </option>
                    ))}
                </select>
                <ListFilter className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
        </motion.div>
    );
};

export default BlogFilter;
