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

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) return notFound();

  const { data, contentHtml } = article;
  return (
    <div className="min-h-screen flex flex-col bg-[#181622] text-white">
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-8 py-12">
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
        </article>
      </main>
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

