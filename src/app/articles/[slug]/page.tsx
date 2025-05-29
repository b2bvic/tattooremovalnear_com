// src/app/articles/[slug]/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const articleNavLinks = [
    { href: '/articles', text: 'All Articles' },
    { href: '/', text: 'Back to Home' },
  ];

  // In a real application, you would fetch article content based on the slug
  // For example, from a CMS or a local markdown file.

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header navLinks={articleNavLinks} />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12">
        <article className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Article: {slug.replace(/-/g, ' ')} (Placeholder)
          </h1>
          <p className="text-gray-500 mb-6">Published on: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <p>
              This is a placeholder for the article with slug: <strong>{slug}</strong>.
            </p>
            <p>
              In a real application, the content for this article would be fetched dynamically
              based on the slug. This could involve querying a database, reading from a
              Content Management System (CMS), or parsing local Markdown files.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Placeholder Content Sections</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <img src={`https://via.placeholder.com/800x400?text=Article+Image+for+${slug}`} alt={`Placeholder image for ${slug}`} className="my-6 rounded-md" />
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
              in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-6">
              <p>This is an example blockquote within the article content.</p>
            </blockquote>
            <p>
              For now, this page serves as a template for how individual articles will be displayed.
              Future development will involve integrating a content source and rendering the
              actual article text, images, and other media here.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
