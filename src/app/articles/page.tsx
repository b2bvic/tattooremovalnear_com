// src/app/articles/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ArticlesPage() {
  const articlesNavLinks = [
    { href: '/', text: 'Back to Home' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header navLinks={articlesNavLinks} />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12">
        <section className="py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Tattoo Removal Articles</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for article list - this would be dynamically generated */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Understanding Laser Tattoo Removal</h2>
              <p className="text-gray-600 mb-4">Discover how laser technology safely removes unwanted tattoos.</p>
              <a href="/articles/understanding-laser-tattoo-removal" className="text-indigo-600 hover:text-indigo-800 font-medium">Read More &rarr;</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Aftercare Tips for Best Results</h2>
              <p className="text-gray-600 mb-4">Proper aftercare is crucial for healing and achieving optimal results.</p>
              <a href="/articles/aftercare-tips" className="text-indigo-600 hover:text-indigo-800 font-medium">Read More &rarr;</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Choosing the Right Clinic</h2>
              <p className="text-gray-600 mb-4">What to look for when selecting a tattoo removal specialist.</p>
              <a href="/articles/choosing-a-clinic" className="text-indigo-600 hover:text-indigo-800 font-medium">Read More &rarr;</a>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">The Cost of Tattoo Removal</h2>
              <p className="text-gray-600 mb-4">Factors that influence the price of tattoo removal procedures.</p>
              <a href="/articles/cost-of-tattoo-removal" className="text-indigo-600 hover:text-indigo-800 font-medium">Read More &rarr;</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
