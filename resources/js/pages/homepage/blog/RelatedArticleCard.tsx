// src/components/blog/RelatedArticleCard.tsx
import { Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react'; // Import UserRound dihapus

interface Category {
    id: number;
    name: string;
}

interface Author {
    // Properti role dihapus karena tidak lagi digunakan
    name?: string;
}

interface Article {
    slug: string;
    picture?: string;
    title: string;
    categories: Category[];
    author: Author;
    created_at: string;
}

export default function RelatedArticleCard({ article }: { article: Article }) {
    interface GetImageUrl {
        (path: string | undefined): string;
    }

    const getImageUrl: GetImageUrl = (path) => {
        return path ? `/storage/${path}` : '/images/penguin.png';
    };

    return (
        <Link
            href={route('blog.show', article.slug)}
            className="group flex items-center gap-4 rounded-lg bg-zinc-900 p-3 transition-colors duration-200 hover:bg-zinc-800"
        >
            {/* Gambar Mini */}
            {article.picture && (
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                        src={getImageUrl(article.picture)}
                        alt={article.title}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            )}

            <div className="flex-grow">
                {/* Kategori */}
                <div className="mb-1 flex flex-wrap gap-1">
                    {article.categories.map((category) => (
                        <span key={category.id} className="inline-block rounded-full bg-red-800/20 px-1.5 py-0.5 text-xs font-semibold text-red-300">
                            {category.name}
                        </span>
                    ))}
                </div>
                {/* Judul */}
                <h3 className="line-clamp-2 text-base font-semibold text-white transition-colors duration-200 group-hover:text-red-400">
                    {article.title}
                </h3>
                {/* Meta Info: Hanya menampilkan tanggal */}
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 text-red-400" />
                    {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </div>
            </div>
        </Link>
    );
}
