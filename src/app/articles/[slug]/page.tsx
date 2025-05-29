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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-12">
        <article className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {data.title || slug.replace(/-/g, ' ')}
          </h1>
          {data.date && (
            <p className="text-gray-500 mb-6">Published on: {data.date}</p>
          )}
          <div
            className="prose prose-lg max-w-none"
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

