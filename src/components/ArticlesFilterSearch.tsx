"use client";
import { useState, useMemo } from "react";
import ArticleList from "@/components/ArticleList";
import { ArticleMeta } from "@/lib/articles";

type ArticlesFilterSearchProps = {
  articles: ArticleMeta[];
  allTags: string[];
};

export default function ArticlesFilterSearch({ articles, allTags }: ArticlesFilterSearchProps) {
  const [activeTag, setActiveTag] = useState("");
  const [search, setSearch] = useState("");

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
          className={`px-3 py-1 rounded-full font-semibold border transition text-sm ${!activeTag ? "bg-purple-700 border-purple-700 text-white" : "bg-white/10 border-purple-700 text-purple-300 hover:bg-purple-800"}`}
          onClick={() => setActiveTag("")}
        >
          All
        </button>
        {allTags.map((tag: string) => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full font-semibold border transition text-sm ${activeTag === tag ? "bg-purple-700 border-purple-700 text-white" : "bg-white/10 border-purple-700 text-purple-300 hover:bg-purple-800"}`}
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
