import { Link } from '@inertiajs/react';
import { Calendar, Eye } from 'lucide-react';

// Pastikan antarmuka Article sudah diperbarui dengan view_count
interface Category {
    id: number;
    name: string;
}

interface Author {
    name?: string;
}

interface Article {
    slug: string;
    picture?: string;
    title: string;
    categories: Category[];
    author: Author;
    created_at: string;
    view_count: number;
}

export default function RelatedArticleCard({ article }: { article: Article }) {
    const getImageUrl = (path: string | undefined): string => {
        return path ? `/storage/${path}` : '/images/penguin.png';
    };

    return (
        <Link
            href={route('blog.show', article.slug)}
            className="group flex items-center gap-4 rounded-lg bg-zinc-900 p-3 transition-colors duration-200 hover:bg-zinc-800"
        >
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
                {/* PERBAIKAN: Tambahkan pemeriksaan kondisional sebelum map */}
                {article.categories && article.categories.length > 0 && (
                    <div className="mb-1 flex flex-wrap gap-1">
                        {article.categories.map((category) => (
                            <span
                                key={category.id}
                                className="inline-block rounded-full bg-red-800/20 px-1.5 py-0.5 text-xs font-semibold text-red-300"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="line-clamp-2 text-base font-semibold text-white transition-colors duration-200 group-hover:text-red-400">
                    {article.title}
                </h3>

                <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium text-gray-300">
                        <Eye className="h-3 w-3 text-red-400" />
                        {article.view_count}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-gray-300">
                        <Calendar className="h-3 w-3 text-red-400" />
                        {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                </div>
            </div>
        </Link>
    );
}
