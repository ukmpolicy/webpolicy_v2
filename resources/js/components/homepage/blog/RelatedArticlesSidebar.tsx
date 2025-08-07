import RelatedArticleCard from '@/pages/homepage/blog/RelatedArticleCard';
import { Article } from '@/pages/homepage/blog/show';
import React from 'react';

interface RelatedArticlesSidebarProps {
    popularArticles: Article[];
    relatedArticles: Article[];
}

const RelatedArticlesSidebar: React.FC<RelatedArticlesSidebarProps> = ({ popularArticles, relatedArticles }) => {
    return (
        <div className="relative lg:col-span-1">
            <div className="sticky top-28 space-y-6">
                {/* Bagian untuk Artikel Populer */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-6 shadow-xl backdrop-blur-md">
                    <h2 className="mb-6 border-b border-neutral-700 pb-3 text-xl font-bold text-white">Artikel Populer</h2>
                    {popularArticles && popularArticles.length > 0 ? (
                        <div className="space-y-4">
                            {popularArticles.map((popularArticle) => (
                                <RelatedArticleCard key={popularArticle.id} article={popularArticle} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Tidak ada artikel populer saat ini.</p>
                    )}
                </div>

                {/* Bagian untuk Artikel Terkait */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-6 shadow-xl backdrop-blur-md">
                    <h2 className="mb-6 border-b border-neutral-700 pb-3 text-xl font-bold text-white">Artikel Terkait</h2>
                    {relatedArticles && relatedArticles.length > 0 ? (
                        <div className="space-y-4">
                            {relatedArticles.map((relatedArticle) => (
                                <RelatedArticleCard key={relatedArticle.id} article={relatedArticle} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Tidak ada artikel terkait saat ini.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RelatedArticlesSidebar;
