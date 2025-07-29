import RelatedArticleCard from '@/pages/homepage/blog/RelatedArticleCard';
import React from 'react';

interface RelatedArticlesSidebarProps {
    relatedArticles: Article[];
}

const RelatedArticlesSidebar: React.FC<RelatedArticlesSidebarProps> = ({ relatedArticles }) => {
    return (
        <div className="relative lg:col-span-1">
            <div className="sticky top-28 rounded-lg border border-neutral-800 bg-neutral-950/50 p-6 shadow-xl backdrop-blur-md">
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
    );
};

export default RelatedArticlesSidebar;
