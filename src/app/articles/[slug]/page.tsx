// src/app/articles/[slug]/page.tsx
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';

// Define the expected props for this page
type PageProps = {
  params: { slug: string };
};

// Helper to get the absolute path to the articles directory
const articlesDir = path.join(process.cwd(), '_articles');

// Helper to get all article filenames
async function getArticleFilenames() {
  return await fs.readdir(articlesDir);
}

// Helper to get all slugs for static generation
export async function generateStaticParams() {
  const files = await getArticleFilenames();
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({ slug: file.replace(/\.md$/, '') }));
}

// Helper to get article content by slug
async function getArticleBySlug(slug: string) {
  const filePath = path.join(articlesDir, `${slug}.md`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();
    return { data, contentHtml };
  } catch (e) {
    return null;
  }
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleList from '@/components/ArticleList';

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) return notFound();

  // Dynamically get all articles for internal links
  const { getAllArticles } = await import('@/lib/articles');
  const articles = await getAllArticles();
  const otherArticles = articles.filter((a) => a.slug !== slug);
  const relatedArticles = otherArticles.slice(0, 3); // Show 3 related articles
  const { data, contentHtml } = article;
  const navLinks = [
    { href: '/articles', text: 'All Articles' },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-[#181622] text-white">
      <Header navLinks={navLinks} />
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row gap-8">
        {/* Article Content */}
        <section className="flex-1">
          <article className="bg-white/5 border border-purple-900 rounded-2xl shadow-xl p-8 md:p-12 backdrop-blur-lg">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              {data.title || slug.replace(/-/g, ' ')}
            </h1>
            {data.date && (
              <p className="text-purple-300 mb-8 text-sm font-mono">Published on: {data.date}</p>
            )}
            <div
              className="prose prose-lg max-w-none prose-invert prose-a:text-purple-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-headings:text-white prose-blockquote:border-purple-700 prose-blockquote:text-purple-200 prose-strong:text-purple-200 prose-code:bg-[#181622] prose-code:text-purple-300 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-pre:bg-[#181622] prose-pre:text-purple-200 prose-pre:rounded-xl prose-li:marker:text-purple-400"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            {/* Dynamic Internal Links Section */}
            <div className="mt-12 pt-8 border-t border-purple-900">
              <h2 className="text-xl font-bold mb-4 text-purple-200">Internal Links</h2>
              <ArticleList articles={otherArticles} className="" />
            </div>
          </article>
        </section>
        {/* Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0">
          {/* Author/CTA/Related widgets */}
          <div className="bg-white/5 border border-purple-900 rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-purple-200 mb-2">About the Author</h3>
            <p className="text-gray-300 mb-2">TattooRemovalNear.com Team</p>
            <p className="text-gray-400 text-sm">Experts in safe, effective tattoo removal and aftercare guidance.</p>
          </div>
          <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl shadow-xl p-6 mb-8 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Free Consultation</h3>
            <p className="text-purple-200 mb-4">Find the best clinic for your needs—get a quote today!</p>
            <a href="/contact" className="inline-block px-6 py-2 rounded-lg font-semibold bg-white text-purple-700 hover:bg-purple-100 transition">Get Started</a>
          </div>
          <div className="bg-white/5 border border-purple-900 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-purple-200 mb-4">Related Articles</h3>
            <ArticleList articles={relatedArticles} columns="grid-cols-1" />
          </div>
        </aside>
      </main>
      <Footer showDisclaimer={true} />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.data.title || params.slug.replace(/-/g, ' '),
    description: article.data.excerpt || '',
  };
}

