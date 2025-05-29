import Link from 'next/link';

export interface ArticleListProps {
  articles: Array<{
    slug: string;
    title: string;
    excerpt?: string;
    author?: { name: string; avatar?: string };
    image?: string;
    tags?: string[];
  }>;
  className?: string;
}

export default function ArticleList({ articles, className = '', columns = 'grid-cols-1' }: ArticleListProps & { columns?: string }) {
  return (
    <div className={`grid ${columns} gap-6 w-full max-w-full ${className}`}>
      {articles.map((a) => (
        <div key={a.slug} className="bg-white/5 border border-purple-900 rounded-2xl shadow-xl p-0 flex flex-col hover:scale-[1.025] hover:shadow-2xl transition overflow-hidden w-full max-w-full">
          {a.image && (
            <Link href={`/articles/${a.slug}`}
              className="block w-full h-40 bg-gray-900 overflow-hidden">
              <img
                src={a.image}
                alt={a.title}
                className="object-cover w-full h-40 hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </Link>
          )}
          <div className="flex-1 flex flex-col p-6 min-w-0">
            {a.tags && a.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {a.tags.map((tag) => (
                  <span key={tag} className="inline-block px-2 py-0.5 rounded bg-purple-800 text-xs text-purple-100 font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <h3 className="text-xl font-semibold text-purple-200 mb-2 truncate">
              <Link href={`/articles/${a.slug}`}>{a.title}</Link>
            </h3>
            {a.excerpt && <p className="text-gray-300 mb-4 line-clamp-3">{a.excerpt}</p>}
            <div className="mt-auto flex items-center gap-2 pt-4">
              {a.author?.avatar && (
                <img
                  src={a.author.avatar}
                  alt={a.author.name}
                  className="w-8 h-8 rounded-full border border-purple-700 bg-gray-800"
                  loading="lazy"
                />
              )}
              {a.author?.name && (
                <span className="text-sm text-purple-300 font-medium">{a.author.name}</span>
              )}
            </div>
            <Link href={`/articles/${a.slug}`} className="text-purple-400 hover:underline font-medium block mt-4">
              Read More &rarr;
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
