import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { getAllArticles } from '@/lib/articles';
// ArticleList will be imported in the client component below


export default async function Home() {
  const homeNavLinks = [
    { href: '/articles', text: 'All Articles' },
  ];

  // Dynamically get all articles for cards/links
  const articles = await getAllArticles();
  // Get unique tags
  const allTags = Array.from(new Set(articles.flatMap(a => a.tags || [])));

  // Client-side filtering/search state
  // (This code will be hydrated on client - using useState and useEffect)
  // To avoid Next.js async/SSR issues, wrap filter logic in a client component
  // For now, render a placeholder for the filter/search UI

  return (
    <div className="min-h-screen flex flex-col bg-[#181622] text-white">
      <Header navLinks={homeNavLinks} />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
            Find Tattoo Removal <span className="text-purple-400">Services Near You</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 mx-auto max-w-2xl">
            Enter your location to discover the best tattoo removal specialists in your area.
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-lg mx-auto bg-white/10 backdrop-blur rounded-xl shadow-lg p-6 border border-purple-900">
            <input
              type="text"
              name="location"
              id="location"
              className="w-full md:w-72 px-4 py-2 rounded-lg border border-purple-700 bg-[#181622] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your city or zip code"
            />
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition shadow-lg"
            >
              Search Nearby
            </button>
          </form>
        </section>

        {/* Articles Section with Filter/Search */}
        <section className="py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white/90">
            Learn More About Tattoo Removal
          </h2>
          {/* Tag Filter and Search UI (Client Component) */}
          <ArticlesFilterSearch articles={articles} allTags={allTags} />
          <div className="text-center mt-12">
            <Link href="/articles" className="inline-block px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg transition">
              View All Articles
            </Link>
          </div>
        </section>
      </main>
      <Footer showDisclaimer={true} />
    </div>
  );
}

// Client component for filtering/searching articles
'use client';
import { useState, useMemo } from 'react';
import { ArticleMeta } from '@/lib/articles';
import ArticleList from '@/components/ArticleList';

type ArticlesFilterSearchProps = {
  articles: ArticleMeta[];
  allTags: string[];
};

function ArticlesFilterSearch({ articles, allTags }: ArticlesFilterSearchProps) {
  const [activeTag, setActiveTag] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = articles;
    if (activeTag) {
      result = result.filter((a: ArticleMeta) => (a.tags || []).includes(activeTag));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((a: ArticleMeta) =>
        a.title.toLowerCase().includes(q) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
        (a.tags && a.tags.some((tag: string) => tag.toLowerCase().includes(q)))
      );
    }
    return result;
  }, [articles, activeTag, search]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          className={`px-3 py-1 rounded-full font-semibold border transition text-sm ${!activeTag ? 'bg-purple-700 border-purple-700 text-white' : 'bg-white/10 border-purple-700 text-purple-300 hover:bg-purple-800'}`}
          onClick={() => setActiveTag('')}
        >
          All
        </button>
        {allTags.map((tag: string) => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full font-semibold border transition text-sm ${activeTag === tag ? 'bg-purple-700 border-purple-700 text-white' : 'bg-white/10 border-purple-700 text-purple-300 hover:bg-purple-800'}`}
            onClick={() => setActiveTag(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="w-full md:w-96 px-4 py-2 rounded-lg border border-purple-700 bg-[#181622] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <ArticleList articles={filtered} />
      {filtered.length === 0 && (
        <div className="text-center text-purple-300 mt-8">No articles found.</div>
      )}
    </div>
  );
}
