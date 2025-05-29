import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  image?: string;
  tags?: string[];
}

const articlesDir = path.join(process.cwd(), '_articles');

export async function getAllArticles(): Promise<ArticleMeta[]> {
  const files = await fs.readdir(articlesDir);
  const articles: ArticleMeta[] = [];
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = path.join(articlesDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data } = matter(fileContent);
      articles.push({
        slug: file.replace(/\.md$/, ''),
        title: data.title || file.replace(/-/g, ' ').replace(/\.md$/, ''),
        excerpt: data.excerpt || '',
        date: data.date || '',
        author: data.author ? { name: data.author.name, avatar: data.author.avatar } : undefined,
        image: data.image || undefined,
        tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? [data.tags] : []),
      });
    }
  }
  // Optional: sort by date desc if present
  articles.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return articles;
}
