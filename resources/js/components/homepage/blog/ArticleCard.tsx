import { Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import React from 'react';

// Pastikan tipe Article, Category, dan Author sama dengan di file index.tsx
interface Category {
    id: number;
    name: string;
}

interface Author {
    id: number;
    name: string;
    picture?: string;
    role?: {
        id: number;
        name: string;
    };
}

interface Article {
    id: number;
    title: string;
    picture?: string;
    slug: string;
    summary: string;
    created_at: string;
    author: Author;
    categories: Category[];
}

interface ArticleCardProps {
    article: Article;
}

const getImageUrl = (path?: string): string => {
    return path ? `/storage/${path}` : '/images/penguin.png';
};

// Fungsi helper untuk mengubah string menjadi Title Case, menangani PascalCase/camelCase
const toTitleCase = (text: string): string => {
    if (!text) return '';
    // 1. Tambahkan spasi sebelum setiap huruf kapital (kecuali yang pertama)
    let formattedText = text.replace(/([A-Z])/g, ' $1').trim();

    // 2. Ubah ke lowercase, pisahkan berdasarkan spasi, kapitalisasi huruf pertama setiap kata, lalu gabungkan
    return formattedText
        .toLowerCase()
        .split(' ')
        .map((word) => {
            if (word.length === 0) return ''; // Tangani jika ada spasi ganda
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <Link
            href={route('blog.show', article.slug)}
            className="group relative block flex h-full transform flex-col overflow-hidden rounded-xl border border-transparent bg-zinc-900 shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-red-600 hover:shadow-2xl"
        >
            {article.picture && (
                <div className="relative h-56 w-full overflow-hidden md:h-64">
                    <img
                        src={getImageUrl(article.picture)}
                        alt={article.title}
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
            )}

            <div className="flex flex-grow flex-col p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                    {article.categories.map((category) => (
                        <span key={category.id} className="inline-block rounded-full bg-red-800/20 px-2.5 py-0.5 text-xs font-semibold text-red-300">
                            {category.name}
                        </span>
                    ))}
                </div>

                <h2 className="mb-2 line-clamp-2 text-lg leading-snug font-extrabold text-white transition-colors duration-300 group-hover:text-red-500">
                    {toTitleCase(article.title)} {/* Menerapkan fungsi toTitleCase di sini */}
                </h2>

                <p className="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-400">{article.summary}</p>

                <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-3 font-medium text-gray-300">
                        <div className="h-8 w-8 overflow-hidden rounded-full">
                            <img
                                className="h-full w-full object-cover"
                                src={article.author?.picture ? getImageUrl(article.author?.picture) : '/assets/penguin.png'}
                                alt="Gambar"
                            />
                        </div>
                        <div>
                            <div className="font-bold">{toTitleCase(article.author.name || 'Penulis Tidak Diketahui')}</div>{' '}
                            {/* MODIFIKASI: Terapkan toTitleCase di sini */}
                            <div className="opacity-70">Mincy</div>
                        </div>
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-gray-300">
                        <Calendar className="h-4 w-4 text-red-400" />
                        {new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
